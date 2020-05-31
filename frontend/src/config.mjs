const cloudFrontBackUrl = 'https://d2rw8z9jy7vx22.cloudfront.net';

export const config = {
    environment: '', // Will be set to 'development', 'staging', or 'production' by main.mjs
    baseUrl: '', // Will be set by main.mjs. E.g. "https://photato.eu". Will not contain a slash at the end.
    auth0: {
        domain: '', // Will be set by main.mjs
        clientId: '', // Will be set by main.mjs
    },
    course: {
        name: 'hu-3', // TODO: Fake date for testing ↓↓↓
        titleWithPhotato: '2020. őszi Photato tanfolyam',
        titleWithoutPhotato: '2020. őszi tanfolyam',
        startDateTime: new Date(Date.UTC(2020, 3 - 1, 15, /* Must be the Sunday morning 0:00 CET when the course started */
            -1 /* -2 if it was daylight saving time, -1 otherwise */)),
        weekCount: 12,
        subscribedStudentCount: 27,
        signupFormUrl: 'https://bit.ly/2tB1hpR',
        facebookGroupUrl: 'https://bit.ly/2T2E76b',
        timeZone: 'Europe/Budapest',
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        photoUpload: {
            url: cloudFrontBackUrl + '/get-signed-url', /* Must have no trailing slash */
        },
        adminGetAllMessages: {
            url: cloudFrontBackUrl + '/get-all-messages', /* Must have no trailing slash */
        },
    },
    contentImages: {
        externalArticlesBaseUrl: 'https://photato-photos-bucket.s3.us-east-1.amazonaws.com/external-articles/', /* Must have a trailing slash */
    },
    customerServiceEmailAddress: 'photatophotato@gmail.com',
    adminEmailAddresses: [
        'veszelovszki@gmail.com',
        'dorah.nemeth@gmail.com',
    ],
    featureSwitches: {},
};

export const productionConfig = {
    environment: 'production',
    baseUrl: 'https://photato.eu',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'S31BLLD6U12BnIt92b5yq5xAQ1Dt37ey'
    },
    featureSwitches: {},
};

export const stagingConfig = {
    environment: 'staging',
    baseUrl: 'https://staging.photato.eu',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'iK62e1zUO6CMbmg6Y8qpfFiDu2qyhHTD'
    },
    featureSwitches: {},
};

export const developmentConfig = {
    environment: 'development',
    baseUrl: 'http://localhost:3080',
    auth0: {
        domain: 'photato.eu.auth0.com',
        clientId: 'JLFeh90tCqr0KebY2hUWYBlhHOuHXl5f'
    },
    featureSwitches: {},
};
