import { useApi } from '@root/src/web/lib/useApi';

import { Placeholder } from '@root/src/web/components/Placeholder';

import { MatchTabs } from './MatchTabs';

type Props = {
	reportUrl: string;
	minByMinUrl: string;
};

const Loading = () => <Placeholder height={230} />;

export const GetMatchTabs = ({ matchUrl, minByMinUrl }: Props) => {
	const { data, error, loading } = useApi<{
		reportUrl: string;
		minByMinUrl: string;
	}>(matchUrl);

	if (loading) return <Loading />;
	if (error) {
		// Send the error to Sentry and then prevent the element from rendering
		window.guardian.modules.sentry.reportError(error, 'match-tabs');

		return null;
	}
	if (data) {
		return <MatchTabs minByMinUrl={} reportUrl={} />;
	}

	return null;
};
