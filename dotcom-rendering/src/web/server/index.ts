import type { RequestHandler } from 'express';
import { Standard as ExampleArticle } from '../../../fixtures/generated/articles/Standard';
import { enhanceBlocks } from '../../model/enhanceBlocks';
import { enhanceCards } from '../../model/enhanceCards';
import { enhanceCollections } from '../../model/enhanceCollections';
import { enhanceCommercialProperties } from '../../model/enhanceCommercialProperties';
import { enhanceStandfirst } from '../../model/enhanceStandfirst';
import { enhanceTableOfContents } from '../../model/enhanceTableOfContents';
import {
	extractTrendingTopics,
	extractTrendingTopicsFomFront,
} from '../../model/extractTrendingTopics';
import { groupTrailsByDates } from '../../model/groupTrailsByDates';
import { getSpeedFromTrails } from '../../model/slowOrFastByTrails';
import {
	validateAsAllEditorialNewslettersPageType,
	validateAsArticleType,
	validateAsFrontType,
	validateAsTagFrontType,
} from '../../model/validate';
import { recordTypeAndPlatform } from '../../server/lib/logging-store';
import type { DCRFrontType, FEFrontType } from '../../types/front';
import type { FEArticleType } from '../../types/frontend';
import type { DCRNewslettersPageType } from '../../types/newslettersPage';
import type { DCRTagFrontType, FETagFrontType } from '../../types/tagFront';
import { decideTrail } from '../lib/decideTrail';
import { allEditorialNewslettersPageToHtml } from './allEditorialNewslettersPageToHtml';
import { articleToHtml } from './articleToHtml';
import { blocksToHtml } from './blocksToHtml';
import { frontToHtml } from './frontToHtml';
import { keyEventsToHtml } from './keyEventsToHtml';
import { tagFrontToHtml } from './tagFrontToHtml';

function enhancePinnedPost(format: FEFormat, block?: Block) {
	return block ? enhanceBlocks([block], format)[0] : block;
}

export const enhanceArticleType = (body: unknown): FEArticleType => {
	const data = validateAsArticleType(body);

	const enhancedBlocks = enhanceBlocks(data.blocks, data.format, {
		promotedNewsletter: data.promotedNewsletter,
	});
	return {
		...data,
		blocks: enhancedBlocks,
		pinnedPost: enhancePinnedPost(data.format, data.pinnedPost),
		standfirst: enhanceStandfirst(data.standfirst),
		commercialProperties: enhanceCommercialProperties(
			data.commercialProperties,
		),
		tableOfContents: data.showTableOfContents
			? enhanceTableOfContents(data.format, enhancedBlocks)
			: undefined,
	};
};

const getStack = (e: unknown): string =>
	e instanceof Error ? e.stack ?? 'No error stack' : 'Unknown error';

const enhanceFront = (body: unknown): DCRFrontType => {
	const data: FEFrontType = validateAsFrontType(body);
	return {
		...data,
		webTitle: `${
			data.pressedPage.seoData.title ?? data.pressedPage.seoData.webTitle
		} | The Guardian`,
		pressedPage: {
			...data.pressedPage,
			collections: enhanceCollections(
				data.pressedPage.collections,
				data.editionId,
				data.pageId,
				data.pressedPage.frontProperties.onPageDescription,
			),
		},
		mostViewed: data.mostViewed.map((trail) => decideTrail(trail)),
		mostCommented: data.mostCommented
			? decideTrail(data.mostCommented)
			: undefined,
		mostShared: data.mostShared ? decideTrail(data.mostShared) : undefined,
		trendingTopics: extractTrendingTopicsFomFront(
			data.pressedPage.collections,
		),
	};
};

const enhanceTagFront = (body: unknown): DCRTagFrontType => {
	const data: FETagFrontType = validateAsTagFrontType(body);

	const enhancedCards = enhanceCards(data.contents);
	const speed = getSpeedFromTrails(data.contents);

	return {
		...data,
		tags: data.tags.tags,
		groupedTrails: groupTrailsByDates(
			enhancedCards,
			speed === 'slow' || data.forceDay,
		),
		speed,
		// Pagination information comes from the first tag
		pagination: data.tags.tags[0]?.pagination
			? { ...data.tags.tags[0]?.pagination, sectionName: data.webTitle }
			: undefined,
		trendingTopics: extractTrendingTopics(data.contents),
		header: {
			title: data.webTitle,
			description: data.tags.tags[0]?.properties.bio,
			image: data.tags.tags[0]?.properties.bylineImageUrl,
		},
	};
};

export const handleArticle: RequestHandler = ({ body }, res) => {
	try {
		recordTypeAndPlatform('article', 'web');
		const article = enhanceArticleType(body);
		const resp = articleToHtml({
			article,
		});

		res.status(200).send(resp);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleArticleJson: RequestHandler = ({ body }, res) => {
	try {
		recordTypeAndPlatform('article', 'json');
		const article = enhanceArticleType(body);
		const resp = {
			data: {
				// TODO: We should rename this to 'article' or 'FEArticle', but first we need to investigate
				// where/if this is used.
				CAPIArticle: article,
			},
		};

		res.status(200).send(resp);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handlePerfTest: RequestHandler = (req, res, next) => {
	req.body = ExampleArticle;
	handleArticle(req, res, next);
};

export const handleInteractive: RequestHandler = ({ body }, res) => {
	try {
		recordTypeAndPlatform('interactive', 'web');
		const article = enhanceArticleType(body);
		const resp = articleToHtml({
			article,
		});

		res.status(200).send(resp);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleBlocks: RequestHandler = ({ body }, res) => {
	recordTypeAndPlatform('blocks');
	try {
		const {
			blocks,
			format,
			host,
			pageId,
			webTitle,
			ajaxUrl,
			isAdFreeUser,
			isSensitive,
			videoDuration,
			edition,
			section,
			sharedAdTargeting,
			adUnit,
			switches,
			keywordIds,
		} =
			// The content if body is not checked
			body as FEBlocksRequest;

		const enhancedBlocks = enhanceBlocks(blocks, format);
		const html = blocksToHtml({
			blocks: enhancedBlocks,
			format,
			host,
			pageId,
			webTitle,
			ajaxUrl,
			isAdFreeUser,
			isSensitive,
			videoDuration,
			edition,
			section,
			sharedAdTargeting,
			adUnit,
			switches,
			keywordIds,
		});

		res.status(200).send(html);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleKeyEvents: RequestHandler = ({ body }, res) => {
	recordTypeAndPlatform('keyEvents');
	try {
		const { keyEvents, format, filterKeyEvents } =
			// The content if body is not checked
			body as FEKeyEventsRequest;

		const html = keyEventsToHtml({
			keyEvents,
			format,
			filterKeyEvents,
		});

		res.status(200).send(html);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleFront: RequestHandler = ({ body }, res) => {
	recordTypeAndPlatform('front');
	try {
		const front = enhanceFront(body);
		const html = frontToHtml({
			front,
		});
		res.status(200).send(html);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleFrontJson: RequestHandler = ({ body }, res) => {
	res.json(enhanceFront(body));
};

export const handleTagFront: RequestHandler = ({ body }, res) => {
	recordTypeAndPlatform('tagFront');
	try {
		const tagFront = enhanceTagFront(body);
		const html = tagFrontToHtml({
			tagFront,
		});
		res.status(200).send(html);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};

export const handleTagPageJson: RequestHandler = ({ body }, res) => {
	res.json(enhanceTagFront(body));
};

const enhanceAllEditorialNewslettersPage = (
	body: unknown,
): DCRNewslettersPageType => {
	const newsletterData = validateAsAllEditorialNewslettersPageType(body);
	return {
		...newsletterData,
	};
};

export const handleAllEditorialNewslettersPage: RequestHandler = (
	{ body },
	res,
) => {
	try {
		const newslettersPage = enhanceAllEditorialNewslettersPage(body);
		const html = allEditorialNewslettersPageToHtml({ newslettersPage });
		res.status(200).send(html);
	} catch (e) {
		res.status(500).send(`<pre>${getStack(e)}</pre>`);
	}
};
