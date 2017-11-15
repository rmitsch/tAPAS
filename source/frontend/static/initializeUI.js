//Todos:
//    Continue with binData().
//        - Write route to store data for new run in DB.
//        - Show pop-up/message confirming new entry in DB.
//        - Bin numerical data with d3.histograms
//        - Bin categorical data by looping through data, racking up counts in dictionary,
//          then sorting it alphabetically.
//        - Display data in barcharts.
//        - Highlight currently selected bar (optional).
//        - Proceed with dasboard (layout).
//        - Dashboard implementation.
//        - Start with PAELLA mock-up, iteration 2.
//        - PAELLA: Update backend.
//    Estimated start of dashboard layouting: 15th - 18th of November.

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
            type: "categorical",
            histogram: "nrph1",
            stepper: "stepper_numberOfWords",
            dropdown: "nrps1",
            toggleButton: null,
            slider: null,
            fixedByDefault: null
        },

        numWords: {
            defaultValue: 10000,
            minValue: 1000,
            // maxValue is irrelevant since value will be set at dataset load.
            maxValue: 1000,
            stepValue: 1,
            values: null,
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
            histogram: "nrph6",
            stepper: "stepper_iterations",
            dropdown: null,
            toggleButton: "fixValueCheck5",
            slider: "slider5",
            fixedByDefault: false
        },

        minGradNorm: {
            defaultValue: -7,
            minValue: -10,
            maxValue: -1,
            stepValue: 1,
            values: null,
            type: "numerical",
            histogram: "nrph7",
            stepper: "stepper_minGradNorm",
            dropdown: null,
            toggleButton: "fixValueCheck6",
            slider: "slider6",
            fixedByDefault: false,
            prettify_enabled: true,
            prettify: function (num) {
                return ("10<sup>-" + num + "</sup>");
            }
        },

        randomState: {
            defaultValue: 42,
            minValue: 1,
            maxValue: 100,
            stepValue: 1,
            values: null,
            type: "numerical",
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
            type: "numerical",
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
            type: "categorical",
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
            type: "categorical",
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
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
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
            type: "numerical",
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

function createNewRun()
{
    // Gather values for all parameters.
    parameters = {};
    for (var key in chartElements["menu_createrun"]) {
        let currElement = chartElements["menu_createrun"][key];

        // If slider exists: Read value from there.
        if (currElement["slider"] != null) {
            parameters[key] = $("#" + currElement["slider"]).data("ionRangeSlider")["result"]["from"];
        }

        // If no slider here: With current structure element has to have a select.
        else if (currElement["dropdown"] != null) {
            parameters[key] = $("#" + currElement["dropdown"])[0].value;
        }
    }

    // Add run name.
    parameters["runName"] = $("#nprt1").val();

    // Make sure name was entered.
    if (parameters["runName"] != "") {
        // Send config. to route.
        $.ajax({
          type: "POST",
          url: "/create_new_run",
          data: JSON.stringify(parameters),
          success: function(html_data) {
            if (html_data == "True")
                alert("Successfully added run.");
            else
                alert("Error at data insert.");
          },
          contentType: "application/json"
        });
    }
    // If not: Issue hint.
    else {
       alert("Please enter a name for this run configuration.");
    }
}

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
 * Initializes component for dataset selection (@create new run).
 */
function initDatasetSelect()
{
    $(document).ready(function(){
        var datasetSelect = $("#nrps1")[0];

        // Load datasets into corresponding selects.
        $.ajax({
            url: '/dataset_word_counts',
            type: 'GET',
            success: function(html_data) {
                if (html_data.length > 0 && datasetSelect.options.length == 0) {
                    for(let i = 0; i < html_data.length; i++) {
                        // Append options to select.
                        var option = document.createElement("option");
                        option.text = html_data[i]["name"];
                        datasetSelect.add(option);
                    }

                    // Store response object with number of words for all datasets.
                    chartElements["menu_createrun"]["numWords"]["numberOfWordsInDataset"] = html_data;
                    // Select first value.
                    datasetSelect.value = html_data[0]["name"];

                    // Update value in config object for word count slider.
                    updateNumWordsValues(datasetSelect.value);
                    // Set update handler on change.
                    $("#nrps1").change(function() {
                        updateNumWordsValues(datasetSelect.value);
                    });
                }
            }
        });
     });
}

/**
 * Updates value of controls associated with number of words.
 * @returns True if dataset found and updated, otherwise false.
 */
function updateNumWordsValues(selectedDatasetName)
{
    numberOfWordsInDataset = chartElements["menu_createrun"]["numWords"]["numberOfWordsInDataset"];
    // Find dataset name in loop.
    for (let i = 0; i < numberOfWordsInDataset.length; i++) {
        if (numberOfWordsInDataset[i]["name"] == selectedDatasetName) {
            chartElements["menu_createrun"]["numWords"].maxValue = numberOfWordsInDataset[i]["wv_count"];
            $("#" + chartElements["menu_createrun"]["numWords"]["stepper"])[0].max = numberOfWordsInDataset[i]["wv_count"];
            let slider = $("#" + chartElements["menu_createrun"].numWords["slider"]).data("ionRangeSlider");
            slider.update({
                max: numberOfWordsInDataset[i]["wv_count"]
            });

            return true;
        }
    }

    return false;
}

/**
 * Initializes sliders.
 */
function initSliders()
{
    // Loop through all defined chart elements.
    for (var key in chartElements["menu_createrun"]) {
        let currElement = chartElements["menu_createrun"][key];

        if (currElement["slider"] != null) {
            // Fetch corresponding stepper element.
            let stepper = null;
            if (currElement["stepper"] != null) {
                stepper = $("#" + currElement["stepper"])[0];
            }

            // Initialize slider.
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
                prettify: currElement["prettify"],
                hide_min_max: true,
                hide_from_to: true,
                grid_num: 3,
                prettify_enabled: true,
                values: currElement["values"] != null ? currElement["values"] : [],
                // Define hooks to steppers.
                onChange: function (data) {
                    // Fetch corresponding stepper element.
                    if (stepper != null) {
                        stepper.value = data.from;
                    }
                }
            });
        }
    }
}

/**
 * Initializes carousel functionality.
 */
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
 * Bins data. Used for preparing histogram data for c3.js.
 * @param data Array of records indexed with IDs from chartElements.
 * @param config Configuration object.
 * @param numberOfBins
 */
function binData(data, config, numberOfBins)
{
    binnedData = [3, 4];
    console.log(binnedData);

    if (config["type"] == "numerical") {
        console.log("data: *************************+");
        console.log(data);
        var arr = ["0.362743", "0.357969", "0.356322", "0.355757", "0.358511", "0.357218", "0.356696", "0.354579", "0.828295", "0.391186", "0.378577", "0.39372", "0.396416", "0.395641", "0.37573", "0.379666", "0.377443", "0.391842", "0.402021", "0.377516", "0.38936", "0.38936", "0.400883", "0.393171", "0.374419", "0.400821", "0.380502", "0.396098", "0.388256", "0.398968", "0.392525", "0.401858", "0.387297", "0.376471", "0.378183", "0.379787", "0.382024", "0.387928", "0.395367", "0.391972", "0.381295", "0.391183", "0.383598", "0.386424", "0.384338", "0.401834", "0.406253", "0.392854", "0.399266", "0.400804", "0.391146", "0.395441", "0.396265", "0.397894", "0.384822", "0.385181", "0.395443", "0.400981", "0.401716", "0.406633", "0.406887", "0.40694", "0.391219", "0.387946", "0.398858", "0.402233", "0.388583", "0.389772", "0.397084", "0.711566", "0.954557", "0.524007", "0.672288", "0.668441", "0.421726", "0.549536", "0.932952", "0.397851", "0.395536", "0.354818", "0.374355", "0.375257", "0.362613", "0.391271", "0.379219", "0.363316", "0.866006", "0.862254", "0.864403", "0.861346", "0.845225", "0.784467", "0.801275", "0.638579", "0.847282", "0.847402", "0.847747", "0.790411", "0.835979", "0.838546"];
        var bins = d3.layout.histogram()  // create layout object
            .bins(20)       // to use 20 bins
            .range([0, 1])  // to cover range from 0 to 1
            (arr);          // group the data into the bins
    }


    else if (config["type"] == "categorical") {
        for (let i = 0; i < data.length; i++)
            console.log(data[i]);
    }

    return binnedData;
}

/**
 * Initialize parameter histograms and toggle buttons in view "Create new run".
 * @param dataset_metadata
 */
function initInitialParameterHistograms(dataset_metadata)
{
    $(document).ready(function(){
        // Loop through all defined chart elements.
        for (var key in chartElements["menu_createrun"]) {
            let currElement = chartElements["menu_createrun"][key];

            // Bin data.
            binnedData = binData(dataset_metadata, currElement, 10);
            binnedData.unshift(key);

            // If element has histogram:
            if (currElement["histogram"] != null) {
                var chart = c3.generate({
                    bindto: "#" + currElement["histogram"],
                    data: {
                        columns: [
                            binnedData
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
            let currElement = chartElements["menu_createrun"][key];

            if (currElement["stepper"] != null) {
                // Why does jquery return an array with length 1 here?
                stepper = $("#" + currElement["stepper"])[0];
                // Set thresholds and intial value.
                stepper.min     = currElement.minValue;
                stepper.max     = currElement.maxValue;
                stepper.value   = currElement.defaultValue;
                stepper.step    = currElement.stepValue;
                let slider      = $("#" + currElement["slider"]).data("ionRangeSlider");

                // Add event listener on input change.
                stepper.addEventListener("input", function(e) {
                    slider.update({
                        from: e.target.value
                    });
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

            // Get information on datasets in database.
            $.ajax({
                url: '/dataset_metadata',
                type: 'POST',
                success: function(dataset_metadata) {
                    // Initializing carousel functionality.
                    initSlickCarousel();

                    // Fill dataset select.
                    initDatasetSelect();

                    // Initializing sliders.
                    initSliders();

                    // Initializing initial parameter histograms.
                    initInitialParameterHistograms(dataset_metadata);

                    // Initialize steppers.
                    initSteppers();

                    // Initialize chunked file upload.
                    initChunkedFileUpload();
                }
            });
        }
    });
});