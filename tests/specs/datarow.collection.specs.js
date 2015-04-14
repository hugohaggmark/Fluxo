describe("DataRowCollections", function () {
    var datarowCollection = {};

    beforeEach(function () {
        datarowCollection = new Fluxo.Visualize.DataRowCollection();
    });

    describe("A empty datarow collection", function () {

        it("Should be created", function () {
            expect(datarowCollection).toEqual(jasmine.anything());
        });

        it("Should have totals object with 0 cards", function () {
            expect(datarowCollection.totals().cards).toEqual(0);
        });

        it("Should have a totals object with 0 leadtime", function () {
            expect(datarowCollection.totals().leadTime).toEqual(0);
        });

        it("Should have a totals object with 0 average leadtime", function () {
            expect(datarowCollection.totals().averageLeadTime).toEqual(0);
        });

        it("Should have a totals object with 0 cards with leadtime less then a day", function () {
            expect(datarowCollection.totals().cardsLessThenADay).toEqual(0);
        });

        it("Should have a totals object with 0 percent with leadtime less then a day", function () {
            expect(datarowCollection.totals().percentLessThenADay).toEqual(0);
        });

        it("Should have a totals object with 0 cards with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().cardsBetweenOneAndSevenDays).toEqual(0);
        });

        it("Should have a totals object with 0 percent with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().percentBetweenOneAndSevenDays).toEqual(0);
        });

        it("Should have a totals object with 0 cards with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().cardsBetweenEightAndThirtyDays).toEqual(0);
        });

        it("Should have a totals object with 0 percent with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().percentBetweenEightAndThirtyDays).toEqual(0);
        });

        it("Should have a totals object with 0 cards with leadtime over 30 days", function () {
            expect(datarowCollection.totals().cardsOverThirtyDays).toEqual(0);
        });

        it("Should have a totals object with 0 percent with leadtime over 30 days", function () {
            expect(datarowCollection.totals().percentOverThirtyDays).toEqual(0);
        });
    });

    describe("A datarow collection with several datarows", function () {
        var oneHour = [{
            date: new Date("2015-01-03T01:00:00.000Z")
        }, {
            date: new Date("2015-01-03T00:00:00.000Z")
        }];

        var oneDay = [{
            date: new Date("2015-01-03T00:00:00.000Z")
        }, {
            date: new Date("2015-01-02T00:00:00.000Z")
        }];

        var sevenDays = [{
            date: new Date("2015-01-08T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        var eightDays = [{
            date: new Date("2015-01-09T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        var thirtyDays = [{
            date: new Date("2015-01-31T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        var thirtyOneDays = [{
            date: new Date("2015-02-01T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        beforeEach(function () {
            datarowCollection.addDataRow("Bugs", "1 Hour", oneHour);
            datarowCollection.addDataRow("Bugs", "1 Day", oneDay);
            datarowCollection.addDataRow("Maintanance", "7 Days", sevenDays);
            datarowCollection.addDataRow("Maintanance", "8 Days", eightDays);
            datarowCollection.addDataRow("User Story", "30 Days", thirtyDays);
            datarowCollection.addDataRow("User Story", "31 Days", thirtyOneDays);
        });

        it("Should have totals object with 6 cards", function () {
            expect(datarowCollection.totals().cards).toEqual(6);
        });

        it("Should have a totals object with correct leadtime", function () {
            expect(datarowCollection.totals().leadTime).toEqual(77.04166666666666);
        });

        it("Should have a totals object with correct average leadtime", function () {
            expect(datarowCollection.totals().averageLeadTime).toEqual(12.840277777777777);
        });

        it("Should have a totals object with correct cards with leadtime less then a day", function () {
            expect(datarowCollection.totals().cardsLessThenADay).toEqual(1);
        });

        it("Should have a totals object with correct percent with leadtime less then a day", function () {
            expect(datarowCollection.totals().percentLessThenADay).toEqual((1 / 6) * 100);
        });

        it("Should have a totals object with correct cards with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().cardsBetweenOneAndSevenDays).toEqual(2);
        });

        it("Should have a totals object with correct percent with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().percentBetweenOneAndSevenDays).toEqual((2 / 6) * 100);
        });

        it("Should have a totals object with correct cards with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().cardsBetweenEightAndThirtyDays).toEqual(2);
        });

        it("Should have a totals object with correct percent with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().percentBetweenEightAndThirtyDays).toEqual((2 / 6) * 100);
        });

        it("Should have a totals object with correct cards with leadtime over 30 days", function () {
            expect(datarowCollection.totals().cardsOverThirtyDays).toEqual(1);
        });

        it("Should have a totals object with correct percent with leadtime over 30 days", function () {
            expect(datarowCollection.totals().percentOverThirtyDays).toEqual((1 / 6) * 100);
        });

        it("Should have a label object named Bugs", function () {
            expect(datarowCollection.label("Bugs")).toEqual(jasmine.anything());
        });

        it("Should have a label object named Bugs with 2 cards", function () {
            expect(datarowCollection.label("Bugs").cards).toEqual(2);
        });

        it("Should have a label object named Bugs correct leadtime", function () {
            expect(datarowCollection.label("Bugs").leadTime).toEqual(1.0416666666666667);
        });

        it("Should have a label object named Bugs correct average leadtime", function () {
            expect(datarowCollection.label("Bugs").averageLeadTime).toEqual(0.5208333333333334);
        });

    });
});
