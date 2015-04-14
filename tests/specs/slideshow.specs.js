describe("SlideShows", function () {
    var slideshow = {};

    beforeEach(function () {
        slideshow = new Fluxo.Visualize.SlideShow();
    });

    describe("A new slideshow", function () {
        it("Should be created", function () {
            expect(slideshow).toEqual(jasmine.anything());
        });

        it("Should have zero slides", function () {
            expect(slideshow.slides()).toEqual(jasmine.anything());
            expect(slideshow.slides().length).toEqual(0);
        });

        it("Should have a default slideshow interval", function () {
            expect(slideshow.interval).toEqual(60000);
        });

        it("Should not be visible", function () {
            expect(slideshow.visible()).toEqual(false);
        });
    });

    describe("A slideshow with several slides", function () {
        beforeEach(function () {
            slideshow.addSlide("#1");
            slideshow.addSlide("#2");
            slideshow.addSlide("#3");
        });

        it("Should be visible", function () {
            expect(slideshow.visible()).toEqual(true);
        });

        it("Should have correct number of slides", function () {
            expect(slideshow.slides().length).toEqual(3);
        });

        it("Should make the first slide current", function () {
            expect(slideshow.currentSlide()).toEqual("#1");
        });

        describe("When on the first slide", function () {
            it("When calling next the second slide should be current", function () {
                slideshow.nextSlide();
                expect(slideshow.currentSlide()).toEqual("#2");
            });

            it("When calling previous the last slide should be current", function () {
                slideshow.previousSlide();
                expect(slideshow.currentSlide()).toEqual("#3");
            });
        });

        describe("When on the last slide", function () {
            beforeEach(function () {
                slideshow.nextSlide();
                slideshow.nextSlide();
            });

            it("When calling next the first slide should be current", function () {
                slideshow.nextSlide();
                expect(slideshow.currentSlide()).toEqual("#1");
            });

            it("When calling previous the first slide should be current", function () {
                slideshow.previousSlide();
                expect(slideshow.currentSlide()).toEqual("#2");
            });
        });
    });
});
