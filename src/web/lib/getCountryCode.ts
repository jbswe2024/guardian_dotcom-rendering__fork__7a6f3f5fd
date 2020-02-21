type LocalCountryCodeType = {
    value: string;
    expires: number;
};

function hasExpired(whenItExpires: number) {
    return new Date().getTime() > whenItExpires;
}

export const getCountryCode = async () => {
    const TEN_DAYS = 60 * 60 * 24 * 10;
    const COUNTRY_CODE_KEY = 'gu.geolocation';

    // Read local storage to see if we already have a value
    let localCountryCode: LocalCountryCodeType | null;
    try {
        const item = localStorage.getItem(COUNTRY_CODE_KEY);
        localCountryCode = item ? JSON.parse(item) : null;
    } catch (error) {
        localCountryCode = null;
    }

    if (!localCountryCode || hasExpired(localCountryCode.expires)) {
        const countryCode = await fetch(
            'https://api.nextgen.guardianapps.co.uk/geolocation',
        )
            .then(response => response.json())
            .then(json => json.country);

        // What's this setTimeout business?
        // localStorage calls are syncronous and we don't need to wait for this
        // one so we use setTimeout to put this step on the end of the event queue
        // for later, letting the thread continue
        setTimeout(() => {
            localStorage.setItem(
                COUNTRY_CODE_KEY,
                JSON.stringify({
                    value: countryCode,
                    expires: new Date().getTime() + TEN_DAYS,
                }),
            );
        });
        // Return the country value that we got from our fetch call
        return countryCode;
    }
    // THere was no need to fetch, return the local value
    return localCountryCode.value;
};
