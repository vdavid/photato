export const config = {
    environment: '', // Will be set to 'development', 'staging', or 'production' by main.mjs
    auth0: {
        domain: '', // Will be set by main.mjs
        clientId: '', // Will be set by main.mjs
    },
    course: {
        name: 'hu-3', // TODO: Fake date for testing ↓↓↓
        startDateTime: new Date(Date.UTC(2020, 3 - 1, 15, /* Must be the Sunday morning 0:00 CET when the course started */
            -1 /* -2 if it was daylight saving time, -1 otherwise */)),
        weekCount: 12,
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        photoUpload: {
            url: 'https://d2rw8z9jy7vx22.cloudfront.net/get-signed-url',
        }
    },
    customerServiceEmailAddress: 'photatophotato@gmail.com',
    featureSwitches: {
    },
};

export const productionConfig = {
    environment: 'production',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'S31BLLD6U12BnIt92b5yq5xAQ1Dt37ey'
    },
    featureSwitches: {
    },
};

export const stagingConfig = {
    environment: 'staging',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'iK62e1zUO6CMbmg6Y8qpfFiDu2qyhHTD'
    },
    featureSwitches: {
    },
};

export const developmentConfig = {
    environment: 'development',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'JLFeh90tCqr0KebY2hUWYBlhHOuHXl5f'
    },
    featureSwitches: {
    },
};
