'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// TODO: Start using this
function parseInput(event) {
    const body = JSON.parse(event.body);
    return {
        emailAddress: body.emailAddress,
        courseIndex: body.courseIndex,
        weekIndex: body.weekIndex,
    };
}

/**
 * @param {{body: string, queryStringParameters: Object}} event
 * @returns {Promise<{statusCode: number, body: string, headers: Object, isBase64Encoded: boolean}>}
 */
async function handler(event) {
    const encodedImage = JSON.parse(event.body).user_avatar;
    const decodedImage = Buffer.from(encodedImage, 'base64');
    const filePath = 'avatars/' + event.queryStringParameters.username + '.jpg';
    const parameters = {
        Body: decodedImage,
        Bucket: 'photato-image-uploads',
        Key: filePath
    };
    const data = await s3.upload(parameters);

    return {
        statusCode: 200,
        headers: {
            my_header: 'my_value'
        },
        body: JSON.stringify(data),
        isBase64Encoded: false,
    };
}
/**
 *
 * @param event
 * @returns {Promise<{headers: {my_header: string}, isBase64Encoded: boolean, body: string, statusCode: number}>}
 */
module.exports = {
    handler,
};
