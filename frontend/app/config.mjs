export const config = {
    environment: '', // Will be set to 'development', 'staging', or 'production' by main.mjs
    auth0: {
        domain: '', // Will be set by main.mjs
        clientId: '', // Will be set by main.mjs
    },
    course: {
        name: 'hu-3',
        startDateTime: new Date(Date.UTC(2020, 1 - 1, 12, /* Must be the Sunday morning 0:00 CET when the course started */
            -1 /* -2 if it was daylight saving time, -1 otherwise */)),
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        photoUpload: {
            url: 'https://d2l6ndiv9r7vhe.cloudfront.net/get-signed-url',
        }
    },
    customerServiceEmailAddress: 'photatophotato@gmail.com',
};

export const productionConfig = {
    environment: 'production',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'S31BLLD6U12BnIt92b5yq5xAQ1Dt37ey'
    }
};

export const stagingConfig = {
    environment: 'staging',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'iK62e1zUO6CMbmg6Y8qpfFiDu2qyhHTD'
    }
};

export const developmentConfig = {
    environment: 'development',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'JLFeh90tCqr0KebY2hUWYBlhHOuHXl5f'
    }
};
