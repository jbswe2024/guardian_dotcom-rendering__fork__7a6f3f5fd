import { getRaven, reportError, setWIndowOnError } from './raven';
import { startup } from '@frontend/web/browser/startup';

const init = () => {
    return Promise.resolve().then(() => {
        const raven = getRaven();
        try {
            if (!raven) {
                return;
            }

            // override window.onError
            setWIndowOnError(raven);

            // expose core function
            window.guardian.modules.raven = { reportError };
        } catch {
            /**
             * Raven will have reported any unhandled promise
             * rejections from this chain so return here.
             */
            return;
        }
    });
};

startup('raven', null, init);
