import React from 'react';
import { InnerContainer } from '@frontend/amp/components/InnerContainer';
import { Elements } from '@frontend/amp/components/Elements';
import { css } from 'emotion';
import { ArticleModel } from '@frontend/amp/pages/Article';
import { TopMeta } from '@frontend/amp/components/TopMeta';
import { SubMeta } from '@frontend/amp/components/SubMeta';
import { getToneType, StyledTone } from '@frontend/amp/lib/tag-utils';
import { pillarPalette } from '@frontend/lib/pillars';
import { palette } from '@guardian/pasteup/palette';
import { WithAds } from '@frontend/amp/components/WithAds';
import { findAdSlots } from '@frontend/amp/lib/find-adslots';

const body = (pillar: Pillar, tone: StyledTone) => {
    const bgColorMap = {
        'default-tone': palette.neutral[100],
        'tone/comment': palette.opinion.faded,
        'tone/advertisement-features': palette.neutral[85],
    };
    return css`
        background-color: ${bgColorMap[tone]};
        ${bulletStyle(pillar)}
    `;
};

const bulletStyle = (pillar: Pillar) => css`
    .bullet {
        color: transparent;
        font-size: 1px;
    }

    .bullet:before {
        display: inline-block;
        content: '';
        border-radius: 6px;
        height: 12px;
        width: 12px;
        margin-right: 2px;
        background-color: ${pillarPalette[pillar].main};
        margin-left: 0px;
    }
`;

export const Body: React.FC<{
    pillar: Pillar;
    data: ArticleModel;
    config: ConfigType;
}> = ({ pillar, data, config }) => {
    const tone = getToneType(data.tags);
    const capiElements = data.blocks[0] ? data.blocks[0].elements : [];
    const elementsWithoutAds = Elements(capiElements, pillar, data.isImmersive);
    const slotIndexes = findAdSlots(capiElements);
    const adInfo = {
        section: data.sectionName,
        edition: data.editionId,
        contentType: data.contentType,
        commercialProperties: data.commercialProperties,
        switches: {
            krux: config.switches.krux,
            ampPrebid: config.switches.prebid,
        },
    };

    const elements = data.shouldHideAds ? (
        <>{elementsWithoutAds}</>
    ) : (
        <WithAds
            items={elementsWithoutAds}
            adSlots={slotIndexes}
            adClassName={''}
            adInfo={adInfo}
        />
    );

    return (
        <InnerContainer className={body(pillar, tone)}>
            <TopMeta tone={tone} data={data} />

            {elements}

            <SubMeta
                sections={data.subMetaSectionLinks}
                keywords={data.subMetaKeywordLinks}
                pillar={pillar}
                sharingURLs={data.sharingUrls}
                pageID={data.pageId}
                isCommentable={data.isCommentable}
                guardianBaseURL={data.guardianBaseURL}
            />
        </InnerContainer>
    );
};
