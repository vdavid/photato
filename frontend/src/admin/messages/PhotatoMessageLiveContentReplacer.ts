import { config } from '../../config'
import { addDaysToDate, formatDateWithWeekDay, formatDateWithWeekDayAndTime } from '../../website/dateTimeHelper'

interface PhotatoMessageLiveContentReplacerOptions {
  courseStartDate: Date
  signedUpCount: number
  signUpUrl: string
  facebookGroupUrl: string
  courseTitle: string
}

export default class PhotatoMessageLiveContentReplacer {
  private readonly _courseStartDate: Date
  private readonly _signedUpCount: number
  private readonly _signUpUrl: string
  private readonly _facebookGroupUrl: string
  private readonly _courseTitle: string

  constructor({
    courseStartDate,
    signedUpCount,
    signUpUrl,
    facebookGroupUrl,
    courseTitle,
  }: PhotatoMessageLiveContentReplacerOptions) {
    this._courseStartDate = courseStartDate
    this._signedUpCount = signedUpCount
    this._signUpUrl = signUpUrl
    this._facebookGroupUrl = facebookGroupUrl
    this._courseTitle = courseTitle
  }

  /**
   * @param message
   * @param localeCode Needed to format dates
   */
  replace(message: string, localeCode: string): string {
    const languageCode = localeCode.substring(0, 2)
    const formattedDate = formatDateWithWeekDayAndTime(this._courseStartDate, localeCode)
    return message
      .replace(/{firstName}/g, '*|FNAME|*')
      .replace(/{courseTitle}/g, this._courseTitle)
      .replace(/{courseStartDate}/g, formattedDate)
      .replace(/{facebookGroupUrl}/g, this._facebookGroupUrl)
      .replace(/{signedUpCount}/g, this._signedUpCount.toString()) // TODO: Make this dynamic once we have the signups on the website because this being hard-coded in the config led to mistakes
      .replace(/{uploadUrl}/g, config.baseUrl + '/upload')
      .replace(/{signUpUrl}/g, this._signUpUrl)
      .replace(/{midTimeSurveyUrl}/g, config.course.midTimeSurveyUrl)
      .replace(/{finalSurveyUrl}/g, config.course.finalSurveyUrl)
      .replace(/{week(\d+)DeadlineDate}/g, (match, weekIndex: string) =>
        formatDateWithWeekDay(addDaysToDate(config.course.startDateTime, (Number(weekIndex) - 1) * 7 + 7), localeCode),
      )
      .replace(/{liveEventDate}/g, formatDateWithWeekDay(config.course.liveEventDate, localeCode))
      .replace(/{exhibitionDate}/g, formatDateWithWeekDay(config.course.exhibitionDate, localeCode))
      .replace(/{ownArticleBaseUrl}/g, config.baseUrl + '/' + languageCode + '/article')
  }
}
