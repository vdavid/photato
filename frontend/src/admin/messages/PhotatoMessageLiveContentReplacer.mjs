import {config} from '../../config.mjs';
import {formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper.mjs';

export default class PhotatoMessageLiveContentReplacer {
    /**
     * @param {Date} courseStartDate
     * @param {int} signedUpCount
     * @param {string} signUpUrl
     * @param {string} facebookGroupUrl
     * @param {string} courseTitle
     */
    constructor({courseStartDate, signedUpCount, signUpUrl, facebookGroupUrl, courseTitle}) {
        this._courseStartDate = courseStartDate;
        this._signedUpCount = signedUpCount;
        this._signUpUrl = signUpUrl;
        this._facebookGroupUrl = facebookGroupUrl;
        this._courseTitle = courseTitle;
    }

    /**
     * @param {string} message
     * @param {string} localeCode Needed to format dates
     * @returns {string}
     */
    replace(message, localeCode) {
        const languageCode = localeCode.substring(0, 2);
        const formattedDate = formatDateWithWeekDayAndTime(this._courseStartDate, localeCode);
        return message.replace(/{courseStartDate}/g, formattedDate)
            .replace(/{signedUpCount}/g, this._signedUpCount.toString())
            .replace(/{signUpUrl}/g, this._signUpUrl)
            .replace(/{facebookGroupUrl}/g, this._facebookGroupUrl)
            .replace(/{courseTitle}/g, this._courseTitle)
            .replace(/{firstName}/g, '*|FNAME|*')
            .replace(/{uploadUrl}/g, config.baseUrl)
            .replace(/{midTimeSurveyUrl}/g, config.course.midTimeSurveyUrl)
            .replace(/{finalSurveyUrl}/g, config.course.finalSurveyUrl)
            .replace(/{ownArticleBaseUrl}/g, config.baseUrl + '/' + languageCode + '/article');
    }
}