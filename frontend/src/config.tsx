interface Auth0Config {
    domain: string;
    clientId: string;
}

/** The subset of config that differs per environment; `initializeConfig` in main.tsx merges the
 * chosen one into the shared `config`. */
export interface EnvironmentConfig {
    environment: string;
    baseUrl: string;
    auth0: Auth0Config;
    backendApi: {environment: string};
    featureSwitches: Record<string, boolean>;
}

export interface Config {
    environment: string;
    baseUrl: string;
    auth0: Auth0Config;
    course: {
        name: string;
        weekCount: number;
        isWinterOrSummerCourse: string;
        titleWithPhotato: string;
        titleWithoutPhotato: string;
        startDateTime: Date;
        subscribedStudentCount: number;
        signUpFormUrl: string;
        midTimeSurveyUrl: string;
        finalSurveyUrl: string;
        liveEventDate: Date;
        exhibitionDate: Date;
        facebookGroupUrl: string;
        timeZone: string;
    };
    imageUpload: {
        minimumSizeInBytes: number;
        maximumSizeInBytes: number;
    };
    backendApi: {
        environment: string;
        version: {url: string};
        photoUpload: {url: string};
        adminGetAllMessages: {url: string};
        adminListPhotosForWeek: {url: string};
    };
    contentImages: {
        thirdPartyArticlesBaseUrl: string;
    };
    customerServiceEmailAddress: string;
    adminEmailAddresses: string[];
    tracking: {
        facebookPixelId: string;
        googleTrackingCode: string;
    };
    featureSwitches: Record<string, boolean>;
}

/* Single Go backend now (Phase 5). Both consts point at it: the old split between API Gateway
 * (JSON API) and CloudFront (signed photo uploads) is gone. */
const apiGatewayBackEndUrl = 'https://api.photato.eu';
const cloudFrontBackEndUrl = 'https://api.photato.eu';

/* Course settings */
const startYear = 2020;
const startMonth = 11;
const startDay = 8; /* Must be the Sunday when the course starts */
const isDaylightSavingTimeOn = false; /* Usually from the end of March till the end of October, but different every year */
const isWinterOrSummerCourse = 'winter';

const {startDateTime, liveEventDate, exhibitionDate}
    = _calculateDates({startYear, startMonth, startDay, isDaylightSavingTimeOn, isWinterOrSummerCourse});

export const config: Config = {
    environment: '', // Will be set to 'development', 'staging', or 'production' by main.tsx
    baseUrl: '', // Will be set by main.tsx. E.g. "https://photato.eu". Will not contain a slash at the end.
    auth0: {
        domain: '', // Will be set by main.tsx
        clientId: '', // Will be set by main.tsx
    },
    course: {
        name: 'hu-4',
        weekCount: 12,
        isWinterOrSummerCourse,
        titleWithPhotato: '2020. téli Photato tanfolyam',
        titleWithoutPhotato: '2020. téli tanfolyam',
        startDateTime,
        subscribedStudentCount: 336,
        signUpFormUrl: 'https://bit.ly/3ccXkMp',
        midTimeSurveyUrl: 'https://bit.ly/3iK31RC',
        finalSurveyUrl: 'https://bit.ly/3jEbCq9',
        liveEventDate,
        exhibitionDate,
        facebookGroupUrl: 'https://www.facebook.com/groups/photato2020tel',
        timeZone: 'Europe/Budapest',
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        environment: '', // Will be set to 'development', 'staging', or 'production' by main.tsx
        version: {
            url: apiGatewayBackEndUrl + '/version', /* Must have no trailing slash */
        },
        photoUpload: {
            url: cloudFrontBackEndUrl + '/get-signed-url', /* Must have no trailing slash */
        },
        adminGetAllMessages: {
            url: apiGatewayBackEndUrl + '/messages/get-all-messages', /* Must have no trailing slash */
        },
        adminListPhotosForWeek: {
            url: apiGatewayBackEndUrl + '/photos/list-for-week', /* Must have no trailing slash */
        },
    },
    contentImages: {
        thirdPartyArticlesBaseUrl: 'https://api.photato.eu/external-articles/', /* Must have a trailing slash */
    },
    customerServiceEmailAddress: 'photatophotato@gmail.com',
    adminEmailAddresses: [
        'veszelovszki@gmail.com',
        'dorah.nemeth@gmail.com',
    ],
    tracking: {
        facebookPixelId: '831452107631081',
        googleTrackingCode: 'UA-178413371-1',
    },
    featureSwitches: {},
};

export const productionConfig: EnvironmentConfig = {
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

export const stagingConfig: EnvironmentConfig = {
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

export const developmentConfig: EnvironmentConfig = {
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

function _calculateDates({startYear, startMonth, startDay, isDaylightSavingTimeOn, isWinterOrSummerCourse}: {
    startYear: number;
    startMonth: number;
    startDay: number;
    isDaylightSavingTimeOn: boolean;
    isWinterOrSummerCourse: string;
}): {startDateTime: Date; liveEventDate: Date; exhibitionDate: Date} {
    const startDateTime = new Date(Date.UTC(startYear, startMonth - 1, startDay, isDaylightSavingTimeOn ? -2 : -1));
    const liveEventDate = new Date(startDateTime);
    liveEventDate.setDate(liveEventDate.getDate() + isWinterOrSummerCourse
        ? ((5 - 1) * 7) + 3 /* 5th week, 3rd day: Wednesday */
        : ((6 - 1) * 7) + 2 /* 6th week, 2nd day: Tuesday */);
    const exhibitionDate = new Date(startDateTime);
    exhibitionDate.setDate(exhibitionDate.getDate() + ((13 - 1) * 7) + 4); /* 13th week, 4th day: Thursday */
    return {startDateTime, liveEventDate, exhibitionDate};
}
