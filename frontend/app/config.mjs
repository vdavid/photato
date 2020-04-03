export const config = {
    auth0: {
        "domain": "photato.eu.auth0.com",
        "clientId": "JLFeh90tCqr0KebY2hUWYBlhHOuHXl5f"
    },
    course: {
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
};