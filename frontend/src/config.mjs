const apiGatewayBackEndUrl = 'https://971tlzc7le.execute-api.us-east-1.amazonaws.com/production';
const cloudFrontBackEndUrl = 'https://dglg96wn4of1.cloudfront.net';

/* Course settings */
const startYear = 2020;
const startMonth = 11;
const startDay = 8; /* Must be the Sunday when the course starts */
const isDaylightSavingTimeOn = false; /* Usually from the end of March till the end of October, but different every year */
const isWinterOrSummerCourse = 'winter';

const {startDateTime, liveEventDate, exhibitionDate}
    = _calculateDates({startYear, startMonth, startDay, isDaylightSavingTimeOn, isWinterOrSummerCourse});

export const config = {
    environment: '', // Will be set to 'development', 'staging', or 'production' by main.mjs
    baseUrl: '', // Will be set by main.mjs. E.g. "https://photato.eu". Will not contain a slash at the end.
    auth0: {
        domain: '', // Will be set by main.mjs
        clientId: '', // Will be set by main.mjs
    },
    course: {
        name: 'hu-staging-4',
        weekCount: 12,
        isWinterOrSummerCourse,
        titleWithPhotato: '2020. téli Photato tanfolyam',
        titleWithoutPhotato: '2020. téli tanfolyam',
        startDateTime,
        subscribedStudentCount: 28,
        signUpFormUrl: 'https://bit.ly/3iDJ3HV',
        midTimeSurveyUrl: 'https://bit.ly/3iK31RC',
        finalSurveyUrl: 'https://bit.ly/3jEbCq9',
        liveEventDate,
        exhibitionDate,
        facebookGroupUrl: '', // TODO: Add this
        timeZone: 'Europe/Budapest',
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        environment: '', // Will be set to 'development', 'staging', or 'production' by main.mjs
        version: {
            url: apiGatewayBackEndUrl + '/version', /* Must have no trailing slash */
        },
        photoUpload: {
            url: cloudFrontBackEndUrl + '/get-signed-url', /* Must have no trailing slash */
        },
        adminGetAllMessages: {
            url: apiGatewayBackEndUrl + '/messages/get-all-messages', /* Must have no trailing slash */
        },
    },
    contentImages: {
        thirdPartyArticlesBaseUrl: 'https://photato-photos-bucket.s3.us-east-1.amazonaws.com/external-articles/', /* Must have a trailing slash */
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
    backendApi: {
        environment: 'production',
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
    backendApi: {
        environment: 'production', /* We have no staging environment for the backend yet, so we'll use production */
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
    backendApi: {
        environment: 'production', /* We have no development environment for the backend yet, so we'll use production */
    },
    featureSwitches: {},
};

function _calculateDates({startYear, startMonth, startDay, isDaylightSavingTimeOn, isWinterOrSummerCourse}) {
    const startDateTime = new Date(Date.UTC(startYear, startMonth - 1, startDay, isDaylightSavingTimeOn ? -2 : -1));
    const liveEventDate = new Date(startDateTime);
    liveEventDate.setDate(liveEventDate.getDate() + isWinterOrSummerCourse
        ? ((5 - 1) * 7) + 3 /* 5th week, 3rd day: Wednesday */
        : ((6 - 1) * 7) + 2 /* 6th week, 2nd day: Tuesday */);
    const exhibitionDate = new Date(startDateTime);
    exhibitionDate.setDate(exhibitionDate.getDate() + ((13 - 1) * 7) + 4); /* 13th week, 4th day: Thursday */
    return {startDateTime, liveEventDate, exhibitionDate};
}
