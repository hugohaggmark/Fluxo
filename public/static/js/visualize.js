var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};

var slideshow = {};

var selected = {
    boardId: -1,
    listIds: [],
    listNames: [],
};

var data = {
    leadTime: {
        labels: [],
        totals: [],
        series: [],
        totalSeries: []
    },
    cycleTime: 0,
    throughPut: 0
};

var $progress = $("#progress");
var $progressbar = $("#progressbar");

var leadTimeNoResults = $("#leadtime-no-results");
leadTimeNoResults.hide();

var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }

    return (false);
};

var dayDiff = function (startDate, stopDate) {
    var timeDiff = Math.abs(stopDate.getTime() - startDate.getTime());
    return timeDiff / (1000 * 3600 * 24);
};

var getLastDate = function (actionsResult) {
    return new Date(actionsResult[0].date);
};

var getCreateDate = function (actionsResult) {
    return new Date(actionsResult[actionsResult.length - 1].date);
};

var calulateLeadTimeDays = function (actionsResult) {
    if (actionsResult.length < 1)
        return 0;

    var lastDate = getLastDate(actionsResult);
    var createDate = getCreateDate(actionsResult);

    return dayDiff(lastDate, createDate);
};

var getElementByName = function (array, name) {
    var result = $.grep(array, function (element) {
        return element.name === name;
    });

    return result;
};

var getExistingDate = function (array, utcDate) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] === utcDate) {
            return array[i];
        }
    }
    return [];
};

var createSerie = function (name) {
    var serie = {
        name: name,
        data: [],
        duplicates: {},
        sortData: function () {
            this.data.sort(function (a, b) {
                return a[0] - b[0];
            });
        },
        addLeadTime: function (date, leadtime) {
            var utcDate = Date.UTC(date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                0);

            var exists = getExistingDate(this.data, utcDate);
            if (exists.length === 0) {
                this.data.push([utcDate, Math.round(leadtime)]);
                this.sortData();
            } else {
                if (!this.duplicates[exists[0]]) {
                    this.duplicates[exists[0]] = 1;
                } else {
                    this.duplicates[exists[0]] += 1;
                }

                exists[1] += leadtime;
            }
        },
    };

    return serie;
};

var createLeadtimeLabel = function (name) {
    var labelData = {
        name: name,
        id: function () {
            return this.name.replace(/\s+/g, '');
        },
        days: 0,
        cards: 0,
        oneDay: 0,
        oneWeek: 0,
        oneMonth: 0,
        overMonth: 0,
        oneDayPercent: function () {
            return this.calcPercent(this.oneDay);
        },
        oneWeekPercent: function () {
            return this.calcPercent(this.oneWeek);
        },
        oneMonthPercent: function () {
            return this.calcPercent(this.oneMonth);
        },
        overMonthPercent: function () {
            return this.calcPercent(this.overMonth);
        },
        addLeadTime: function (leadTime) {
            this.days += leadTime;
            this.cards += 1;
            var roundedDays = Math.round(leadTime);
            if (roundedDays <= 1) {
                this.oneDay += 1;
            } else if (roundedDays > 1 && roundedDays <= 7) {
                this.oneWeek += 1;
            } else if (roundedDays > 7 && roundedDays <= 30) {
                this.oneMonth += 1;
            } else if (roundedDays > 30) {
                this.overMonth += 1;
            }
        },
        ceiledDays: function () {
            return Math.round(this.days);
        },
        average: function () {
            if (this.cards > 0)
                return Math.round(this.days / this.cards);

            return NaN;
        },
        calcPercent: function (days) {
            return Math.round((days / this.cards) * 100) + "%";
        }
    };

    return labelData;
};

var addSeriesData = function (series, label, lastDate, leadtime) {
    var result = getElementByName(series, label);

    if (result.length === 0) {
        var seriesData = createSerie(label);
        seriesData.addLeadTime(lastDate, leadtime);
        series.push(seriesData);
    } else if (result.length === 1) {
        result[0].addLeadTime(lastDate, leadtime);
    }
};

var addLabelData = function (labels, name, leadTime) {
    var result = getElementByName(labels, name);

    if (result.length === 0) {
        var label = createLeadtimeLabel(name);
        label.addLeadTime(leadTime);
        labels.push(label);
    } else if (result.length === 1) {
        result[0].addLeadTime(leadTime);
    }
};

var addToTotals = function (leadTime) {
    if (data.leadTime.totals.length === 0) {
        var label = createLeadtimeLabel("Totals");
        label.addLeadTime(leadTime);
        data.leadTime.totals.push(label);
    } else {
        data.leadTime.totals[0].addLeadTime(leadTime);
    }
};

var addToTotalsSeries = function (lastDate, leadTime) {
    if (data.leadTime.totalSeries.length === 0) {
        var totalsSerie = createSerie("LeadTime");
        totalsSerie.addLeadTime(lastDate, leadTime);
        data.leadTime.totalSeries.push(totalsSerie);
    } else {
        data.leadTime.totalSeries[0].addLeadTime(lastDate, leadTime);
    }
};

var addLeadTimeData = function (card, actionsResult) {
    var leadtime = calulateLeadTimeDays(actionsResult);
    var lastDate = getLastDate(actionsResult);
    addToTotals(leadtime);
    addToTotalsSeries(lastDate, leadtime);

    if (card.labels.length === 0) {
        addLabelData(data.leadTime.labels, "No Label", leadtime);
        addSeriesData(data.leadTime.series, "No Label", lastDate, leadtime);
    } else {
        $.each(card.labels, function (index, label) {
            console.log(label.name + ";" + card.name + ";" + leadtime + ";" + lastDate.toISOString() + "\r\n");
            addLabelData(data.leadTime.labels, label.name, leadtime);
            addSeriesData(data.leadTime.series, label.name, lastDate, leadtime);
        });
    }
};

var calculateLeadTime = function (callback) {
    var listId = selected.listIds[selected.listIds.length - 1];
    Trello.get("lists/" + listId + "?cards=all", function (cardsResult) {
        data.leadTime.cards = cardsResult.cards.length;
        if (cardsResult.cards.length === 0) {
            leadTimeNoResults.show();
        }
        var done = 0;
        $progressbar.attr("aria-valuemax", cardsResult.cards.length);
        $.each(cardsResult.cards, function (index, card) {
            Trello.get("cards/" + card.id + "/actions/?filter=createCard,updateCard:idList", function (actionsResult) {
                done++;
                updateProgress(card, done, cardsResult.cards.length);
                addLeadTimeData(card, actionsResult);

                if (done == cardsResult.cards.length) {
                    $("body").removeClass("loading");
                    callback();
                }
            });
        });
    });
};

var updateProgress = function (card, done, max) {
    var width = (done / max) * 100 + "%";
    $progressbar.attr("aria-valuenow", done);
    $progressbar.width(width);
};

var renderLeadTime = function () {
    $.get("../static/templates/leadtime-totals.html", function (template) {
        var leadTimeTotals = Mustache.render(template, {
            data: data.leadTime.totals
        });
        $("#leadtime-total").html(leadTimeTotals);
        slideshow.addSlide("#leadtime-total");
        plotLeadTimeGraph("#graph-leadtime",
            data.leadTime.totalSeries[0].name,
            data.leadTime.totalSeries[0].data);
    });

    $.get("../static/templates/leadtime-per-label.html", function (template) {
        for (var i = 0; i < data.leadTime.labels.length; i++) {
            var name = data.leadTime.labels[i].name;
            var id = data.leadTime.labels[i].id();
            var chartId = "#graph-leadtime-" + id;
            var divId = "#leadtime-per-label-" + id;
            var seriesData = data.leadTime.series[i].data;
            var labelData = data.leadTime.labels[i];
            var leadTimePerLabel = Mustache.render(template, {
                data: labelData
            });

            $("#leadtime-per-label").append(leadTimePerLabel);
            plotLeadTimeGraph(chartId,
                name,
                seriesData);
            slideshow.addSlide(divId);
        }

        slideshow.startSlideShow();
        if (slideshow.visible()) {
            $("#slideshow-container").toggle();
        }
        $("#next").click(function () {
            slideshow.nextSlide();
        });
        $("#previous").click(function () {
            slideshow.previousSlide();
        });
    });
};

var fixDuplicateData = function () {
    $.each(data.leadTime.series, function (index, serie) {
        $.each(serie.data, function (index, data) {
            if (serie.duplicates[data[0]] > 1) {
                data[1] = Math.ceil(data[1] / serie.duplicates[data[0]]);
            }
        });
    });
};

var plotLeadTimeGraph = function (id, name, data) {
    $(id).highcharts('StockChart', {
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Days'
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        rangeSelector: {
            selected: 0
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: name,
            type: 'line',
            id: 'primary',
            data: data
        }, {
            name: '7-day SMA',
            linkedTo: 'primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 7
        }, {
            name: '30-day SMA',
            linkedTo: 'primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 30
        }]
    });
};

var onAuthorize = function () {
    selected.boardId = getQueryVariable("boardId");
    selected.listIds = getQueryVariable("listIds").split(",");
    $progress.toggle();
    $progressbar.toggle();
    calculateLeadTime(function () {
        renderLeadTime();
        $progress.toggle();
        $progressbar.toggle();
    });
};

$(document).ready(function () {
    initDarkChartTheme();
    slideshow = new Fluxo.Visualize.SlideShow();
    Trello.authorize({
        type: "popup",
        name: "Fluxo",
        expiration: "never",
        success: onAuthorize
    });
});

var initDarkChartTheme = function () {
    /**
     * Dark theme for Highcharts JS
     * @author Torstein Honsi
     */

    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
        ],
        chart: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);
};
