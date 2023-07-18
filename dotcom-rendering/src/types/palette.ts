export type Colour = string;

export type Palette = {
	text: {
		headline: Colour;
		headlineWhenMatch: Colour;
		seriesTitle: Colour;
		sectionTitle: Colour;
		seriesTitleWhenMatch: Colour;
		byline: Colour;
		twitterHandle: Colour;
		twitterHandleBelowDesktop: Colour;
		caption: Colour;
		captionLink: Colour;
		subMeta: Colour;
		subMetaLabel: Colour;
		subMetaLink: Colour;
		syndicationButton: Colour;
		articleLink: Colour;
		articleLinkHover: Colour;
		cardHeadline: Colour;
		cardByline: Colour;
		cardKicker: Colour;
		dynamoHeadline: Colour;
		dynamoKicker: Colour;
		dynamoMeta: Colour;
		linkKicker: Colour;
		cardStandfirst: Colour;
		cardFooter: Colour;
		headlineByline: Colour;
		standfirst: Colour;
		standfirstLink: Colour;
		lastUpdated: Colour;
		branding: Colour;
		disclaimerLink: Colour;
		signInLink: Colour;
		richLink: Colour;
		witnessIcon: Colour;
		witnessAuthor: Colour;
		witnessTitle: Colour;
		carouselTitle: Colour;
		pullQuote: Colour;
		pagination: Colour;
		pullQuoteAttribution: Colour;
		dropCap: Colour;
		blockquote: Colour;
		numberedTitle: Colour;
		numberedPosition: Colour;
		overlaidCaption: Colour;
		shareCount: Colour;
		shareCountUntilDesktop: Colour;
		cricketScoreboardLink: Colour;
		keyEvent: Colour;
		keyEventFromDesktop: Colour;
		keyEventTime: Colour;
		filterButton: Colour;
		filterButtonHover: Colour;
		filterButtonActive: Colour;
		betaLabel: Colour;
		designTag: Colour;
		dateLine: Colour;
		tableOfContents: Colour;
		expandableAtom: Colour;
	};
	background: {
		article: Colour;
		analysisContrast: Colour;
		analysisContrastHover: Colour;
		audioAtom: Colour;
		seriesTitle: Colour;
		sectionTitle: Colour;
		avatar: Colour;
		card: Colour;
		headline: Colour;
		headlineByline: Colour;
		bullet: Colour;
		bulletStandfirst: Colour;
		header: Colour;
		standfirst: Colour;
		richLink: Colour;
		imageTitle: Colour;
		speechBubble: Colour;
		carouselDot: Colour;
		headlineTag: Colour;
		mostViewedTab: Colour;
		matchNav: Colour;
		analysisUnderline: Colour;
		matchStats: Colour;
		ageWarning: Colour;
		keyEventBullet: Colour;
		summaryEventBullet: Colour;
		keyEvent: Colour;
		keyEventFromDesktop: Colour;
		filterButton: Colour;
		filterButtonHover: Colour;
		filterButtonActive: Colour;
		treat: Colour;
		designTag: Colour;
		pullQuote: Colour;
		lightboxDivider: Colour;
		messageForm: Colour;
		expandableAtom: Colour;
	};
	fill: {
		commentCount: Colour;
		commentCountUntilDesktop: Colour;
		shareCountIcon: Colour;
		shareCountIconUntilDesktop: Colour;
		shareIcon: Colour;
		shareIconGrayBackground: Colour;
		cameraCaptionIcon: Colour;
		richLink: Colour;
		quoteIcon: Colour;
		blockquoteIcon: Colour;
		twitterHandleBelowDesktop: Colour;
		twitterHandle: Colour;
		guardianLogo: Colour;
	};
	border: {
		syndicationButton: Colour;
		subNav: Colour;
		articleLink: Colour;
		articleLinkHover: Colour;
		liveBlock: Colour;
		pinnedPost: Colour;
		standfirstLink: Colour;
		headline: Colour;
		standfirst: Colour;
		richLink: Colour;
		navPillar: Colour;
		article: Colour;
		lines: Colour;
		matchTab: Colour;
		activeMatchTab: Colour;
		cricketScoreboardTop: Colour;
		cricketScoreboardDivider: Colour;
		cardSupporting: Colour;
		keyEvent: Colour;
		filterButton: Colour;
		secondary: Colour;
		pagination: Colour;
	};
	topBar: {
		card: Colour;
	};
	hover: {
		headlineByline: Colour;
		standfirstLink: Colour;
		keyEventLink: Colour;
		keyEventBullet: Colour;
		summaryEventBullet: Colour;
		pagination: Colour;
	};
};

export type ContainerOverrides = {
	text: {
		cardHeadline?: Colour;
		cardStandfirst?: Colour;
		cardKicker?: Colour;
		cardByline?: Colour;
		cardFooter?: Colour;
		cardCommentCount?: Colour;
		dynamoHeadline?: Colour;
		dynamoKicker?: Colour;
		dynamoSublinkKicker?: Colour;
		dynamoMeta?: Colour;
		container: Colour;
		containerFooter: Colour;
		containerToggle: Colour;
		containerDate: Colour;
		containerSummary: Colour;
	};
	border: {
		container: Colour;
		lines: Colour;
		carouselArrow: Colour;
	};
	background: {
		container: Colour;
		containerLeftColumn?: Colour;
		containerOuter?: Colour;
		containerSummary?: Colour;
		card?: Colour;
		carouselDot: Colour;
		carouselArrow: Colour;
		carouselArrowHover: Colour;
	};
	topBar?: {
		card?: Colour;
	};
};
