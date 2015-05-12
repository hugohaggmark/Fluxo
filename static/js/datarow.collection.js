var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};

Fluxo.Visualize.DataRowCollection = function () {
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

    var getUniqueRows = function (rows) {
        var arr = [];
        var uniqueRows = [];
        for (var i = 0; i < rows.length; i++) {
            if (arr.indexOf(rows[i].card.id) === -1) {
                arr.push(rows[i].card.id);
                uniqueRows.push(rows[i]);
            }
        }
        return uniqueRows;
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
            return (dataRow.leadTime() >= start && dataRow.leadTime() <= stop);
        });
    };

    var calculateCardsLessThenADay = function (rows) {
        var cardsLessThenADay = findRowsWithLeadTimeLessThen(rows, 1);
        debugPrint("cardsLessThenADay", cardsLessThenADay);
        return cardsLessThenADay.length;
    };

    var calculateCardsBetweenOneAndSevenDays = function (rows) {
        var cardsBetweenOneAndSevenDays = findRowsBetweenLeadTimes(rows, 1, 7);
        debugPrint("cardsBetweenOneAndSevenDays", cardsBetweenOneAndSevenDays);
        return cardsBetweenOneAndSevenDays.length;
    };

    var calculateCardsBetweenEightAndThirtyDays = function (rows) {
        var cardsBetweenEightAndThirtyDays = findRowsBetweenLeadTimes(rows, 8, 30);
        debugPrint("cardsBetweenEightAndThirtyDays", cardsBetweenEightAndThirtyDays);
        return cardsBetweenEightAndThirtyDays.length;
    };

    var calculateCardsOverThirtyDays = function (rows) {
        var cardsOverThirtyDays = findRowsWithLeadTimeMoreThen(rows, 30);
        debugPrint("cardsOverThirtyDays", cardsOverThirtyDays);
        return cardsOverThirtyDays.length;
    };

    var calculatePercent = function (totalCount, rowCount) {
        if (totalCount === 0)
            return 0;

        return rowCount / totalCount * 100;
    };

    this.addDataRow = function (label, card, actionResults) {
        var dataRow = new Fluxo.Visualize.DataRow(label, card, actionResults);
        dataRows.push(dataRow);

        if (labels.indexOf(dataRow.label) === -1) {
            labels.push(dataRow.label);
        }
    };

    var debugPrint = function (label, rows) {
        console.log(label);
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].toString());
        }
    };

    var getStatisticsObject = function (rows, name) {
        var cardsLessThenADay = calculateCardsLessThenADay(rows);
        var cardsBetweenOneAndSevenDays = calculateCardsBetweenOneAndSevenDays(rows);
        var cardsBetweenEightAndThirtyDays = calculateCardsBetweenEightAndThirtyDays(rows);
        var cardsOverThirtyDays = calculateCardsOverThirtyDays(rows);
        return {
            name: name,
            id: name.replace(/\s+/g, ''),
            cards: rows.length,
            leadTime: Math.round(calculateTotalLeadTime(rows)),
            averageLeadTime: Math.round(calculateAverageLeadTime(rows)),
            cardsLessThenADay: cardsLessThenADay,
            percentLessThenADay: Math.round(calculatePercent(rows.length, cardsLessThenADay)),
            cardsBetweenOneAndSevenDays: cardsBetweenOneAndSevenDays,
            percentBetweenOneAndSevenDays: Math.round(calculatePercent(rows.length, cardsBetweenOneAndSevenDays)),
            cardsBetweenEightAndThirtyDays: cardsBetweenEightAndThirtyDays,
            percentBetweenEightAndThirtyDays: Math.round(calculatePercent(rows.length, cardsBetweenEightAndThirtyDays)),
            cardsOverThirtyDays: cardsOverThirtyDays,
            percentOverThirtyDays: Math.round(calculatePercent(rows.length, cardsOverThirtyDays))
        };
    };

    this.totals = function () {
        return getStatisticsObject(getUniqueRows(dataRows), "Totals");
    };

    this.label = function (label) {
        var rows = findRows(dataRows, function (row) {
            return row.label === label;
        });

        return getStatisticsObject(rows, label);
    };

    this.labels = function () {
        return labels;
    };

    function compare(a, b) {
        if (!a && !b) {
            return 0;
        }
        if (!a) {
            return -1;
        }
        if (!b) {
            return 1;
        }

        return a[0] - b[0];
    }

    var getLeadTimeSerie = function (rows) {
        var labelSeries = [];

        for (var i = 0; i < rows.length; i++) {
            labelSeries.push(rows[i].leadTimeSerie());
        }

        return labelSeries.sort(compare);
    };

    this.totalsSeries = function () {
        var uniqueRows = getUniqueRows(dataRows);

        return getLeadTimeSerie(uniqueRows);
    };

    this.leadTimeSeries = function (label) {
        var rows = findRows(dataRows, function (row) {
            return row.label === label;
        });

        return getLeadTimeSerie(rows);
    };
};
