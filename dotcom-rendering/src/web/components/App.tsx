import React, { useState, useEffect } from 'react';

import { log } from '@guardian/libs';
import type { BrazeMessagesInterface } from '@guardian/braze-components/logic';
import { ReaderRevenueLinks } from './ReaderRevenueLinks';
import { SlotBodyEnd } from './SlotBodyEnd/SlotBodyEnd';
import { StickyBottomBanner } from './StickyBottomBanner/StickyBottomBanner';

import { Portal } from './Portal';
import { useOnce } from '../lib/useOnce';

import { incrementAlreadyVisited } from '../lib/alreadyVisited';

import { buildBrazeMessages } from '../lib/braze/buildBrazeMessages';
import { getOphanRecordFunction } from '../browser/ophan/ophan';
import { Lazy } from './Lazy';

type Props = {
	CAPI: CAPIBrowserType;
};

let renderCount = 0;
export const App = ({ CAPI }: Props) => {
	log('dotcom', `App.tsx render #${(renderCount += 1)}`);

	const [brazeMessages, setBrazeMessages] =
		useState<Promise<BrazeMessagesInterface>>();

	const pageViewId = window.guardian?.config?.ophan?.pageViewId;

	const ophanRecord = getOphanRecordFunction();

	useEffect(() => {
		incrementAlreadyVisited();
	}, []);

	useOnce(() => {
		setBrazeMessages(buildBrazeMessages(CAPI.config.idApiUrl));
	}, [CAPI.config.idApiUrl]);

	return (
		// Do you need to HydrateOnce or do you want a Portal?
		//
		// HydrateOnce: If your component is server rendered and you're hydrating it with
		// more data or making it interactive on the client and you do not need to access
		// global application state.
		//
		// Portal: If your component is not server rendered but a pure client-side component
		// and/or you want to access global application state, you want to use a Portal.
		//
		// Note: Both require a 'root' element that needs to be server rendered.
		<React.StrictMode>
			<Portal rootId="reader-revenue-links-header">
				<ReaderRevenueLinks
					urls={CAPI.nav.readerRevenueLinks.header}
					edition={CAPI.editionId}
					dataLinkNamePrefix="nav2 : "
					inHeader={true}
					remoteHeaderEnabled={CAPI.config.remoteHeader}
					pageViewId={pageViewId}
					contributionsServiceUrl={CAPI.contributionsServiceUrl}
					ophanRecord={ophanRecord}
				/>
			</Portal>
			<Portal rootId="slot-body-end">
				<SlotBodyEnd
					contentType={CAPI.contentType}
					sectionName={CAPI.sectionName}
					sectionId={CAPI.config.section}
					shouldHideReaderRevenue={CAPI.shouldHideReaderRevenue}
					isMinuteArticle={CAPI.pageType.isMinuteArticle}
					isPaidContent={CAPI.pageType.isPaidContent}
					tags={CAPI.tags}
					contributionsServiceUrl={CAPI.contributionsServiceUrl}
					brazeMessages={brazeMessages}
					idApiUrl={CAPI.config.idApiUrl}
					stage={CAPI.stage}
					pageId={CAPI.pageId}
					keywordsId={CAPI.config.keywordIds}
				/>
			</Portal>
			<Portal rootId="reader-revenue-links-footer">
				<Lazy margin={300}>
					<ReaderRevenueLinks
						urls={CAPI.nav.readerRevenueLinks.footer}
						edition={CAPI.editionId}
						dataLinkNamePrefix="footer : "
						inHeader={false}
						remoteHeaderEnabled={false}
						pageViewId={pageViewId}
						contributionsServiceUrl={CAPI.contributionsServiceUrl}
						ophanRecord={ophanRecord}
					/>
				</Lazy>
			</Portal>
			<Portal rootId="bottom-banner">
				<StickyBottomBanner
					brazeMessages={brazeMessages}
					contentType={CAPI.contentType}
					sectionName={CAPI.sectionName}
					section={CAPI.config.section}
					tags={CAPI.tags}
					isPaidContent={CAPI.pageType.isPaidContent}
					isPreview={!!CAPI.isPreview}
					shouldHideReaderRevenue={CAPI.shouldHideReaderRevenue}
					isMinuteArticle={CAPI.pageType.isMinuteArticle}
					isSensitive={CAPI.config.isSensitive}
					contributionsServiceUrl={CAPI.contributionsServiceUrl}
					idApiUrl={CAPI.config.idApiUrl}
					switches={CAPI.config.switches}
					pageId={CAPI.pageId}
					keywordsId={CAPI.config.keywordIds}
				/>
			</Portal>
		</React.StrictMode>
	);
};
