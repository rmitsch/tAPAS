//Todos:
//    - Add listener to model interaction between sliders/selects and steppers.
//    - Read data from DB.
//    - Highlight bar when selected value in it's interval? Decide and implement.
//Should be possible on Saturday. After that:
//    - Dashboard layout.
//    - Dashboard implementation.
//    - Start with PAELLA mock-up, iteration 2.
//    - PAELLA: Update backend.

// ************************************************************
// ************************************************************

/**
 * Define UI element references.
 */

// IDs of menu buttons.
menuIDs = ["menu_start", "menu_upload", "menu_createrun", "menu_run"]

// UI elements in page for creating new runs. Parameter names are used as keys on leaf-level.
chartElements = {
    menu_createrun: {
        dataset: {
            defaultValue: null,
            minValue: null,
            maxValue: null,
            stepValue: null,
            values: null,
            histogram: "nrph1",
            stepper: "stepper_numberOfWords",
            dropdown: "nrps1",
            toggleButton: null,
            slider: null,
            fixedByDefault: null
        },

        numWords: {
            defaultValue: 1000,
            minValue: 1,
            // maxValue is irrelevant since value will be set at dataset load.
            maxValue: 1000,
            stepValue: 1,
            values: null,
            histogram: "nrph16",
            stepper: "stepper_numberOfWords",
            dropdown: null,
            toggleButton: null,
            slider: "slider13",
            fixedByDefault: null
        },

        numDimensions: {
            defaultValue: 2,
            minValue: 1,
            // Which value for max.?
            maxValue: 5,
            stepValue: 1,
            values: null,
            histogram: "nrph2",
            stepper: "stepper_numdim",
            dropdown: null,
            toggleButton: "fixValueCheck1",
            slider: "slider1",
            fixedByDefault: true
        },

        perplexity: {
            defaultValue: 30,
            minValue: 1,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph3",
            stepper: "stepper_perplexity",
            dropdown: null,
            toggleButton: "fixValueCheck2",
            slider: "slider2",
            fixedByDefault: false
        },

        earlyExaggeration: {
            defaultValue: 12,
            minValue: 1,
            maxValue: 50,
            stepValue: 1,
            values: null,
            histogram: "nrph4",
            stepper: "stepper_earlyExaggeration",
            dropdown: null,
            toggleButton: "fixValueCheck3",
            slider: "slider3",
            fixedByDefault: false
        },

        learningRate: {
            defaultValue: 200,
            minValue: 1,
            maxValue: 5000,
            stepValue: 1,
            values: null,
            histogram: "nrph5",
            stepper: "stepper_learningRate",
            dropdown: null,
            toggleButton: "fixValueCheck4",
            slider: "slider4",
            fixedByDefault: false
        },

        numIterations: {
            defaultValue: 2000,
            minValue: 50,
            maxValue: 10000,
            stepValue: 1,
            values: null,
            histogram: "nrph6",
            stepper: "stepper_iterations",
            dropdown: null,
            toggleButton: "fixValueCheck5",
            slider: "slider5",
            fixedByDefault: false
        },

        minGradNorm: {
            defaultValue: -7,
            minValue: -10, // 0.0000000001
            maxValue: -1,
            stepValue: 1,
            values: [
                "10<sup>-10</sup>", "10<sup>-9</sup>",
                "10<sup>-8</sup>", "10<sup>-7</sup>",
                "10<sup>-6</sup>", "10<sup>-5</sup>",
                "10<sup>-4</sup>", "10<sup>-3</sup>",
                "10<sup>-2</sup>", "10<sup>-1</sup>",
            ],
            histogram: "nrph7",
            stepper: "stepper_minGradNorm",
            dropdown: null,
            toggleButton: "fixValueCheck6",
            slider: "slider6",
            fixedByDefault: false
        },

        randomState: {
            defaultValue: 42,
            minValue: 1,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph8",
            stepper: "stepper_randomState",
            dropdown: null,
            toggleButton: "fixValueCheck7",
            slider: "slider7",
            fixedByDefault: true
        },

        angle: {
            defaultValue: 0.5,
            minValue: 0.1,
            maxValue: 1.0,
            stepValue: 0.1,
            values: null,
            histogram: "nrph9",
            stepper: "stepper_angle",
            dropdown: null,
            toggleButton: "fixValueCheck8",
            slider: "slider8",
            fixedByDefault: false
        },

        metric: {
            defaultValue: "euclidean",
            minValue: null,
            maxValue: null,
            stepValue: null,
            values: null,
            histogram: "nrph10",
            stepper: null,
            dropdown: "nrps2",
            toggleButton: "fixValueCheck9",
            slider: null,
            fixedByDefault: true
        },

        initMethod: {
            defaultValue: "PCA",
            minValue: null,
            maxValue: null,
            stepValue: null,
            values: null,
            histogram: "nrph11",
            stepper: null,
            dropdown: "nrps3",
            toggleButton: "fixValueCheck10",
            slider: null,
            fixedByDefault: true
        },

        measureWeight_trustworthiness: {
            defaultValue: 1,
            minValue: 0,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph12",
            stepper: "stepper_measureTrustworthiness",
            dropdown: null,
            toggleButton: null,
            slider: "slider9"
        },

        measureWeight_continuity: {
            defaultValue: 1,
            minValue: 0,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph13",
            stepper: "stepper_measureContinuity",
            dropdown: null,
            toggleButton: null,
            slider: "slider10"
        },

        measureWeight_generalization: {
            defaultValue: 1,
            minValue: 0,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph14",
            stepper: "stepper_generalizationAccuracy",
            dropdown: null,
            toggleButton: null,
            slider: "slider11"
        },

        measureWeight_relativeWEQ: {
            defaultValue: 1,
            minValue: 0,
            maxValue: 100,
            stepValue: 1,
            values: null,
            histogram: "nrph15",
            stepper: "stepper_relativeWEQuality",
            dropdown: null,
            toggleButton: null,
            slider: "slider12"
        }
    }
};

// ************************************************************
// ************************************************************

function updateCarousel(menuItemID)
{
    for(var i = 0; i < menuIDs.length; i++) {
        document.getElementById(menuIDs[i]).classList.remove('pure-menu-selected');
    }

    // Set selected class for currently selected menu item.
    document.getElementById(menuItemID).classList.add('pure-menu-selected');

    // Move carousel to panel of selected item.
    $('.carousel').slick('slickGoTo', menuIDs.indexOf(menuItemID));

    // If "Run optimization" is selected: Show dialog.
    if(menuItemID == "menu_run") {
        $(document).ready(function(){
            $( "#runopt_dialog" ).dialog("open");
        });
    }

    else {
        $(document).ready(function(){
            $( "#runopt_dialog" ).dialog("close");
        });
    }
}

/**
 * Initializes sliders.
 */
function initSliders()
{
    // Loop through all defined chart elements.
    for (var key in chartElements["menu_createrun"]) {
        var currElement = chartElements["menu_createrun"][key];

        if (currElement["slider"] != null) {
            $("#" + currElement["slider"]).ionRangeSlider({
                hide_min_max: true,
                keyboard: true,
                min: currElement["minValue"],
                max: currElement["maxValue"],
                from: currElement["defaultValue"],
                type: 'single',
                step: currElement["stepValue"],
                grid: true,
                prettify_enabled: true,
                hide_min_max: true,
                hide_from_to: true,
                grid_num: 3,
                prettify_enabled: true,
                values: currElement["values"] != null ? currElement["values"] : []
            });
        }
    }
}

function initSlickCarousel()
{
    carousel = $('.carousel');

    // Initialize slick.
    carousel.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        accessibility: true,
        arrows: true,
        centerMode: true,
        dots: true,
        fade: true,
        swipe: false,
        infinite: false,
        speed: 200
    });

    // Change navigation when slide changes via carousel.
    $('.carousel').on('beforeChange', function(event, slick, currentSlideIndex, nextSlideIndex) {
        window.location.hash = menuIDs[nextSlideIndex];
        updateCarousel(menuIDs[nextSlideIndex]);
    });

    // Initialize popup for selection of run.
    $(document).ready(function(){
        $( "#runopt_dialog" ).dialog({
            autoOpen: false,
            modal: true
        });
    });

    // Find out which element should be selected after page load.
    var setAnchor = window.location.hash.substring(1);
    var selectedMenuItemID = $.inArray(setAnchor, menuIDs) > -1 ? setAnchor : "menu_start";
    // Update carousel.
    updateCarousel(selectedMenuItemID);
}

/**
 * Initialize parameter histograms and toggle buttons in view "Create new run".
 */
function initInitialParameterHistograms()
{
    $(document).ready(function(){
        // Loop through all defined chart elements.
        for (var key in chartElements["menu_createrun"]) {
            var currElement = chartElements["menu_createrun"][key];
            // If element has histogram:
            if (currElement["histogram"] != null) {
                var chart = c3.generate({
                    bindto: "#" + currElement["histogram"],
                    data: {
                        columns: [
                            ['sample', 30, 200, 100, 200, 150, 250, 20, 80, 100, 400, 350, 10, 200, 200, 34, 521, 234]
                        ],
                        colors: {
                            sample: '#3d4a57'
                        },
                        type: 'bar'
                    },
                    bar: {
                        width: {
                            ratio: 0.9 // this makes bar width 50% of length between ticks
                        }
                    },
                    legend: {
                        show: false
                    },
                    tooltip: {
                        show: false
                    },
                    axis: {
                            x: {show: false},
                            y: {show: false}
                    },
                    size: {
                        height: 50
                    },
                    point: {
                        show: false
                    }
                });
            }

            // Initialize "Fix value" toggle buttons.
            if (currElement["toggleButton"] != null) {
                $("#" + currElement["toggleButton"]).lc_switch();
                // Change toggle according to definition.
                if (currElement["fixedByDefault"])
                    $("#" + currElement["toggleButton"]).lcs_on();
            }
        }
    });
}

/**
 * Initializes steppers.
 */
function initSteppers()
{
    $(document).ready(function(){
            // Loop through all defined chart elements.
            for (var key in chartElements["menu_createrun"]) {
                var currElement = chartElements["menu_createrun"][key];

                if (currElement["stepper"] != null) {
                    // Why does jquery return an array with length 1 here?
                    stepper = $("#" + currElement["stepper"])[0];
                    // Set thresholds and intial value.
                    stepper.min     = currElement.minValue;
                    stepper.max     = currElement.maxValue;
                    stepper.value   = currElement.defaultValue;
                    stepper.step    = currElement.stepValue;
                    stepper.slider = $("#" + currElement["slider"]).data("ionRangeSlider");

                    // Add event listener on input change.
                    stepper.addEventListener("input", function(e) {
                        var num = stepper.value;
                        console.log(e.target.value);

                        if (e.target.slider != null) {
                            e.target.slider.update({
                                from: e.target.value
                            });

                        }
                    });
                }
            }
    });
}

/*
 * Use resume.js to upload massive files chunked.
 */
function initChunkedFileUpload()
{
    var r = new Resumable({
      target: '/upload',
      // Limit to chunks to 50 MB.
      chunkSize: 50 * 1024 * 1024,
      simultaneousUploads: 1
    });

    r.assignBrowse(document.getElementById('vectorFileUpload'));

    r.on('fileAdded', function(file) {
        console.log("file added");
        r.upload();
    });

    r.on('fileSuccess', function(file,message) {
        console.log("file success");
    });

    r.on('fileError', function(file, message) {
        console.log(message);
    });

    // Use r.on('progress') to update progress indicator.
}


$(document).ready(function(){
    // Fetch carousel content.
    $.ajax({
        url: '/carousel_content',
        type: 'POST',
        success: function(html_data) {
            $(".carousel").html(html_data);

            // Initializing sliders.
            initSliders();

            // Initializing initial parameter histograms.
            initInitialParameterHistograms();

            // Initializing carousel functionality.
            initSlickCarousel();

            // Initialize chunked file upload.
            initChunkedFileUpload();

            // Initialize steppers.
            initSteppers();
        }
    });
});