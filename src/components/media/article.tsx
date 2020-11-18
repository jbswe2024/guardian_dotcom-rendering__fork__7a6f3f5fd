// ----- Imports ----- //

import { css } from '@emotion/core';
import { breakpoints, from } from '@guardian/src-foundations/mq';
import { background } from '@guardian/src-foundations/palette';
import Headline from 'components/headline';
import Body from 'components/media/articleBody';
import Series from 'components/media/articleSeries';
import Byline from 'components/media/byline';
import Tags from 'components/media/tags';
import FooterCcpa from 'components/shared/footer';
import RelatedContent from 'components/shared/relatedContent';
import Standfirst from 'components/standfirst';
import HeaderMedia from 'headerMedia';
import type { Item } from 'item';
import type { FC, ReactNode } from 'react';
import { articleWidthStyles, relatedContentStyles } from 'styles';

// ----- Styles ----- //

const Styles = css`
	background: ${background.inverse};
	height: 100vh;
`;

const BorderStyles = css`
	${from.wide} {
		width: ${breakpoints.wide}px;
		margin: 0 auto;
	}
`;

// ----- Component ----- //

interface Props {
	item: Item;
	children: ReactNode[];
}

const Media: FC<Props> = ({ item, children }) => (
	<main css={[Styles]}>
		<article css={BorderStyles}>
			<header>
				<HeaderMedia item={item} />
				<div css={articleWidthStyles}>
					<Series series={item.series} theme={item.theme} />
				</div>
				<Headline item={item} />
				<div css={articleWidthStyles}>
					<Standfirst item={item} />
				</div>
				<section>
					<Byline
						publicationDate={item.publishDate}
						className={articleWidthStyles}
						item={item}
					/>
				</section>
			</header>
			<Body
				theme={item.theme}
				className={[articleWidthStyles]}
				format={item}
			>
				{children}
			</Body>
			<section css={articleWidthStyles}>
				<Tags tags={item.tags} />
			</section>
		</article>
		<section css={relatedContentStyles}>
			<RelatedContent content={item.relatedContent} />
		</section>
		<div id="articleFooter">
			<FooterCcpa isCcpa={false} />
		</div>
	</main>
);

// ----- Exports ----- //

export default Media;
