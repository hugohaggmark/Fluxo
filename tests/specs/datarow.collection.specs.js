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

        it("Should have an empty labels collection", function () {
            expect(datarowCollection.labels().length).toEqual(0);
        });

        it("Should have an empty total series collection", function () {
            expect(datarowCollection.totalsSeries().length).toEqual(0);
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
            datarowCollection.addDataRow("Bugs", {
                name: "1 Hour",
                id: 1
            }, oneHour);
            datarowCollection.addDataRow("Bugs", {
                name: "1 Day",
                id: 2
            }, oneDay);
            datarowCollection.addDataRow("Maintanance", {
                name: "7 Days",
                id: 3
            }, sevenDays);
            datarowCollection.addDataRow("Maintanance", {
                name: "8 Days",
                id: 4
            }, eightDays);
            datarowCollection.addDataRow("User Story", {
                name: "30 Days",
                id: 5
            }, thirtyDays);
            datarowCollection.addDataRow("User Story", {
                name: "31 Days",
                id: 6
            }, thirtyOneDays);
        });

        describe("Has a totals object", function () {
            it("With 6 cards", function () {
                expect(datarowCollection.totals().cards).toEqual(6);
            });

            it("With correct leadtime", function () {
                expect(datarowCollection.totals().leadTime).toEqual(77);
            });

            it("With correct average leadtime", function () {
                expect(datarowCollection.totals().averageLeadTime).toEqual(13);
            });

            it("With correct cards with leadtime less then a day", function () {
                expect(datarowCollection.totals().cardsLessThenADay).toEqual(1);
            });

            it("With correct percent with leadtime less then a day", function () {
                expect(datarowCollection.totals().percentLessThenADay).toEqual(17);
            });

            it("With correct cards with leadtime between 1 and 7 days", function () {
                expect(datarowCollection.totals().cardsBetweenOneAndSevenDays).toEqual(2);
            });

            it("With correct percent with leadtime between 1 and 7 days", function () {
                expect(datarowCollection.totals().percentBetweenOneAndSevenDays).toEqual(33);
            });

            it("With correct cards with leadtime between 8 and 30 days", function () {
                expect(datarowCollection.totals().cardsBetweenEightAndThirtyDays).toEqual(2);
            });

            it("With correct percent with leadtime between 8 and 30 days", function () {
                expect(datarowCollection.totals().percentBetweenEightAndThirtyDays).toEqual(33);
            });

            it("With correct cards with leadtime over 30 days", function () {
                expect(datarowCollection.totals().cardsOverThirtyDays).toEqual(1);
            });

            it("With correct percent with leadtime over 30 days", function () {
                expect(datarowCollection.totals().percentOverThirtyDays).toEqual(17);
            });
        });


        describe("Has a labels collection", function () {
            it("With 3 elements", function () {
                expect(datarowCollection.labels().length).toEqual(3);
            });

            describe("Has a label object named Bugs", function () {
                it("With label Bugs", function () {
                    expect(datarowCollection.label("Bugs")).toEqual(jasmine.anything());
                });

                it("With 2 cards", function () {
                    expect(datarowCollection.label("Bugs").cards).toEqual(2);
                });

                it("With correct leadtime", function () {
                    expect(datarowCollection.label("Bugs").leadTime).toEqual(1);
                });

                it("With correct average leadtime", function () {
                    expect(datarowCollection.label("Bugs").averageLeadTime).toEqual(1);
                });

                it("With correct cards with leadtime less then a day", function () {
                    expect(datarowCollection.label("Bugs").cardsLessThenADay).toEqual(1);
                });

                it("With correct percent with leadtime less then a day", function () {
                    expect(datarowCollection.label("Bugs").percentLessThenADay).toEqual(50);
                });

                it("With correct cards with leadtime between 1 and 7 days", function () {
                    expect(datarowCollection.label("Bugs").cardsBetweenOneAndSevenDays).toEqual(1);
                });

                it("With correct percent with leadtime between 1 and 7 days", function () {
                    expect(datarowCollection.label("Bugs").percentBetweenOneAndSevenDays).toEqual(50);
                });

                it("With correct cards with leadtime between 8 and 30 days", function () {
                    expect(datarowCollection.label("Bugs").cardsBetweenEightAndThirtyDays).toEqual(0);
                });

                it("With correct percent with leadtime between 8 and 30 days", function () {
                    expect(datarowCollection.label("Bugs").percentBetweenEightAndThirtyDays).toEqual(0);
                });

                it("With correct cards with leadtime over 30 days", function () {
                    expect(datarowCollection.label("Bugs").cardsOverThirtyDays).toEqual(0);
                });

                it("With correct percent with leadtime over 30 days", function () {
                    expect(datarowCollection.label("Bugs").percentOverThirtyDays).toEqual(0);
                });
            });
        });

        var createUtcDate = function (date) {
            return Date.UTC(date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                0);
        };

        describe("Has a Totals lead time series collection", function () {

            it("With 6 points", function () {
                expect(datarowCollection.totalsSeries().length).toEqual(6);
            });

            it("With correct points", function () {
                expect(datarowCollection.totalsSeries()[0]).toEqual([createUtcDate(oneDay[0].date), 1]);
                expect(datarowCollection.totalsSeries()[1]).toEqual([createUtcDate(oneHour[0].date), 0.041666666666666664]);
                expect(datarowCollection.totalsSeries()[2]).toEqual([createUtcDate(sevenDays[0].date), 7]);
                expect(datarowCollection.totalsSeries()[3]).toEqual([createUtcDate(eightDays[0].date), 8]);
                expect(datarowCollection.totalsSeries()[4]).toEqual([createUtcDate(thirtyDays[0].date), 30]);
                expect(datarowCollection.totalsSeries()[5]).toEqual([createUtcDate(thirtyOneDays[0].date), 31]);
            });
        });

        describe("Has a Bugs lead times series collection", function () {

            it("With 2 points", function () {
                expect(datarowCollection.leadTimeSeries("Bugs").length).toEqual(2);
            });

            it("With correct points", function () {
                expect(datarowCollection.leadTimeSeries("Bugs")[0]).toEqual([createUtcDate(oneDay[0].date), 1]);
                expect(datarowCollection.leadTimeSeries("Bugs")[1]).toEqual([createUtcDate(oneHour[0].date), 0.041666666666666664]);
            });
        });
    });

    describe("A datarow collection with a datarow that has multiple labels assigned", function () {
        var oneDay = [{
            date: new Date("2015-01-03T00:00:00.000Z")
        }, {
            date: new Date("2015-01-02T00:00:00.000Z")
        }];

        var eightDays = [{
            date: new Date("2015-01-09T00:00:00.000Z")
        }, {
            date: new Date("2015-01-01T00:00:00.000Z")
        }];

        beforeEach(function () {
            datarowCollection.addDataRow("Bugs", {
                name: "1 Day",
                id: 1
            }, oneDay);
            datarowCollection.addDataRow("Maintanance", {
                name: "1 Day",
                id: 1
            }, oneDay);
            datarowCollection.addDataRow("User Story", {
                name: "1 Day",
                id: 1
            }, oneDay);
            datarowCollection.addDataRow("Innovation", {
                name: "1 Day",
                id: 2
            }, eightDays);
        });

        it("Should have totals object with 1 cards", function () {
            expect(datarowCollection.totals().cards).toEqual(2);
        });

        it("Should have a labels collection with 3 elements", function () {
            expect(datarowCollection.labels().length).toEqual(4);
        });

        it("Should have a totals object with correct leadtime", function () {
            expect(datarowCollection.totals().leadTime).toEqual(9);
        });

        it("Should have a totals object with correct average leadtime", function () {
            expect(datarowCollection.totals().averageLeadTime).toEqual(5);
        });


        it("Should have a totals object with correct cards with leadtime less then a day", function () {
            expect(datarowCollection.totals().cardsLessThenADay).toEqual(0);
        });

        it("Should have a totals object with correct percent with leadtime less then a day", function () {
            expect(datarowCollection.totals().percentLessThenADay).toEqual(0);
        });

        it("Should have a totals object with correct cards with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().cardsBetweenOneAndSevenDays).toEqual(1);
        });

        it("Should have a totals object with correct percent with leadtime between 1 and 7 days", function () {
            expect(datarowCollection.totals().percentBetweenOneAndSevenDays).toEqual(50);
        });

        it("Should have a totals object with correct cards with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().cardsBetweenEightAndThirtyDays).toEqual(1);
        });

        it("Should have a totals object with correct percent with leadtime between 8 and 30 days", function () {
            expect(datarowCollection.totals().percentBetweenEightAndThirtyDays).toEqual(50);
        });

        it("Should have a totals object with correct cards with leadtime over 30 days", function () {
            expect(datarowCollection.totals().cardsOverThirtyDays).toEqual(0);
        });
        it("Should have a totals object with correct percent with leadtime over 30 days", function () {
            expect(datarowCollection.totals().percentOverThirtyDays).toEqual(0);
        });
    });
});
