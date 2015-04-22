describe("DataRows", function () {
    var datarow = {};

    describe("A datarow with no actionResults", function () {
        var label = "Total";
        var card = "Hello World Card";
        var actionResults = [];

        beforeEach(function () {
            datarow = new Fluxo.Visualize.DataRow(label, card, actionResults);
        });

        it("Should be created", function () {
            expect(datarow).toEqual(jasmine.anything());
        });

        it("Should have a label", function () {
            expect(datarow.label).toEqual(label);
        });

        it("Should have a card", function () {
            expect(datarow.card).toEqual(card);
        });

        it("Should have zero leadTime", function () {
            expect(datarow.leadTime()).toEqual(0);
        });

        it("Should have no leadTimeSerie", function () {
            expect(datarow.leadTimeSerie()).not.toEqual(jasmine.anything());
        });
    });

    describe("A datarow with three actionResults", function () {
        var label = "Total";
        var card = {
            id: 1,
            name: "Hello World Card"
        };
        var actionResults = [{
            date: new Date("2015-01-03T12:00:00.000Z")
        }, {
            date: new Date("2015-01-02T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        var utcDate = Date.UTC(actionResults[0].date.getUTCFullYear(),
            actionResults[0].date.getUTCMonth(),
            actionResults[0].date.getUTCDate(),
            actionResults[0].date.getUTCHours(),
            actionResults[0].date.getUTCMinutes(),
            actionResults[0].date.getUTCSeconds(),
            0);

        beforeEach(function () {
            datarow = new Fluxo.Visualize.DataRow(label, card, actionResults);
        });

        it("Should have a correct leadTime", function () {
            expect(datarow.leadTime()).toEqual(2.5);
        });

        it("Should have a correct leadTimeSerie", function () {
            expect(datarow.leadTimeSerie()).toEqual([utcDate, 2.5]);
        });

        it("Should be exportable as csv string", function () {
            expect(datarow.toString()).toEqual(label + ";" + card.name + ";2.5;" + actionResults[0].date.toISOString());
        });
    });
});
