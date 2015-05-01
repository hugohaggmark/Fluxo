var Fluxo = Fluxo || {};

Fluxo.Api = function () {
    "use strict";

    this.authorize = function (successCallback, failureCallback) {
        this.get("/api/me", successCallback, failureCallback);
    };

    this.get = function (url, successCallback, errorCallback) {
        $.ajax({
            method: "GET",
            dataType: "json",
            url: url,
            success: function (data) {
                if (!successCallback)
                    throw "You must supply a successCallback";

                successCallback(data);
            },
            error: function (data, textStatus, jqXHR) {
                console.log("Ooops something went terribly wrong", textStatus);
                if (errorCallback) {
                    errorCallback(data, textStatus, jqXHR);
                }
            }
        });
    };
};
