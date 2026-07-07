/**
 * @param {string?} environment
 */
function getConfig(environment= '') {
    const environmentSpecificConfig =
        (environment === 'production') ? productionConfig
            : ((environment === 'staging') ? stagingConfig
            : developmentConfig);
    return Object.freeze({
        ...defaultConfig,
        environment: environmentSpecificConfig.environment,
        baseUrl: environmentSpecificConfig.baseUrl,
    });
}

/**
 * Be careful, any environment-specific stuff will not be set!
 */
function getDefaultConfig() {
    return defaultConfig;
}

const defaultConfig = Object.freeze({
    appName: 'photato-website-backend',
    environment: '', // Will be set to 'development', 'staging', or 'production' by environment-specific config
    baseUrl: '', // Will be set by environment-specific config. E.g. "https://photato.eu". Will not contain a slash at the end.
    database: {
        // Credentials redacted: the Mongo Atlas cluster is deleted, this connection string is dead. Kept as a shape reference only.
        connectionString: 'mongodb+srv://REDACTED:REDACTED@REDACTED.mongodb.net/test?retryWrites=true&w=majority',
        name: 'photato-website-production',
    },
    auth: {
        auth0: {
            userInfoEndpoint: 'https://photato.eu.auth0.com/userinfo',
        },
    },
    photos: {
        bucket: {
            name: 'photato-photos-bucket',
        },
    },
    adminEmailAddresses: [
        'veszelovszki@gmail.com',
        'dorah.nemeth@gmail.com',
    ],
});

const productionConfig = Object.freeze({
    environment: 'production',
    baseUrl: 'https://photato.eu',
});

const stagingConfig = Object.freeze({
    environment: 'staging',
    baseUrl: 'https://staging.photato.eu',
});

const developmentConfig = Object.freeze({
    environment: 'development',
    baseUrl: 'http://localhost:3080',
});

module.exports = {
    getConfig,
    getDefaultConfig,
};
