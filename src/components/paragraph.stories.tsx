// ----- Imports ----- //

import React, { FC } from 'react';

import Paragraph from './paragraph';
import { Design, Display, Pillar } from '@guardian/types/Format';


// ----- Stories ----- //

const standard = {
    design: Design.Article,
    display: Display.Standard,
    theme: Pillar.News
}

const labs = {
    design: Design.AdvertisementFeature,
    display: Display.Standard,
    theme: Pillar.News
}

const Default: FC = () =>
    <Paragraph format={standard}>
        Ever since Mexico City was founded on an island in the lake of Texcoco its inhabitants have
        dreamed of water: containing it, draining it and now retaining it.
    </Paragraph>

const Labs: FC = () =>
    <Paragraph format={labs}>
        Ever since Mexico City was founded on an island in the lake of Texcoco its inhabitants have
        dreamed of water: containing it, draining it and now retaining it.
    </Paragraph>


// ----- Exports ----- //

export default {
    component: Paragraph,
    title: 'Paragraph',
}

export {
    Default,
    Labs
}
