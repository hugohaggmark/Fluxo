var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};

Fluxo.Visualize.DataRow = function (label, card) {
    'use strict';
    this.label = label;
    this.card = card;

    var calculateLeadTime = function () {
        var timeDiff = Math.abs(getLastDate().getTime() - getCreateDate().getTime());
        return timeDiff / (1000 * 3600 * 24);
    };

    var getLastDate = function () {
        return new Date(card.actions[0].date);
    };

    var getCreateDate = function () {
        return new Date(card.actions[card.actions.length - 1].date);
    };

    this.leadTime = function () {
        if (card.actions.length <= 1)
            return 0;

        return calculateLeadTime();
    };

    this.leadTimeSerie = function () {
        if (card.actions.length < 1)
            return null;

        var lastDate = getLastDate(),
            utcDate = Date.UTC(lastDate.getUTCFullYear(),
                lastDate.getUTCMonth(),
                lastDate.getUTCDate(),
                lastDate.getUTCHours(),
                lastDate.getUTCMinutes(),
                lastDate.getUTCSeconds(),
                0),
            leadTime = calculateLeadTime();
        return [utcDate, leadTime];
    };

    this.toString = function () {
        var string = this.label;
        string += ";";
        string += this.card.name;
        string += ";";
        string += this.leadTime();
        string += ";";
        string += getLastDate().toISOString();

        return string;
    };
};
