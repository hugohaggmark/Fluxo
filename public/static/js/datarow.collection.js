var TrellBan = TrellBan || {};
TrellBan.Visualize = TrellBan.Visualize || {};

TrellBan.Visualize.DataRowCollection = function () {
    'use strict';
    var dataRows = [];
    var labels = [];

    var calculateAverageLeadTime = function (rows) {
        var totalLeadTime = calculateTotalLeadTime(rows);
        if (rows.length === 0)
            return 0;

        return totalLeadTime / rows.length;
    };

    var calculateTotalLeadTime = function (rows) {
        var leadTime = 0;

        for (var i = 0; i < rows.length; i++) {
            leadTime += rows[i].leadTime();
        }

        return leadTime;
    };

    var findRows = function (rows, comparer) {
        var length = rows.length,
            result = [];
        for (var i = 0; i < length; i++) {
            if (comparer(rows[i])) {
                result.push(rows[i]);
            }
        }

        return result;
    };

    var findRowsWithLeadTimeLessThen = function (rows, leadTime) {
        return findRows(rows, function (dataRow) {
            return dataRow.leadTime() < leadTime;
        });
    };

    var findRowsWithLeadTimeMoreThen = function (rows, leadTime) {
        return findRows(rows, function (dataRow) {
            return dataRow.leadTime() > leadTime;
        });
    };

    var findRowsBetweenLeadTimes = function (rows, start, stop) {
        return findRows(rows, function (dataRow) {
            return (dataRow.leadTime() >= start && dataRow.leadTime() < stop);
        });
    };

    var calculateCardsLessThenADay = function (rows) {
        return findRowsWithLeadTimeLessThen(rows, 1).length;
    };

    var calculateCardsBetweenOneAndEightDays = function (rows) {
        return findRowsBetweenLeadTimes(rows, 1, 8).length;
    };

    var calculateCardsBetweenEightAndThirtyDays = function (rows) {
        return findRowsBetweenLeadTimes(rows, 8, 31).length;
    };

    var calculateCardsOverThirtyDays = function (rows) {
        return findRowsWithLeadTimeMoreThen(rows, 30).length;
    };

    var calculatePercent = function (totalCount, rowCount) {
        if (totalCount === 0)
            return 0;

        return rowCount / totalCount * 100;
    };

    this.addDataRow = function (label, card, actionResults) {
        var dataRow = new TrellBan.Visualize.DataRow(label, card, actionResults);
        dataRows.push(dataRow);
    };

    var getStatisticsObject = function (rows) {
        return {
            cards: rows.length,
            leadTime: calculateTotalLeadTime(rows),
            averageLeadTime: calculateAverageLeadTime(rows),
            cardsLessThenADay: calculateCardsLessThenADay(rows),
            percentLessThenADay: calculatePercent(rows.length, calculateCardsLessThenADay(rows)),
            cardsBetweenOneAndSevenDays: calculateCardsBetweenOneAndEightDays(rows),
            percentBetweenOneAndSevenDays: calculatePercent(rows.length, calculateCardsBetweenOneAndEightDays(rows)),
            cardsBetweenEightAndThirtyDays: calculateCardsBetweenEightAndThirtyDays(rows),
            percentBetweenEightAndThirtyDays: calculatePercent(rows.length, calculateCardsBetweenEightAndThirtyDays(rows)),
            cardsOverThirtyDays: calculateCardsOverThirtyDays(rows),
            percentOverThirtyDays: calculatePercent(rows.length, calculateCardsOverThirtyDays(rows))
        };
    };

    this.totals = function () {
        return getStatisticsObject(dataRows);
    };

    this.label = function (label) {
        var rows = findRows(dataRows, function (row) {
            return row.label === label;
        });

        return getStatisticsObject(rows);
    };
};
