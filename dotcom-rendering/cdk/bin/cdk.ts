import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DotcomRendering } from '../lib/dotcom-rendering';

const app = new App();

const sharedProps = {
	app: 'rendering',
	stack: 'frontend',
	region: 'eu-west-1',
	amiRecipe: 'dotcom-rendering-ARM-jammy-node-18.17.0',
};

new DotcomRendering(app, 'DotcomRendering-PROD', {
	...sharedProps,
	stage: 'PROD',
	minCapacity: 15,
	maxCapacity: 60,
	instanceType: 't4g.small',
});

new DotcomRendering(app, 'DotcomRendering-CODE', {
	...sharedProps,
	stage: 'CODE',
	minCapacity: 1,
	maxCapacity: 4,
	instanceType: 't4g.micro',
});
