var currentStep = 1;
var authorized = false;
var selected = {
    boardId: -1,
    listIds: [],
    listNames: [],
};
var step1Content = $("#step1-content");
var step2Content = $("#step2-content");
var step3Content = $("#step3-content");

var step1Label = $("#step1-label");
var step2Label = $("#step2-label");
var step3Label = $("#step3-label");
var nextStep = $("#nextStep");
var prevStep = $("#prevStep");

var renderFlow = function () {
    $.get("static/templates/step3-flow.html", function (template) {
        var rendered = Mustache.render(template, {
            lists: selected.listNames
        });
        $("#step3-flow").html(rendered);
    });
};

var renderStartList = function () {
    var lists = [];
    $.each(selected.listIds, function (index, id) {
        lists.push({
            id: id,
            name: selected.listNames[index]
        });
    });
    $.get("static/templates/start-list.html", function (template) {
        var rendered = Mustache.render(template, {
            lists: lists
        });
        $("#start-list").html(rendered);
        $("#start-list").addClass("selectpicker");
    });
};

var onBoardClicked = function () {
    selected.boardId = this.id;
    if (selected.boardId)
        nextStep.removeClass("disabled");
};

var onListClicked = function () {
    var index = selected.listIds.indexOf(this.id);
    if (index === -1) {
        selected.listIds.push(this.id);
        selected.listNames.push($("#" + this.id).parent().text().trim());
    } else {
        selected.listIds.splice(index, 1);
        selected.listNames.splice(index, 1);
    }

    if (selected.listIds.length > 0) {
        nextStep.removeClass("disabled");
    }

    renderFlow();
    //renderStartList();
};

var onStep = function () {
    if (currentStep === 2) {
        ga('send', 'pageview', {
            'page': '/step-2',
            'title': 'Step 2'
        });

        step1Content.hide();
        step3Content.hide();
        step2Content.show();
        step1Label.addClass("disabled");
        step3Label.addClass("disabled");
        step2Label.removeClass("disabled");
        prevStep.addClass("disabled");
        nextStep.addClass("disabled");
        $("#step2").click();
    }

    if (currentStep === 3) {
        ga('send', 'pageview', {
            'page': '/step-3',
            'title': 'Step 3'
        });

        step1Content.hide();
        step2Content.hide();
        step3Content.show();
        step1Label.addClass("disabled");
        step2Label.addClass("disabled");
        step3Label.removeClass("disabled");
        prevStep.removeClass("disabled");
        nextStep.addClass("disabled");
        $("#step3").click();
    }

    if (currentStep === 4) {
        ga('send', 'pageview', {
            'page': '/step-visualize',
            'title': 'Step Visualize'
        });
        window.open("/visualize/index.html?boardId=" + selected.boardId + "&listIds=" + selected.listIds.join(), "_blank");
        currentStep--;
        onStep();
    }
};

prevStep.click(function () {
    if (currentStep == 1)
        return;

    currentStep--;
    onStep();
});

nextStep.click(function () {
    if (currentStep == 4)
        return;

    currentStep++;
    onStep();
});

var onAuthorize = function () {
    Trello.members.get("me", function (member) {
        ga('send', 'pageview', {
            'page': '/authorized',
            'title': 'Welcome ' + member.fullName
        });

        $("#fullName").text(member.fullName);
        authorized = true;
        currentStep++;
        onStep();
    });
};

var onAuthorizeFailed = function () {
    ga('send', 'pageview', {
        'page': '/not-authorized',
        'title': 'Not authorized'
    });

    currentStep = 1;
    authorized = false;
};

Trello.authorize({
    interactive: false,
    success: onAuthorize,
    error: onAuthorizeFailed
});

$("#step2").click(function () {
    Trello.members.get("my/boards", function (boards) {
        $.get("static/templates/step2.html", function (template) {
            var rendered = Mustache.render(template, {
                boards: boards
            });
            $("#step2-target").html(rendered);
            $(".btn-board").change(onBoardClicked);
        });
    });
});

$("#step3").click(function () {
    selected.listIds.length = 0;
    selected.listNames.length = 0;
    renderFlow();
    Trello.get("boards/" + selected.boardId + "/lists", function (lists) {
        $.get("static/templates/step3.html", function (template) {
            var rendered = Mustache.render(template, {
                lists: lists
            });
            $("#step3-target").html(rendered);
            $(".btn-list").change(onListClicked);
        });
    });
});


$("#connectLink").click(function () {
    Trello.authorize({
        type: "popup",
        name: "Fluxo",
        expiration: "30days",
        success: onAuthorize,
        error: onAuthorizeFailed
    });
});
