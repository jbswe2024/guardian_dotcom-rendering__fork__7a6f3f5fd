import { css, Global } from '@emotion/react';
import { ArticleDesign } from '@guardian/libs';
import { brandAlt, focusHalo, neutral } from '@guardian/source-foundations';
import { StrictMode } from 'react';
import { DecideLayout } from '../layouts/DecideLayout';
import { buildAdTargeting } from '../lib/ad-targeting';
import { filterABTestSwitches } from '../model/enhance-switches';
import type { NavType } from '../model/extract-nav';
import type { DCRArticle } from '../types/frontend';
import type { RenderingTarget } from '../types/renderingTarget';
import { AlreadyVisited } from './AlreadyVisited.importable';
import { BrazeMessaging } from './BrazeMessaging.importable';
import { FocusStyles } from './FocusStyles.importable';
import { Island } from './Island';
import { LightboxHash } from './LightboxHash.importable';
import { LightboxJavascript } from './LightboxJavascript.importable';
import { LightboxLayout } from './LightboxLayout';
import { Metrics } from './Metrics.importable';
import { ReaderRevenueDev } from './ReaderRevenueDev.importable';
import { SendTargetingParams } from './SendTargetingParams.importable';
import { SetABTests } from './SetABTests.importable';
import { SetAdTargeting } from './SetAdTargeting.importable';
import { SkipTo } from './SkipTo';

interface BaseProps {
	article: DCRArticle;
	format: ArticleFormat;
	renderingTarget: RenderingTarget;
}

interface WebProps extends BaseProps {
	renderingTarget: 'Web';
	NAV: NavType;
}

interface AppProps extends BaseProps {
	renderingTarget: 'Apps';
}

/**
 * @description
 * Article is a high level wrapper for article pages on Dotcom. Sets strict mode and some globals
 */
export const ArticlePage = (props: WebProps | AppProps) => {
	const { article, format, renderingTarget } = props;

	const adTargeting = buildAdTargeting({
		isAdFreeUser: article.isAdFreeUser,
		isSensitive: article.config.isSensitive,
		edition: article.config.edition,
		section: article.config.section,
		sharedAdTargeting: article.config.sharedAdTargeting,
		adUnit: article.config.adUnit,
	});

	return (
		<StrictMode>
			<Global
				styles={css`
					/* Crude but effective mechanism. Specific components may need to improve on this behaviour. */
					/* The not(.src...) selector is to work with Source's FocusStyleManager. */
					*:focus {
						${focusHalo}
					}
					::selection {
						background: ${brandAlt[400]};
						color: ${neutral[7]};
					}
				`}
			/>
			<SkipTo id="maincontent" label="Skip to main content" />
			<SkipTo id="navigation" label="Skip to navigation" />
			{article.config.switches.lightbox && article.imagesForLightbox && (
				<>
					<LightboxLayout
						imageCount={article.imagesForLightbox.length}
					/>
					<Island clientOnly={true}>
						<LightboxHash />
					</Island>
					<Island clientOnly={true} deferUntil="hash">
						<LightboxJavascript
							format={format}
							images={article.imagesForLightbox}
						/>
					</Island>
				</>
			)}
			<Island clientOnly={true} deferUntil="idle">
				<FocusStyles />
			</Island>
			{(format.design === ArticleDesign.LiveBlog ||
				format.design === ArticleDesign.DeadBlog) && (
				<SkipTo id={'key-events-carousel'} label="Skip to key events" />
			)}
			{renderingTarget === 'Web' && (
				<>
					<SkipTo id="navigation" label="Skip to navigation" />
					<Island clientOnly={true} deferUntil="idle">
						<AlreadyVisited />
					</Island>
					<Island clientOnly={true} deferUntil="idle">
						<Metrics
							commercialMetricsEnabled={
								!!article.config.switches.commercialMetrics
							}
						/>
					</Island>
					<Island clientOnly={true} deferUntil="idle">
						<BrazeMessaging idApiUrl={article.config.idApiUrl} />
					</Island>
					<Island clientOnly={true} deferUntil="idle">
						<ReaderRevenueDev
							shouldHideReaderRevenue={
								article.shouldHideReaderRevenue
							}
						/>
					</Island>
					<Island clientOnly={true}>
						<SetABTests
							abTestSwitches={filterABTestSwitches(
								article.config.switches,
							)}
							pageIsSensitive={article.config.isSensitive}
							isDev={!!article.config.isDev}
						/>
					</Island>
				</>
			)}
			{renderingTarget === 'Web' ? (
				<Island clientOnly={true}>
					<SetAdTargeting adTargeting={adTargeting} />
				</Island>
			) : (
				<Island clientOnly={true}>
					<SendTargetingParams
						editionCommercialProperties={
							article.commercialProperties[article.editionId]
						}
					/>
				</Island>
			)}
			{renderingTarget === 'Apps' ? (
				<DecideLayout
					article={article}
					format={format}
					renderingTarget={renderingTarget}
				/>
			) : (
				<DecideLayout
					article={article}
					NAV={props.NAV}
					format={format}
					renderingTarget={renderingTarget}
				/>
			)}
		</StrictMode>
	);
};
