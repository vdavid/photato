import {config} from '../../config.mjs';
import {formatDateWithWeekDay, formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper.mjs';

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
        return message
            .replace(/{firstName}/g, '*|FNAME|*')
            .replace(/{courseTitle}/g, this._courseTitle)
            .replace(/{courseStartDate}/g, formattedDate)
            .replace(/{facebookGroupUrl}/g, this._facebookGroupUrl)
            .replace(/{signedUpCount}/g, this._signedUpCount.toString())
            .replace(/{uploadUrl}/g, config.baseUrl)
            .replace(/{signUpUrl}/g, this._signUpUrl)
            .replace(/{midTimeSurveyUrl}/g, config.course.midTimeSurveyUrl)
            .replace(/{finalSurveyUrl}/g, config.course.finalSurveyUrl)
            .replace(/{liveEventDate}/g, formatDateWithWeekDay(config.course.liveEventDate, localeCode))
            .replace(/{exhibitionDate}/g, formatDateWithWeekDay(config.course.exhibitionDate, localeCode))
            .replace(/{ownArticleBaseUrl}/g, config.baseUrl + '/' + languageCode + '/article');
    }
}