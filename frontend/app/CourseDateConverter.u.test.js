const CourseDateConverter = require('./CourseDateConverter.js');

test('Initializes', async () => {
    /* Arrange */
    const testCourseStartDate = new Date(Date.UTC(2020, 1 - 1, 12, /* Must be the Sunday morning 0:00 CET when the course started */
        -1 /* -2 if it was daylight saving time, -1 otherwise */));

    /* Act */
    const courseDateConverter = new CourseDateConverter(testCourseStartDate);

    /* Assert */
    expect(courseDateConverter.getWeekIndex()).not.toBe(undefined);
});

test('Calculates day indexes correctly', async () => {
    /* Arrange */
    const testCourseStartDate = new Date(Date.UTC(2020, 1 - 1, 12, /* Must be the Sunday morning 0:00 CET when the course started */
        -1 /* -2 if it was daylight saving time, -1 otherwise */));
    const courseDateConverter = new CourseDateConverter(testCourseStartDate);

    /* Act */
    const firstDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 1 - 1, 13, 12, 0)));
    const seventhDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 1 - 1, 19, 12, 0)));
    const twentiethDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 2 - 1, 1, 12, 0)));
    const lastDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 4 - 1, 5, 12, 0)));

    /* Assert */
    expect(firstDayIndex).toBe(1);
    expect(seventhDayIndex).toBe(7);
    expect(twentiethDayIndex).toBe(20);
    expect(lastDayIndex).toBe(12 * 7);
});

test('Calculates day indexes correctly', async () => {
    /* Arrange */
    const testCourseStartDate = new Date(Date.UTC(2020, 1 - 1, 12, -1)); /* Sunday morning 0:00 CET when the course started, not daylight saving time */
    const courseDateConverter = new CourseDateConverter(testCourseStartDate);

    /* Act */
    const firstDayNoonWeekIndex = courseDateConverter.getWeekIndex(new Date(Date.UTC(2020, 1 - 1, 13, 12, 0)));
    const seventhDayNoonWeekIndex = courseDateConverter.getWeekIndex(new Date(Date.UTC(2020, 1 - 1, 19, 12, 0)));
    const seventhDay2330CETWeekIndex = courseDateConverter.getWeekIndex(new Date(Date.UTC(2020, 1 - 1, 19, 22, 30)));
    const eightDay0030CETWeekIndex = courseDateConverter.getWeekIndex(new Date(Date.UTC(2020, 1 - 1, 19, 23, 30)));
    const eightDay0130CETWeekIndex = courseDateConverter.getWeekIndex(new Date(Date.UTC(2020, 1 - 1, 20, 0, 30)));

    /* Assert */
    expect(firstDayNoonWeekIndex).toBe(1);
    expect(seventhDayNoonWeekIndex).toBe(1);
    expect(seventhDay2330CETWeekIndex).toBe(1);
    expect(eightDay0030CETWeekIndex).toBe(2);
    expect(eightDay0130CETWeekIndex).toBe(2);
});

/**
 * Reasoning: January 2020 was not daylight saving, end of March 2020 was.
 *
 * Note: If any time in the future daylight savings will be abolished in CET, the production code won't need
 *       any changes as long as the JavaScript engine knows about the daylight savings having been abolished–which it
 *       probably will.
 */
test('Handles daylight saving correctly', async () => {
    /* Arrange */
    const testCourseStartDate = new Date(Date.UTC(2020, 1 - 1, 12, -1)); /* Sunday morning 0:00 CET when the course started, not daylight saving time */
    const courseDateConverter = new CourseDateConverter(testCourseStartDate);

    /* Act */
    const march30thNoonDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 3 - 1, 30, 12, 0)));
    const march29th2330CETDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 3 - 1, 29, 21, 30)));
    const march30th0030CETDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 3 - 1, 29, 22, 30)));
    const march30th0130CETDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 3 - 1, 29, 23, 30)));
    const march30th0230CETDayIndex = courseDateConverter.getDayIndexSinceCourseStart(new Date(Date.UTC(2020, 3 - 1, 30, 0, 30)));

    /* Assert */
    expect(march30thNoonDayIndex).toBe(78);
    expect(march29th2330CETDayIndex).toBe(77);
    expect(march30th0030CETDayIndex).toBe(78);
    expect(march30th0130CETDayIndex).toBe(78);
    expect(march30th0230CETDayIndex).toBe(78);
});

test('Calculates weekly deadlines correctly', async () => {
    /* Arrange */
    const testCourseStartDate = new Date(Date.UTC(2020, 1 - 1, 12, -1)); /* Sunday morning 0:00 CET when the course started, not daylight saving time */
    const courseDateConverter = new CourseDateConverter(testCourseStartDate);

    /* Act */
    const firstDayWeekDeadline = courseDateConverter.getWeekDeadline(new Date(Date.UTC(2020, 1 - 1, 13, 12, 0)));
    const seventhDayWeekDeadline = courseDateConverter.getWeekDeadline(new Date(Date.UTC(2020, 1 - 1, 19, 12, 0)));
    const march30thWeekDeadline = courseDateConverter.getWeekDeadline(new Date(Date.UTC(2020, 3 - 1, 30, 12, 0)));

    /* Assert */
    expect(firstDayWeekDeadline.toISOString()).toBe('2020-01-19T23:00:00.000Z');
    expect(seventhDayWeekDeadline.toISOString()).toBe('2020-01-19T23:00:00.000Z');
    expect(march30thWeekDeadline.toISOString()).toBe('2020-04-05T22:00:00.000Z'); /* Daylight saving applied */
});