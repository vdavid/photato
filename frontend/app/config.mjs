export const config = {
    auth0: {
        "domain": "photato.eu.auth0.com",
        "clientId": "JLFeh90tCqr0KebY2hUWYBlhHOuHXl5f"
    },
    imageUpload: {
        minimumSizeInBytes: 50 * 1024,
        maximumSizeInBytes: 25 * 1024 * 1024,
    },
    backendApi: {
        image: {
            url: 'https://lujs0psj0l.execute-api.eu-central-1.amazonaws.com/production/image',
        }
    }
};