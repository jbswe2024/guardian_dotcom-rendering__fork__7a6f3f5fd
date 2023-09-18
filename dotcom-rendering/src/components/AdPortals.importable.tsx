import { AdSlot as BridgetAdSlot } from '@guardian/bridget/AdSlot';
import type { IRect as BridgetRect } from '@guardian/bridget/Rect';
import { isNonNullable } from '@guardian/libs';
import libDebounce from 'lodash.debounce';
import type { RefObject } from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCommercialClient } from '../lib/bridgetApi';
import { AdSlot } from './AdSlot.apps';

const calculateAdPosition = (element: Element): BridgetRect => {
	const elementRect = element.getBoundingClientRect();

	const scrollLeft =
		document.scrollingElement !== null
			? document.scrollingElement.scrollLeft
			: document.body.scrollLeft;
	const scrollTop =
		document.scrollingElement !== null
			? document.scrollingElement.scrollTop
			: document.body.scrollTop;

	// Potential optimisation: round these numbers so they are less specific when we compare past and current ad positions. This may result in fewer calls to briget to update ad positions.
	return {
		x: elementRect.left + scrollLeft,
		y: elementRect.top + scrollTop,
		width: elementRect.width,
		height: elementRect.height,
	};
};

const positionsEqual = (a: BridgetRect, b: BridgetRect): boolean =>
	a.height === b.height && a.width === b.width && a.x === b.x && a.y === b.y;

const getIsPremium = () => Promise.resolve(false);

/**
 * The type for {@linkcode adSlots} can contain null. Whilst we don't believe
 * any element would result in a null as they will always be defined by the time
 * this gets called in the react lifecycle, we filter any nulls out so that we
 * be certain the returned array contains only adslots.
 */
const calculateAdPositions = (
	adSlots: RefObject<HTMLDivElement>[],
): BridgetAdSlot[] =>
	adSlots
		.map((slot) => slot.current)
		.filter(isNonNullable)
		.map(
			(slot, index) =>
				new BridgetAdSlot({
					rect: calculateAdPosition(slot),
					isSquare: index === 0,
				}),
		);

const adsHaveMoved = (
	oldPositions: BridgetAdSlot[],
	newPositions: BridgetAdSlot[],
): boolean =>
	newPositions.some((newPosition, index) => {
		const oldPositionRect = oldPositions[index]?.rect;

		if (oldPositionRect === undefined) {
			return false;
		} else {
			return !positionsEqual(newPosition.rect, oldPositionRect);
		}
	});

const updateAds = (positions: BridgetAdSlot[]) => {
	return getCommercialClient().updateAdverts(positions);
};

const debounceUpdateAds = libDebounce(updateAds, 100, { leading: true });

export const AdPortals = () => {
	// Server-rendered placeholder elements for ad slots to be inserted into.
	const [adPlaceholders, setAdPlaceholders] = useState<Element[]>([]);
	// References to client-side rendered ad slots.
	const adSlots = useRef<RefObject<HTMLDivElement>[]>([]);
	// Positions of client-side rendered ad slots.
	const adPositions = useRef<BridgetAdSlot[]>([]);
	// The height of the body element.
	const bodyHeight = useRef(0);

	/**
	 * Setup Ads
	 *
	 * After first render, and only after first render, check if the user has
	 * the premium tier. If not, set up ads:
	 * - Look for ad placeholder elements in the page and store them
	 * - Set up references to client-side rendered ad slots
	 * - Store the height of the body element
	 *
	 *
	 * Update Ads
	 *
	 * Ask the native layer to update the positions of the adverts whenever the
	 * body element's height changes, because this typically means the ad slot
	 * positions will have changed.
	 *
	 * A resize observer is used for this.
	 *
	 */
	useEffect(() => {
		let resizeObserver: ResizeObserver | undefined = undefined;

		void getIsPremium().then((isPremium) => {
			if (!isPremium) {
				const placeholders = Array.from(
					document.getElementsByClassName('ad-portal-placeholder'),
				);

				setAdPlaceholders(placeholders);
				for (const [i, _] of placeholders.entries()) {
					adSlots.current[i] = createRef();
				}

				resizeObserver = new ResizeObserver((entries) => {
					if (
						entries[0] !== undefined &&
						entries[0].target.clientHeight !== bodyHeight.current
					) {
						const newAdPositions = calculateAdPositions(
							adSlots.current,
						);

						if (adsHaveMoved(adPositions.current, newAdPositions)) {
							void debounceUpdateAds(newAdPositions);
							adPositions.current = newAdPositions;
						}

						bodyHeight.current = entries[0].target.clientHeight;
					}
				});

				resizeObserver.observe(document.body);
			}
		});

		bodyHeight.current = document.body.clientHeight;
		return () => resizeObserver?.disconnect();
	}, []);

	/**
	 * Insert Ads
	 *
	 * Once the list of ad placeholders is available, the last render should
	 * have populated the client-side ad slots. We can use references to those
	 * ad slots to calculate their positions, and pass these to the native
	 * layer so that it can insert ads.
	 */
	useEffect(() => {
		if (adPlaceholders.length !== 0) {
			const newAdPositions = calculateAdPositions(adSlots.current);
			void getCommercialClient().insertAdverts(newAdPositions);
			adPositions.current = newAdPositions;
		}
	}, [adPlaceholders]);

	return (
		<>
			{adPlaceholders.map((ad, index) =>
				createPortal(
					<AdSlot
						key={ad.id}
						isHidden={false}
						isSquare={index === 0}
						index={index}
						ref={adSlots.current[index]}
					/>,
					ad,
				),
			)}
		</>
	);
};
