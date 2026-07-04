const https = require("https"); /* Documentation: https://nodejs.org/api/https.html */

class HttpsConnector {
    /**
     * @param {string} url
     * @param {Object<string, string>} options Any valid HTTPS request options: https://nodejs.org/api/http.html#http_http_request_options_callback
     * @param {string} [requestBody]
     * @returns {Promise<{statusCode: int, headers: Object<string, string>, body: string|null}>}
     */
    requestPromisified(url, options, requestBody = undefined) {
        return new Promise((resolve, reject) => {
            const request = https.request(url, options, (response) => {
                const statusCode = response.statusCode;
                const headers = response.headers;
                let body = '';
                response.setEncoding('utf8');
                response.on('data', chunk => { body += chunk; });
                response.on('end', () => resolve({statusCode, headers, body}));
            });
            request.on('error', error => reject(error));
            if (requestBody) {
                request.write(requestBody);
            }
            request.end();
        });
    }
}

module.exports = HttpsConnector;