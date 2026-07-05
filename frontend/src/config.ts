/** The subset of config that differs per environment; `initializeConfig` merges the chosen one into
 * the shared `config` at startup, based on the hostname. */
export interface EnvironmentConfig {
    environment: string;
    baseUrl: string;
    backendApi: {environment: string};
    featureSwitches: Record<string, boolean>;
}

export interface Config {
    environment: string;
    baseUrl: string;
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
    featureSwitches: Record<string, boolean>;
}

/* Single Go backend at api.photato.eu. It serves the JSON API, signs + accepts photo uploads, and
 * hosts the cached external-article images. */
const backEndUrl = 'https://api.photato.eu';

/** Base URL of the auth + data API. Every `/auth/*` and data endpoint hangs off this. */
export const apiBaseUrl = backEndUrl;

/* Course settings */
const startYear = 2020;
const startMonth = 11;
const startDay = 8; /* Must be the Sunday when the course starts */
const isDaylightSavingTimeOn = false; /* Usually from the end of March till the end of October, but different every year */
const isWinterOrSummerCourse = 'winter';

const {startDateTime, liveEventDate, exhibitionDate}
    = _calculateDates({startYear, startMonth, startDay, isDaylightSavingTimeOn, isWinterOrSummerCourse});

export const config: Config = {
    environment: '', // Set to 'development', 'staging', or 'production' by initializeConfig().
    baseUrl: '', // Set by initializeConfig(). E.g. "https://photato.eu". No trailing slash.
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
        environment: '', // Set to 'development', 'staging', or 'production' by initializeConfig().
        version: {url: backEndUrl + '/version'}, /* No trailing slash */
        photoUpload: {url: backEndUrl + '/get-signed-url'}, /* No trailing slash */
        adminGetAllMessages: {url: backEndUrl + '/messages/get-all-messages'}, /* No trailing slash */
        adminListPhotosForWeek: {url: backEndUrl + '/photos/list-for-week'}, /* No trailing slash */
    },
    contentImages: {
        thirdPartyArticlesBaseUrl: backEndUrl + '/external-articles/', /* Trailing slash required */
    },
    customerServiceEmailAddress: 'photatophotato@gmail.com',
    featureSwitches: {},
};

const productionConfig: EnvironmentConfig = {
    environment: 'production',
    baseUrl: 'https://photato.eu',
    backendApi: {environment: 'production'},
    featureSwitches: {},
};

const stagingConfig: EnvironmentConfig = {
    environment: 'staging',
    baseUrl: 'https://staging.photato.eu',
    backendApi: {environment: 'production'}, /* No staging backend yet; use production */
    featureSwitches: {},
};

const developmentConfig: EnvironmentConfig = {
    environment: 'development',
    baseUrl: 'http://localhost:18730',
    backendApi: {environment: 'production'}, /* No development backend yet; use production */
    featureSwitches: {},
};

/**
 * Picks the environment-specific config by hostname and merges it into the shared `config`. Call once,
 * at the very start of app boot. `photato.eu*` → production, `staging.photato.eu*` → staging, anything
 * else (incl. localhost and preview hosts) → development. The backend environment is always
 * 'production' for now (single live backend).
 */
export function initializeConfig(): void {
    const host = window.location.host;
    const environmentSpecificConfig = host.startsWith('photato.eu')
        ? productionConfig
        : (host.startsWith('staging.photato.eu') ? stagingConfig : developmentConfig);
    config.environment = environmentSpecificConfig.environment;
    config.baseUrl = environmentSpecificConfig.baseUrl;
    config.backendApi.environment = environmentSpecificConfig.backendApi.environment;
    config.featureSwitches = environmentSpecificConfig.featureSwitches;
}

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
