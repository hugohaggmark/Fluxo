var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};

Fluxo.Visualize.DataRow = function (label, card, actionResults) {
    'use strict';
    this.label = label;
    this.card = card;
    this.actionResults = actionResults;

    var calculateLeadTime = function () {
        var timeDiff = Math.abs(getLastDate().getTime() - getCreateDate().getTime());
        return timeDiff / (1000 * 3600 * 24);
    };

    var getLastDate = function () {
        return new Date(actionResults[0].date);
    };

    var getCreateDate = function () {
        return new Date(actionResults[actionResults.length - 1].date);
    };

    this.leadTime = function () {
        if (this.actionResults.length <= 1)
            return 0;

        return calculateLeadTime();
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
