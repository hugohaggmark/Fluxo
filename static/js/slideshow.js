var Fluxo = Fluxo || {};
Fluxo.Visualize = Fluxo.Visualize || {};


Fluxo.Visualize.SlideShow = function () {
    'use strict';
    var slidesArray = [];
    var currentSlide = 0;
    var previousSlide = 0;
    this.interval = 60 * 1000;

    function isCalledFromUnitTest() {
        return typeof $ === "undefined";
    }

    function changeSlide() {
        if (isCalledFromUnitTest())
            return;

        $(slidesArray[previousSlide]).fadeOut("slow", function () {
            $(slidesArray[currentSlide]).fadeIn("slow");
        });
    }

    this.toggleVisibility = function (slideId) {
        if (isCalledFromUnitTest())
            return;

        if (slidesArray.length <= 1)
            return;

        $(slideId).toggle();
    };

    this.slides = function () {
        return slidesArray;
    };

    this.visible = function () {
        return slidesArray.length > 0;
    };

    this.addSlide = function (slideId) {
        slidesArray.push(slideId);
        this.toggleVisibility(slideId);
    };

    this.currentSlide = function () {
        return slidesArray[currentSlide];
    };

    this.nextSlide = function () {
        previousSlide = currentSlide;
        if (currentSlide === slidesArray.length - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        changeSlide();
    };

    this.previousSlide = function () {
        previousSlide = currentSlide;
        if (currentSlide === 0) {
            currentSlide = slidesArray.length - 1;
        } else {
            currentSlide--;
        }
        changeSlide();
    };

    this.startSlideShow = function () {
        if (isCalledFromUnitTest())
            return;

        setInterval(this.nextSlide, this.interval);
    };
};
