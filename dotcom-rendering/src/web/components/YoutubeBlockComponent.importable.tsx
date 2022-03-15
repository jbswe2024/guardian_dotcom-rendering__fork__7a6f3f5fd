import { useState, useEffect } from 'react';
import { css } from '@emotion/react';

import { space, neutral, body } from '@guardian/source-foundations';
import { SvgAlertRound } from '@guardian/source-react-components';
import { YoutubeAtom } from '@guardian/atoms-rendering';
import type { ConsentState } from '@guardian/consent-management-platform/dist/types';

import { VideoControls } from '@guardian/atoms-rendering/dist/types/types';
import { trackVideoInteraction } from '../browser/ga/ga';
import { record } from '../browser/ophan/ophan';

import { Caption } from './Caption';
import { StickyVideo } from './StickyVideo.importable';

type Props = {
	id: string;
	mediaTitle?: string;
	altText?: string;
	assetId: string;
	expired: boolean;
	format: ArticleFormat;
	role: RoleType;
	hideCaption?: boolean;
	overrideImage?: string;
	posterImage?: {
		url: string;
		width: number;
	}[];
	adTargeting?: AdTargeting;
	isMainMedia?: boolean;
	height?: number;
	width?: number;
	duration?: number; // in seconds
	origin?: string;
	stickyVideos?: boolean;
};

const expiredOverlayStyles = (overrideImage: string) => css`
	height: 0px;
	position: relative;
	background-image: url(${overrideImage});
	background-size: cover;
	background-position: 49% 49%;
	background-repeat: no-repeat;
	padding-bottom: 56%;
	color: ${neutral[100]};
	background-color: ${neutral[20]};
`;

const expiredTextWrapperStyles = css`
	display: flex;
	flex-direction: row;
	align-items: center;

	padding-top: ${space[4]}px;
	padding-bottom: ${space[4]}px;
	padding-left: ${space[1]}px;
	padding-right: ${space[12]}px;
	color: ${neutral[100]};
	background-color: ${neutral[20]};
`;

const expiredSVGWrapperStyles = css`
	padding-right: ${space[1]}px;
	svg {
		width: ${space[12]}px;
		height: ${space[12]}px;
		fill: ${neutral[100]};
	}
`;

export const YoutubeBlockComponent = ({
	id,
	assetId,
	mediaTitle,
	altText,
	format,
	hideCaption,
	overrideImage,
	posterImage,
	expired,
	role,
	adTargeting,
	isMainMedia,
	height = 259,
	width = 460,
	duration,
	origin,
	stickyVideos,
}: Props): JSX.Element => {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [videoControls, setVideoControls] = useState<VideoControls>();
	const [consentState, setConsentState] = useState<ConsentState | undefined>(
		undefined,
	);

	useEffect(() => {
		setVideoControls(undefined);
	}, [videoControls]);

	useEffect(() => {
		const defineConsentState = async () => {
			const { onConsentChange } = await import(
				'@guardian/consent-management-platform'
			);
			onConsentChange((newConsent: ConsentState) => {
				setConsentState(newConsent);
			});
		};

		defineConsentState().catch((error) => {
			window.guardian.modules.sentry.reportError(
				new Error(`Error: ${error}`),
				'youtube-consent',
			);
		});
	}, []);

	const shouldLimitWidth =
		!isMainMedia &&
		(role === 'showcase' || role === 'supporting' || role === 'immersive');

	if (expired) {
		return (
			<figure
				css={css`
					margin-top: 16px;
					margin-bottom: 16px;
				`}
			>
				<div css={overrideImage && expiredOverlayStyles(overrideImage)}>
					<div css={expiredTextWrapperStyles}>
						<div css={expiredSVGWrapperStyles}>
							<SvgAlertRound />
						</div>
						<p
							css={css`
								${body.medium({
									lineHeight: 'tight',
								})}
							`}
						>
							This video has been removed. This could be because
							it launched early, our rights have expired, there
							was a legal issue, or for another reason.
						</p>
					</div>
				</div>
				{!hideCaption && (
					<Caption
						captionText={mediaTitle || ''}
						format={format}
						displayCredit={false}
						shouldLimitWidth={shouldLimitWidth}
						mediaType="Video"
					/>
				)}
			</figure>
		);
	}

	const ophanTracking = (trackingEvent: string) => {
		if (!id) return;
		record({
			video: {
				id: `gu-video-youtube-${id}`,
				eventType: `video:content:${trackingEvent}`,
			},
		});
	};
	const gaTracking = (trackingEvent: string) => {
		if (!id) return;
		trackVideoInteraction({
			trackingEvent,
			elementId: id,
		});
	};

	const videoState = (trackingEvent: string) => {
		switch (trackingEvent) {
			case 'play':
			case 'resume':
				return setIsPlaying(true);
			case 'cued':
			case 'end':
			case 'paused':
			default:
				return setIsPlaying(false);
		}
	};

	return (
		<div data-chromatic="ignore" data-component="youtube-atom">
			<StickyVideo isActive={isPlaying && !!stickyVideos} videoId={id}>
				<YoutubeAtom
					videoControls={videoControls}
					assetId={assetId}
					overrideImage={
						overrideImage
							? [
									{
										srcSet: [
											{
												src: overrideImage,
												width: 500, // we do not have width for overlayImage so set a random number
											},
										],
									},
							  ]
							: undefined
					}
					posterImage={
						posterImage
							? [
									{
										srcSet: posterImage.map((img) => ({
											src: img.url,
											width: img.width,
										})),
									},
							  ]
							: undefined
					}
					role={role}
					alt={altText || mediaTitle || ''}
					adTargeting={adTargeting}
					consentState={consentState}
					height={height}
					width={width}
					title={mediaTitle}
					duration={duration}
					eventEmitters={[ophanTracking, gaTracking, videoState]}
					pillar={format.theme}
					origin={
						process.env.NODE_ENV === 'development' ? '' : origin
					}
				/>
				{!hideCaption && (
					<Caption
						captionText={mediaTitle || ''}
						format={format}
						displayCredit={false}
						shouldLimitWidth={shouldLimitWidth}
						mediaType="Video"
					/>
				)}
			</StickyVideo>
		</div>
	);
};
