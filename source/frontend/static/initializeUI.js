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
            values: [],
            type: "categorical",
            histogram: "nrph1",
            stepper: "stepper_numberOfWords",
            dropdown: "nrps1",
            toggleButton: null,
            slider: null,
            fixedByDefault: null
        },

        numWords: {
            defaultValue: 1000,
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
            maxValue: 2000,
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
            toggleButton: "fixValueCheck6",
            slider: "slider6",
            fixedByDefault: false,
            prettify_enabled: true,
            prettify: function (num) {
                return ("10<sup>-" + num + "</sup>");
            },
            normalize: function(num) {
                return Math.log10(num);
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
            values: ["braycurtis", "canberra", "chebyshev", "cityblock", "correlation", "cosine",
                     "dice", "euclidean", "hamming",  "jaccard", "kulsinski", "mahalanobis",
                     "matching", "minkowski", "rogerstanimoto", "russellrao", "seuclidean",
                     "sokalmichener", "sokalsneath", "sqeuclidean", "yule"],
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
            values: ["random", "PCA"],
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

        // Check if values are to be fixed.
        if (currElement["toggleButton"] != null) {
            parameters["is_" + key + "_fixed"] = $("#" + currElement["toggleButton"])[0]["checked"];
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
            // Init progress bar.
            $("#newRun_status").progressbar({
                value: 10
            });
            $("#newRun_status").css({'display': 'block'});
            $("#newRun_status .ui-progressbar-value").css({'background': '#3d4a57'});
            $("#newRun_status_progressLabel").html("Creating initial t-SNE model.");

            // Create initial t-SNE model.
            $.ajax({
                type: "POST",
                url: "/create_initial_tsne_model",
                data: JSON.stringify(parameters),
                success: function(tsne_model_id) {
                    $("#newRun_status").progressbar({
                        value: 40
                    });
                    $("#newRun_status_progressLabel").html("Calculating quality measures.");

                    // Calculate quality measures.
                    $.ajax({
                        type: "POST",
                        url: "/calculate_quality_measures",
                        data: JSON.stringify({
                            tsne_model_id: tsne_model_id,
                            dataset_name: parameters.dataset,
                            num_words: parameters.numWords
                        }),
                        success: function(html_data) {
                            $("#newRun_status").progressbar({
                                value: 100
                            });
                            $("#newRun_status_progressLabel").html("Finished.");
                        },
                        contentType: "application/json"
                    });
                },
                contentType: "application/json"
            });
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
            // Show dialog.
            $( "#runopt_dialog" ).dialog("open");
            // Hide carousel.
            $("#carousel").css("display", "none");
        });
    }
    // Otherwise: Hide dialog again.
    else {
        $(document).ready(function(){
            // Hide dialog and dashboard.
            $( "#runopt_dialog" ).dialog("close");
            $("#dashboard").css("display", "none");
            // Show carousel.
            $("#carousel").css("display", "block");
        });
    }
}

/**
 * Initializes component for dataset selection (@create new run).
 * @param dataset_metadata
 */
function initDatasetSelect(dataset_metadata)
{
    $(document).ready(function(){
        var datasetSelect = $("#nrps1")[0];

        // Load datasets into corresponding selects.
        $.ajax({
            url: '/dataset_word_counts',
            type: 'GET',
            success: function(html_data) {
                if (html_data.length > 0 && datasetSelect.options.length == 0) {
                    chartElements["menu_createrun"]["dataset"]["values"] = [];
                    for(let i = 0; i < html_data.length; i++) {
                        // Append options to select and to config object.
                        var option_newRun = document.createElement("option");
                        option_newRun.text = html_data[i]["name"];
                        datasetSelect.add(option_newRun);
                        chartElements["menu_createrun"]["dataset"]["values"].push(html_data[i]["name"]);

                        // Add option value to popup for dataset selection before optimization run.
                        var option_runOpt = document.createElement("option");
                        option_runOpt.text = html_data[i]["name"];
                        $("#runopt_datasetSelect")[0].add(option_runOpt);
                    }

                    // Store response object with number of words for all datasets.
                    chartElements["menu_createrun"]["numWords"]["numberOfWordsInDataset"] = html_data;
                    // Select first value.
                    datasetSelect.value = html_data[0]["name"];

                    // Update value in config object for word count slider.
                    updateNumWordsValues(datasetSelect.value);
                    // Set update handler on change for dataset selection in view for run creation.
                    $("#nrps1").change(function() {
                        updateNumWordsValues(datasetSelect.value);
                    });

                    // Generate histograms.
                    initInitialParameterHistograms(dataset_metadata);

                    // Initialize selects for popup @ run optimization.
                    var runDataAjaxConfig = {
                        url: '/runs',
                        type: 'GET',
                        data: {
                            dataset_name: null
                        },
                        success: function(html_data) {
                            // Clear dropdown.
                            for(let i = $("#runopt_runSelect")[0].options.length - 1 ; i >= 0 ; i--) {
                                $("#runopt_runSelect")[0].remove(i);
                            }

                            // Fill dropdown.
                            for(let i = 0; i < html_data.length; i++) {
                                var option = document.createElement("option");
                                option.text = html_data[i]["title"];
                                $("#runopt_runSelect")[0].add(option);
                            }
                        }
                    };

                    // Set update handler on change for dataset selection in view for run optimization.
                    $("#runopt_datasetSelect").change(function() {
                        runDataAjaxConfig.data.dataset_name = $("#runopt_datasetSelect").val();
                        // Fetch runs available for this dataset.
                        $.ajax(runDataAjaxConfig);
                    });

                    // Fetch value for dataset selected by default.
                    runDataAjaxConfig.data.dataset_name = $("#runopt_datasetSelect").val();
                    // Fetch runs available for this dataset.
                    $.ajax(runDataAjaxConfig);
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
    let numberOfWordsInDataset = chartElements["menu_createrun"]["numWords"]["numberOfWordsInDataset"];
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
        arrows: false,
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
        $("#runopt_dialog").dialog({
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
 * @param key Internally used parameter name.
 * @param config Configuration object.
 * @param numberOfBins
 */
function binData(data, key, config, numberOfBins)
{
    binnedData = [];

    if (config["type"] == "numerical") {
        // Gather all values for attribute and put them into an array.
        let attributeValues = [];

        for (let i = 0; i < data.length; i++) {
            // .toLowerCase() since for whatever reason column titles are returned that way.
            if (key != "minGradNorm")
                attributeValues.push(data[i][key.toLowerCase()]);
            // Special case minGradNorm: Displayed as total numbers, stored as components.
            else
                attributeValues.push(Math.log10(data[i][key.toLowerCase()]));
        }
        // Let d3 create a histogram.
        var bins = d3.layout.histogram()  // create layout object
            .bins(10)       // to use 20 bins
            .range([config["minValue"], config["maxValue"]])
            (attributeValues);          // group the data into the bins
        // Count elements in bins.
        for (let i = 0; i < bins.length; i++) {
            binnedData.push(bins[i].length);
        }
    }

    // If categorical variables: Bin by hand.
    else if (config["type"] == "categorical" && config["values"] != null) {
        counts = {};

        for (let i = 0; i < data.length; i++) {
            // .toLowerCase() since for whatever reason column titles are returned that way.
            let value = data[i][key.toLowerCase()];

            if (value in counts)
                counts[value]++;
            else
                counts[value] = 1;
        }

        // Add values for all possible options to array of binned values.
        for (let i = 0; i < config["values"].length; i++) {
            binnedData.push(config["values"][i] in counts ? counts[config["values"][i]] : 0);
        }
    }
    else if (config["type"] == "categorical" && config["values"] != null) {
        console.log("############### " + key)
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
            binnedData = binDataCategorically(dataset_metadata, key.toLowerCase(), currElement, 10, 10);
            binnedData.data.unshift("Count");

            // If element has histogram:
            if (currElement["histogram"] != null) {
                var chart = c3.generate({
                    bindto: "#" + currElement["histogram"],
                    data: {
                        columns: [
                            binnedData.data
                        ],
                        colors: {
                            Count: '#3d4a57'
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
                        show: true
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

            // If this is element with categorical element and hence has dropdown:
            // Color first bar, since it's the selected one.
            // Might be generalized later.
            if (currElement["type"] == "categorical") {
                let selectorString = "#" + currElement["histogram"] +  " .c3-shape-0";

                // If data is available.
                if ($(selectorString).length != 0)
                    d3.select(selectorString).style("fill", "#ed5565");

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
 * Initialized dropdown components.
 */
function initDropdowns()
{
    $(document).ready(function(){
        // Loop through all defined chart elements.
        for (var key in chartElements["menu_createrun"]) {
            let currElement = chartElements["menu_createrun"][key];

            if (currElement["dropdown"] != null) {
                let dropdown = $("#" + currElement["dropdown"]);

                dropdown.on('change', function() {
                    for(let i = 0; i < currElement.values.length; i++) {
                        // Highlight bar with selected index.
                        let currentBar = d3.select("#" + currElement["histogram"] +  " .c3-shape-" + i);
                        currentBar.style("fill", i == this.selectedIndex ? "#ed5565" : "#3d4a57"); // ed5565
                    }
                });
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
      chunkSize: 10 * 1024 * 1024,
      simultaneousUploads: 1
    });

    r.assignBrowse(document.getElementById('vectorFileUpload'));

    r.on('fileAdded', function(file) {
        // Init progress bar.
        $("#upload_status").progressbar({
            value: 0
        });
        $("#upload_status").css({'display': 'block'});
        $("#upload_status .ui-progressbar-value").css({'background': '#3d4a57'});
        $("#upload_status_progressLabel").html("Importing data.");
        // Start upload.
        r.upload();
    });

    r.on('fileSuccess', function(file,message) {
        $("#upload_status_progressLabel").html("Checking WE accuracy.");
        // Determine WE's QVEC score.
        $.ajax({
            url: '/check_we_model',
            type: 'POST',
            data: JSON.stringify(file.fileName),
            success: function(html_data) {
                $("#upload_status").progressbar({value: 66});
                $("#upload_status_progressLabel").html("Clustering word embedding.");
                // Cluster word embedding.
                $.ajax({
                    url: '/cluster_we_model',
                    type: 'POST',
                    data: JSON.stringify(file.fileName),
                    success: function(html_data) {
                        $("#upload_status").progressbar({value: 100});
                        $("#upload_status_progressLabel").html("Finished.");
                    },
                    contentType: "application/json"
                });
            },
            contentType: "application/json"
        });
    });

    r.on('fileError', function(file, message) {
        console.log(message);
    });

    r.on('fileProgress', function(file) {
        // Handle progress for both the file and the overall upload
        $("#upload_status").progressbar('value', r.progress() * 100 / 3.0);
    });
}

// Initialize setup UI.
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
                    // Calls method to init initial parameter histograms.
                    initDatasetSelect(dataset_metadata);

                    // Initialize dropdown.
                    initDropdowns();

                    // Initializing sliders.
                    initSliders();

                    // Initialize steppers.
                    initSteppers();

                    // Initialize chunked file upload.
                    initChunkedFileUpload();

                    // Initialize dashboard.
                    initDashboard();
                }
            });
        }
    });
});