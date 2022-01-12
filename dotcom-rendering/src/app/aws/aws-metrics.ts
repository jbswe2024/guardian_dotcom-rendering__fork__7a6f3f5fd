import {
	CloudWatchClient,
	PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';

interface Metric {
	send: () => void;
}

process.env.AWS_PROFILE = 'frontend';

// how frequently we send metrics to aws in ms
const METRICS_TIME_RESOLUTION = 60 * 1000;

const sendMetric = (m: any[]) => {
	if (m.length === 0) {
		return;
	}

	const cloudWatchClient = new CloudWatchClient({ region: 'eu-west-1' });

	const params = {
		MetricData: m,
		Namespace: 'Application',
	};

	const command = new PutMetricDataCommand(params);

	cloudWatchClient.send(command, (err: any) => {
		if (err) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			console.error(err, err.stack);
		}
	});
};

// handles sending matrics to AWS

const collectAndSendAWSMetrics = (...metrics: Metric[]) => {
	setInterval(() => {
		metrics.forEach((m) => m.send());
	}, METRICS_TIME_RESOLUTION);
};

// to record things like latency

const TimingMetric = (app: string, stage: string, metricName: string) => {
	const values: number[] = [];

	return {
		recordDuration: (n: number) => {
			values.push(n);
		},

		send: () => {
			sendMetric(
				values.map((v) => ({
					Dimensions: [
						{
							Name: 'ApplicationName',
							Value: app,
						},
						{
							Name: 'Stage',
							Value: stage,
						},
					],
					MetricName: metricName,
					Unit: 'Milliseconds',
					Value: v,
				})),
			);

			values.length = 0;
		},
	};
};

// to record memory or file sizes

const BytesMetric = (app: string, stage: string, metricName: string) => {
	const values: number[] = [];

	return {
		record: (n: number) => {
			values.push(n);
		},

		send: () => {
			sendMetric(
				values.map((v) => ({
					Dimensions: [
						{
							Name: 'ApplicationName',
							Value: app,
						},
						{
							Name: 'Stage',
							Value: stage,
						},
					],
					MetricName: metricName,
					Unit: 'Bytes',
					Value: v,
				})),
			);

			values.length = 0;
		},
	};
};

export { collectAndSendAWSMetrics, BytesMetric, TimingMetric };
