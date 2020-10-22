// ----- Imports ----- //

import React, { FC } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';

import { Format } from '@guardian/types/Format';
import { getThemeStyles } from 'themeStyles';
import { Contributor, isSingleContributor } from 'contributor';
import { darkModeCss } from 'styles';
import { Design } from '@guardian/types/Format';


// ----- Component ----- //

interface Props extends Format {
    contributors: Contributor[];
}

const styles = (kicker: string, inverted: string): SerializedStyles => css`
    ${textSans.small()}
    color: ${kicker};
    display: block;
    padding: 0;
    border: none;
    background: none;
    margin-left: 0;

    ${darkModeCss`
        color: ${inverted};
    `}
`;

function getStyles({ theme }: Format): SerializedStyles {
    const { kicker, inverted } = getThemeStyles(theme);

    return styles(kicker, inverted);
}

const Follow: FC<Props> = ({ contributors, ...format }) => {
    const [contributor] = contributors;

    if (
        isSingleContributor(contributors) &&
        contributor.apiUrl !== '' &&
        format.design !== Design.AdvertisementFeature
    ) {
        return (
            <button
                className="js-follow"
                css={getStyles(format)}
                data-id={contributor.id}
                data-display-name={contributor.name}
            >
                <span className="js-status">Follow </span>
                { contributor.name }
            </button>
        );
    }

    return null;

}


// ----- Exports ----- //

export default Follow;
