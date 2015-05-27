var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};
var api = new Fluxo.Api();

var slideshow = {};
var dataRows = {};

var selected = {
    boardId: -1,
    listIds: [],
    listNames: [],
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

var addLeadTimeData = function (card) {
    if (card.labels.length === 0) {
        dataRows.addDataRow("No Label", card);
    } else {
        $.each(card.labels, function (index, label) {
            dataRows.addDataRow(label.name, card);
        });
    }
};

var getAllActions = function (index, card, cardCount, callback) {
    updateProgress(index, cardCount);
    addLeadTimeData(card);

    if (index === cardCount - 1) {
        $("body").removeClass("loading");
        callback();
    }
};

var getAllCards = function (cardsResult, callback) {
    var cardCount = cardsResult.length;
    if (cardCount === 0) {
        leadTimeNoResults.show();
    }

    $progressbar.attr("aria-valuemax", cardCount);
    $.each(cardsResult, function (index, card) {
        getAllActions(index, card, cardCount, callback);
    });
};

var calculateLeadTime = function (callback) {
    var listId = selected.listIds[selected.listIds.length - 1];
    api.get("/api/lists/" + listId, function (cardsResult) {
        getAllCards(cardsResult, callback);
    });
};

var updateProgress = function (index, cardCount) {
    var width = (index / cardCount) * 100 + "%";
    $progressbar.attr("aria-valuenow", index);
    $progressbar.width(width);
};

var renderLeadTime = function () {
    $.get("../static/templates/leadtime-totals.html", function (template) {
        var leadTimeTotals = Mustache.render(template, {
            data: dataRows.totals()
        });
        $("#leadtime-total").html(leadTimeTotals);
        slideshow.addSlide("#leadtime-total");
        plotLeadTimeGraph("#graph-leadtime", dataRows.totalsSeries());
    });

    $.get("../static/templates/leadtime-per-label.html", function (template) {
        for (var i = 0; i < dataRows.labels().length; i++) {
            var label = dataRows.labels()[i];
            var dataRow = dataRows.label(label);
            var chartId = "#graph-leadtime-" + dataRow.id;
            var divId = "#leadtime-per-label-" + dataRow.id;
            var seriesData = dataRows.leadTimeSeries(label);
            var leadTimePerLabel = Mustache.render(template, {
                data: dataRow
            });

            $("#leadtime-per-label").append(leadTimePerLabel);
            plotLeadTimeGraph(chartId, seriesData);
            slideshow.addSlide(divId);
        }

        slideshow.startSlideShow();
        if (slideshow.visible()) {
            $("#slideshow-controls").toggle();
        }
        $("#next").click(function () {
            slideshow.nextSlide();
        });
        $("#previous").click(function () {
            slideshow.previousSlide();
        });
    });
};

var plotLeadTimeGraph = function (id, data) {
    $(id).highcharts('StockChart', {
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            floor: 0,
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
            name: 'Lead time',
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

var onAuthorize = function (member) {
    selected.boardId = getQueryVariable("boardId");
    selected.listIds = getQueryVariable("listIds").split(",");

    ga('send', 'pageview', {
        'page': '/visualize/authorized?boardId=' + selected.boardId + "&listIds=" + getQueryVariable("listIds"),
        'title': 'Authorized Fluxo Visualize for ' + member.fullName
    });

    $progress.toggle();
    $progressbar.toggle();
    calculateLeadTime(function () {
        renderLeadTime();
        $progress.toggle();
        $progressbar.toggle();
    });
};

var onAuthorizeFailed = function () {
    ga('send', 'pageview', {
        'page': '/not-authorized',
        'title': 'Not authorized'
    });
};

$(document).ready(function () {
    initDarkChartTheme();
    slideshow = new Fluxo.Visualize.SlideShow();
    dataRows = new Fluxo.Visualize.DataRowCollection();
    api.authorize(onAuthorize, onAuthorizeFailed);
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
