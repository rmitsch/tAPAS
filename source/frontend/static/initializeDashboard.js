// Remember assigned IDs.
var assignedIDs = new Set();

// UI elements in page for running optimization. Parameter names are used as keys on leaf-level.
// Hyperparameter pane.
chartElements.hyperparameters = {
    numDimensions: {
        displayName: "Number of dim.",
        attributeNameInDB: "n_components",
        minValue: 1,
        maxValue: 5,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    perplexity: {
        displayName: "Perplexity",
        attributeNameInDB: "perplexity",
        minValue: 1,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    earlyExaggeration: {
        displayName: "Early exaggeration",
        attributeNameInDB: "early_exaggeration",
        minValue: 1,
        maxValue: 50,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    learningRate: {
        displayName: "Learning rate",
        attributeNameInDB: "learning_rate",
        minValue: 1,
        maxValue: 2000,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    numIterations: {
        displayName: "Number of iter.",
        attributeNameInDB: "n_iter",
        minValue: 50,
        maxValue: 10000,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    minGradNorm: {
        displayName: "Min. gradient norm",
        attributeNameInDB: "min_grad_norm",
        minValue: -10,
        maxValue: -1,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
        prettify_enabled: true,
        prettify: function (num) {
            return ("10<sup>-" + num + "</sup>");
        },
        normalize: function(num) {
            return Math.log10(num);
        }
    },

    randomState: {
        displayName: "Random state",
        attributeNameInDB: "random_state",
        minValue: 1,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    angle: {
        displayName: "Angle",
        attributeNameInDB: "angle",
        minValue: 0.1,
        maxValue: 1,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    metric: {
        displayName: "Metric",
        attributeNameInDB: "metric",
        minValue: 0,
        maxValue: 100,
        defaultValue: "euclidean",
        values: ["braycurtis", "canberra", "chebyshev", "cityblock", "correlation", "cosine",
                 "dice", "euclidean", "hamming",  "jaccard", "kulsinski", "mahalanobis",
                 "matching", "minkowski", "rogerstanimoto", "russellrao", "seuclidean",
                 "sokalmichener", "sokalsneath", "sqeuclidean", "yule"],
        type: "categorical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    initMethod: {
        displayName: "Init. method",
        attributeNameInDB: "init_method",
        minValue: 0,
        maxValue: 100,
        defaultValue: "PCA",
        values: ["random", "PCA"],
        type: "categorical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    }
};
// Quality evaluation box.
chartElements.qualityEvaluation = {

};
// Quality measure pane.
chartElements.qualityMeasures = {
  measure_trustworthiness: {
        displayName: "Trustworthiness",
        attributeNameInDB: "measure_weight_trustworthiness",
        minValue: 0,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    measure_continuity: {
        displayName: "Continuity",
        attributeNameInDB: "measure_weight_continuity",
        minValue: 0,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    measure_generalization: {
        displayName: "Generalization accuracy",
        attributeNameInDB: "measure_weight_generalization_accuracy",
        minValue: 0,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    },

    measure_wordEmbeddingInformationRatio: {
        displayName: "WE information ratio",
        attributeNameInDB: "measure_weight_we_information_ratio",
        minValue: 0,
        maxValue: 100,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label"),
    }
};

/**
 * Defines ID generator.
 * @param prefix
 * @return Unique ID, consisting of prefix and a randomly, unused integer.
 */
function uniqueID(prefix)
{
    let uniqueID = null;
    let max = 500;
    let min = 1;

    do {
        uniqueID =  prefix != null ?
                    prefix + (Math.floor(Math.random() * (max - min + 1)) + min):
                    "id" + "_" + (Math.floor(Math.random() * (max - min + 1)) + min);
    } while (document.getElementById(uniqueID) || assignedIDs.has(uniqueID));

    assignedIDs.add(uniqueID);

    return uniqueID;
}

/**
 * Bins data based on config. element's DB column name. Used for preparing histogram data for c3.js from dictionaries.
 * @param data Dictionary of records indexed with arbitrary IDs first and chart element IDs second.
 * @param key Internally used parameter name.
 * @param config
 * @param minNumberOfBins
 * @param maxNumberOfBins
 * @returns Dictionary with bin names and counts.
 */
function binDataCategorically(data, key, config, minNumberOfBins, maxNumberOfBins)
{
    binnedData = [];
    binNames = [];
    binThresholds = [];

    if (config["type"] == "numerical") {
        // Gather all values for attribute and put them into an array.
        let attributeValues = [];
        let distinctAttributeValues = new Set();

        for (let i = 0; i < data.length; i++) {
            let value = config.normalize != null ? config.normalize(data[i][key]) : data[i][key];
            attributeValues.push(value);
            // Add value to set.
            distinctAttributeValues.add(value);
        }
        // Let d3 create a histogram.
        var bins = d3.layout.histogram()  // create layout object
            .bins(Math.max(
                Math.min(maxNumberOfBins, distinctAttributeValues.size), minNumberOfBins
            ))
            .range([config["minValue"], config["maxValue"]])
            (attributeValues);          // group the data into the bins

        // Count elements in bins, remember bin ranges/names.
        for (let i = 0; i < bins.length; i++) {
            binNames.push(
                bins[i].x.toFixed(3) + " - " + (bins[i].x + bins[i].dx).toFixed(3)
            );

            binnedData.push(bins[i].length);
            binThresholds.push({min: bins[i].x, max: (bins[i].x + bins[i].dx)});
        }
    }

    // If categorical variables: Bin by hand.
    else if (config["type"] == "categorical" && config["values"] != null) {
        counts = {};

        for (let i = 0; i < data.length; i++) {
            let value = data[i][key];

            if (value in counts)
                counts[value]++;
            else
                counts[value] = 1;
        }

        // Add values for all possible options to array of binned values, remember bin ranges/names.
        for (let i = 0; i < config["values"].length; i++) {
            if (config["values"][i] in counts) {
                binNames.push(config["values"][i]);
                binnedData.push(counts[config["values"][i]]);
                binThresholds.push({value: config["values"][i]});
            }
            // Append zero if min. number of bins required and not yet instantiated.
            else if (binNames.length < minNumberOfBins) {
                binNames.push(config["values"][i]);
                binnedData.push(0);
                binThresholds.push({value: config["values"][i]});
            }
        }
    }
    else if (config["type"] == "categorical" && config["values"] != null) {
        console.log("############### " + key)
    }

    return {categories: binNames, data: binnedData, thresholds: binThresholds};
}

/**
 * Initializes hyperparameter panel.
 */
function initHyperparameterPanel()
{
    $(document).ready(function() {
        for (var key in chartElements.hyperparameters) {
            let currElement = chartElements.hyperparameters[key];

            if (currElement.histogram != null) {
                // Append new div.
                let labelDOM = null;
                if (currElement.type == "numerical") {
                    currElement.minLabel = uniqueID("minLabel");
                    currElement.maxLabel = uniqueID("maxLabel");
                    labelDOM = "<span class='runopt_histogramMinValueLabel' id='" + currElement.minLabel + "'>MIN</span>" +
                               "<span class='runopt_histogramMaxValueLabel' id='" + currElement.maxLabel + "'>MAX</span>";
                }
                else
                    labelDOM = "";

                currElement.valueLabel = uniqueID("valueLabel");
                valueLabelDOM = "<span class='runopt_histogramValueLabel' id='" + currElement.valueLabel + "'>VALUE</span>";

                $("#hyperparamPane").append(
                    "<div class='runopt_histogramContainer'> " +
                    "   <div class='runopt_histogramContainer_header'>" +
                    "       <span class='runopt_histogramParamLabel'>" + currElement.displayName + "</span>" +
                    valueLabelDOM +
                    "   </div>" +
                    "   <div class='runopt_histogram' id='" + currElement.histogram + "'></div>" +
                    "   <hr class='runopt_histogram_xaxis'> " +
                    "   <div class='runopt_histogramExtremaLabelContainer'> " +
                    labelDOM +
                    "   </div> " +
                    "</div>"
                );
            }
        }
    });
}

/**
 * Finde extrema in specified fields.
 * @param data
 * @param key
 */
function findExtrema(data, key)
{
    let min = null;
    let max = null;

    for (let i = 0; i < data.length; i++) {
        min = min == null || data[i][key] < min ? data[i][key] : min;
        max = max == null || data[i][key] > max ? data[i][key] : max;
    }

    return {min: min, max: max};
}

/**
 * Renders histograms in hyperparameter panel.
 * @param runMetadata
 * @param runName
 * @param currentTSNESequenceNumber Sequence number of t-SNE model w.r.t. it's run.
 * @param currentTSNEIndex
 */
function renderHyperparameterPanel(runMetadata, runName, currentTSNESequenceNumber, currentTSNEIndex)
{
    $(document).ready(function() {
        for (var key in chartElements.hyperparameters) {
            let currElement = chartElements.hyperparameters[key];

            // Bin data.
            let binnedData = binDataCategorically(runMetadata, currElement.attributeNameInDB, currElement, 10, 10);
            binnedData.data.unshift("Count");
            // Find extrema, update extrema labels (if numerical).
            if (currElement.type == "numerical") {
                $("#" + currElement.minLabel).html(currElement.prettify != null ?
                    currElement.prettify(currElement.minValue) : currElement.minValue);
                $("#" + currElement.maxLabel).html(currElement.prettify != null ?
                    currElement.prettify(currElement.maxValue) : currElement.maxValue);
            }
            // If categorical value. show currently selected value.
            let columnKey = currElement.attributeNameInDB;
            let currValue = currElement.type == "numerical" ?
                            runMetadata[currentTSNEIndex][columnKey].toFixed(3) :
                            runMetadata[currentTSNEIndex][columnKey];
            $("#" + currElement.valueLabel).html(currElement.prettify != null ?
                currElement.prettify(currValue) : currValue);

            if (currElement.histogram != null) {
                // Generate chart in new div.
                var chart = c3.generate({
                    bindto: "#" + currElement.histogram,
                    data: {
                        columns: [
                            binnedData.data
                        ],
                        groups: [
                              ['Count']
                        ],
                        colors: {
                            Count: '#3d4a57'
                        },
                        type: 'bar'
                    },
                    bar: {
                        width: {
                            ratio: 1
                        }
                    },
                    legend: {
                        show: false
                    },
                    tooltip: {
                        show: true
                    },
                    axis: {
                        x: {
                            show: false,
                            type: 'category',
                            categories: binnedData.categories
                        },
                        y: {show: false}
                    },
                    size: {
                        width: ($('#hyperparamPane').width() * 0.4)
                    },
                    point: {
                        show: true
                    },
                    // Highlight current value after rendering.
                    onrendered: function () {
                        // Find index of bar containing current attribute value in histogram, highlight with different color.
                        let barIndex = null;
                        let currTSNEAttributeValue = runMetadata[currentTSNEIndex][currElement.attributeNameInDB];
                        for (let i = 0; i < binnedData.thresholds.length; i++) {
                            if (
                                (
                                    currElement.type == "numerical" &&
                                    currTSNEAttributeValue >= binnedData.thresholds[i].min &&
                                    currTSNEAttributeValue <= binnedData.thresholds[i].max
                                ) ||
                                (
                                    currElement.type == "categorical" &&
                                    currTSNEAttributeValue == binnedData.thresholds[i].value
                                )
                            ) {
                                // Color currently selected bar.
                                let currentBar = d3.select("#" + currElement["histogram"] +  " .c3-shape-" + i);
                                currentBar.style("fill", "#ed5565");
                                break;
                            }
                        }
                    }
                });
            }
        }
    });
}

/**
 * Renders line chart in quality metrics panel.
 * Assumes exactly one run in the data and that models are ordered by sequence number ascendingly.
 * @param runMetadata
 * @param runName
 * @param currentTSNESequenceNumber
 * @param currentTSNEIndex
 */
function renderQualityMetricsPane(runMetadata, runName, currentTSNESequenceNumber, currentTSNEIndex)
{
    // Store metric data by measures first, run title second. Actual values are stored in array (same
    // sequence as the order in which t-SNE models were generated).
    let measures = {};
    measures.trustworthiness = ["Trustworthiness"];
    measures.continuity = ["Continuity"];
    measures.generalization = ["Generalization accuracy"];
    measures.we_information_ratio = ["WE information ratio"];
    measures.user_quality_score = ["User quality score"];

    let categories = [];
    // Collect metrics.
    for (let i = 0; i < runMetadata.length; i++) {
        let currMetrics = runMetadata[i];
        console.log(i);

        // Make sure we have quality metrics for this object.
        if (currMetrics.measure_trustworthiness != null &&
            currMetrics.measure_continuity != null &&
            currMetrics.measure_generalization_accuracy != null &&
            currMetrics.measure_word_embedding_information_ratio != null &&
            currMetrics.measure_user_quality != null) {
                // Append quality metrics.
                measures.trustworthiness.push(currMetrics.measure_trustworthiness);
                measures.continuity.push(currMetrics.measure_continuity);
                measures.generalization.push(currMetrics.measure_generalization_accuracy);
                measures.we_information_ratio.push(currMetrics.measure_word_embedding_information_ratio);
                measures.user_quality_score.push(currMetrics.measure_user_quality);
        }
        // Append category.
        categories.push("Model #" + (i + 1));
    }

    // Generate quality metrics line chart.
    var chart = c3.generate({
        bindto: "#qualityMetricsLinechart",
        data: {
            columns: [
                measures.trustworthiness,
                measures.continuity,
                measures.generalization,
                measures.we_information_ratio,
                measures.user_quality_score
            ],
            colors: {
            },
            type: 'step'
        },
        legend: {
            show: true,
            position: 'right'
        },
        tooltip: {
            show: true
        },
        axis: {
            x: {
                show: true,
                tick: {
                    count: 4
                },
                type: 'category',
                categories: categories
            },
            y: {
                show: true,
                max: 2,
                min: 0,
                type: 'number',
                tick: {
                    values: [0, 1]
                }
            }
        },
        size: {
            width: ($('#qualityMetricsLinechart').width()) * 0.95,
            height: ($('#qualityMetricsLinechart').height()) * 0.92
        },
        point: {
            show: true
        }
    });
}

/**
 * From https://github.com/masayuki0812/c3/blob/master/src/tooltip.js#L27:
 * Change tooltip in order for it to reflect the word placed at this coordinate.
 */
function tooltip_contents(d, defaultTitleFormat, defaultValueFormat, color)
{
    var $$ = this, config = $$.config, CLASS = $$.CLASS,
        titleFormat = config.tooltip_format_title || defaultTitleFormat,
        nameFormat = config.tooltip_format_name || function (name) { return name; },
        valueFormat = config.tooltip_format_value || defaultValueFormat,
        text, i, title, value, name, bgcolor;

    for (i = 0; i < d.length; i++) {
        if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

        if (! text) {
            title = window.CURRENT_TSNE_DATA_LOOKUP[d[0].index].word;
            text = "<table class='" + CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
        }

        name = nameFormat(d[i].name);
        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

        text += "<tr class='" + CLASS.tooltipName + "-" + d[i].id + "'>";
        text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + "Cluster" + "</td>";
        text += "<td class='value'>" + window.CURRENT_TSNE_DATA_LOOKUP[d[0].index].clusterID + "</td>";
        text += "</tr>";
    }

    return text + "</table>";
}

/**
 * Renders map with word coordinates in low-dim. space.
 * Note: Currently assuming 2D target. Not yet generalized to arbitrary number of dimensions (desirable?).
 * @param tsneData
 * @param numWordsToShow
 */
function renderMap(tsneData, numWordsToShow)
{
    // Make t-SNE coordinates globally available (bad practice, but necessary with c3.js.
    window.CURRENT_TSNE_DATA_LOOKUP = [];

    // Define color spectrum for point-cluster association.
    var colors = ["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"];

    // Gather data.
    let clusterIDs = new Set();
    let word_coordinates_x = ["x"];
    let word_coordinates_y = ["y"];
    let wordCount = 0;

    for (word in tsneData) {
        // Cancel loop if max. number of words is reached.
        if (numWordsToShow != null && wordCount++ >= numWordsToShow)
            break;

        // New cluster? Create new list.
        if (!(tsneData[word].cluster_id) in clusterIDs) {
            clusterIDs.add(tsneData[word].cluster_id);
        }

        word_coordinates_x.push(tsneData[word].values[0]);
        word_coordinates_y.push(tsneData[word].values[1]);
        // Store index word for later access by tooltip.
        window.CURRENT_TSNE_DATA_LOOKUP.push({word: word, clusterID: tsneData[word].cluster_id});
    }

    $(document).ready(function() {
        window.MAP_CHART = c3.generate({
            bindto: "#runopt_wvScatterplot",
            data: {
                xs: {
                    y: "x"
                },
                // iris data from R
                columns: [
                    word_coordinates_x,
                    word_coordinates_y
                ],
                type: 'scatter',
                // https://github.com/c3js/c3/issues/547
                xSort: false
            },
            point: {
                r: function (d) {
                    if (window.SEARCH_TERM == null)
                        return 2.5;
                    else if(window.SEARCH_TERM != window.CURRENT_TSNE_DATA_LOOKUP[d.index].word)
                        return 1.75;
                    else
                        return 20;
                }
            },
            axis: {
                x: {
                    show: false,
                    tick: {
                        fit: false
                    }
                },
                y: {
                    show: false,
                }
            },
            size: {
                width: ($('#runopt_wvScatterplot').width()) * 1,
                height: ($('#runopt_wvScatterplot').height()) * 1
            },
            legend: {
                show: false
            },
            tooltip: {
                show: true,
                contents: tooltip_contents
            },
            zoom: {
                enabled: true,
                rescale: true,
                onzoom: function (domain) {
                    // do something with domain, which is the domain after zoomed
//                    console.log(domain);
                }
            },
            color: function(color, d){ return "#ccc"; },
            onrendered: function () {
                // Color points by their cluster ID.
//                d3.selectAll("#runopt_wvScatterplot circle").style("fill",
//                    function(d) {
//                        let currClusterID = window.CURRENT_TSNE_DATA_LOOKUP[d.index].clusterID;
//                        return d3.rgb(colors[currClusterID % colors.length]);
//                    }
//                );
            }
        });
    });
}

/**
 * Gathers necessary UI data and instructs server to proceed with optimization.
 */
function proceedWithOptimization()
{
    // Gather values from UI.
    let parameters = {};
    parameters.modelQuality = $("#runopt_qualitySlider").data("ionRangeSlider")["result"]["from"];
    parameters.numIterations = $("#runopt_qualityEvaluationBox_stepper").val();
    parameters.runName = window.RUN_METADATA.title;
    parameters.datasetName = window.RUN_METADATA.dataset;
    parameters.numWordsToUse = window.RUN_METADATA.num_words;

    // Update progress indicator.
    $("#optimization_progressLabel").html("Optimizing | 0%");
    $("#optimization_status").progressbar({value: 0});
    $("#optimization_status").css({'display': 'block'});
    $("#optimization_status .ui-progressbar-value").css({'background': '#3d4a57'});

    // Check progress in DB regularly (every 10 seconds).
    var progressCheckID = setInterval(function() {
        let targetIterationNumber = window.RUN_METADATA.runs_sequence_number + parseInt(parameters.numIterations);

        // Check how many t-SNE models were already produced.
        $.ajax({
            type: 'GET',
            url: '/get_latest_tnse_model_sequence_number_in_run',
            // applicationType/json leads to bad server response for some reason, so let's use common GET args.
            data: {
                run_title: parameters.runName
            },
            success: function(response) {
                let percentage = (
                    (response - window.RUN_METADATA.runs_sequence_number) /
                    (targetIterationNumber - window.RUN_METADATA.runs_sequence_number)
                ) * 100;

                $("#optimization_status").progressbar({value: percentage});
                $("#optimization_progressLabel").html("Optimizing | " + percentage.toFixed(0) + "%");

                // If target iteration number reached: Update UI, stop progress listener.
                if (response == targetIterationNumber) {
                    // Update progress bar.
                    $("#upload_status").progressbar({value: 100});
                    // Stop progress check.
                    clearInterval(progressCheckID);

                    // Re-render charts in dashboard.
                    renderRunData(parameters.runName, $("#runopt_showNumberOfWordsSlider").data("ionRangeSlider")["result"]["from"]);
                    $("#optimization_status").css({'display': 'none'});
                }
            }
        });
    }, 10000);

    // Instruct server with next optimization step.
    $.ajax({
        type: "POST",
        url: "/proceed_with_optimization",
        data: JSON.stringify(parameters),
        contentType: "application/json",
        success: function(response) {
        }
    });
}

/**
 * Initializes query field.
 */
function initQueryField()
{
    $("#queryFieldInput").on('change', function() {
        window.SEARCH_TERM = $("#queryFieldInput").val();

        // 1. Reset all points' radius.
        d3.selectAll("#runopt_wvScatterplot circle").attr("r", 1.75);

        for (let i = 0; i < window.CURRENT_TSNE_DATA_LOOKUP.length; i++) {
            if (window.SEARCH_TERM == window.CURRENT_TSNE_DATA_LOOKUP[i].word) {
                // 2. Increase radius of looked for point.
                d3.select("#runopt_wvScatterplot .c3-circle-" + i).attr("r", 20);
                // 3. Reset zoom (Alt. to jumping to target in scatterplot).
                window.MAP_CHART.unzoom();
//                d3.select("#runopt_wvScatterplot svg")
//                    .attr("transform", "translate(240,240)");

                // Interrupt further search on success.
                return;
            }
        }

        // Reset to normal size if no term was found.
        d3.selectAll("#runopt_wvScatterplot circle").attr("r", 2.5);
        window_SEARCH_TERM = null;
    });
}

/**
 * Initializes quality pane.
 */
function initQualityPane()
{
}

/**
 * Initializes quality evaluation box.
 */
function initQualityEvaluationBox()
{
    let calculatedQuality = 0.5;

    // Initialize slider for regulating number of words to show.
    $("#runopt_showNumberOfWordsSlider").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 1,
        max: 10000,
        from: 1000,
        type: 'single',
        step: 10,
        grid: true,
        grid_num: 3,
        // Render map with specified number of words.
        onFinish: function (data) {
            renderMap(window.TSNE_RESULTS, data.from);
        }
    });

    // Initialize quality evaluation slider.
    $("#runopt_qualitySlider").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 1,
        from: calculatedQuality,
        type: 'single',
        step: 0.01,
        grid: true,
        grid_num: 3,
        // Define hooks to steppers.
        onChange: function (data) {
            // Fetch corresponding stepper element.
        }
    });

    // Initialize hover listener.
    $("#qualityEvaluationBox").mouseenter(function() {
        $("#qualityEvaluationBox").animate({
            width: "300px",
            height: "265px",
        }, 50, function() {});
    });
    // Initialize leave listener.
    $("#qualityEvaluationBox").mouseleave(function() {
        $("#qualityEvaluationBox").animate({
            width: "200px",
            height: "25px",
        }, 50, function() {});
    });
}

/**
 * Load run in dashboard.
 */
function loadRun()
{
    // Fetch names of run to load.
    let datasetName = $("#runopt_datasetSelect").val();
    let runName = $("#runopt_runSelect").val();

    // Close popup.
    $("#runopt_dialog").dialog("close");
    // Set dataset name in quality evaluation box.
    $("#qualityEvaluationBox_datasetName").html(datasetName);

    renderRunData(runName, 1000);
}

/**
 * Auxiliary function for loading specified target/run and renders dashboard with loaded data.
 * @param runName
 * @param numberOfWordsToDisplayInMap
 */
function renderRunData(runName, numberOfWordsToDisplayInMap)
{
    // 1. Load quality measure & hyperparameters for this and other runs.
    $.ajax({
        type: 'GET',
        url: '/fetch_model_metadata_in_runs_in_dataset',
        // applicationType/json leads to bad server response for some reason, so let's use common GET args.
        data: {
            run_title: runName
        },
        success: function(response) {
            var metadataResponse = response;

            // Find highest sequence t-SNE model index for current run.
            var currentTSNESequenceNumber = -1;
            // Find index at which current t-SNE model can be found in response dataset.
            var currentTSNEIndex = -1;
            for (let i = 0; i < metadataResponse.length; i++) {
                console.log(metadataResponse[i].runs_sequence_number);
                if (metadataResponse[i].title == runName &&
                    currentTSNESequenceNumber < metadataResponse[i].runs_sequence_number) {
                    currentTSNESequenceNumber =  metadataResponse[i].runs_sequence_number;
                    currentTSNEIndex = i;
                }
            }
            // Store current run metadata.
            window.RUN_METADATA = metadataResponse[currentTSNEIndex];

            // Set current t-SNE-model's sequence number in run.
            $("#qualityEvaluationBox_runIteration").html(window.RUN_METADATA.title + "#" + currentTSNESequenceNumber + "@");
            // Update slider for number of words.
            $("#runopt_showNumberOfWordsSlider").data("ionRangeSlider").update({
                max: metadataResponse[currentTSNEIndex].num_words
            });

            // 2. Load results for latest t-SNE model in run.
            $.ajax({
                type: 'GET',
                url: '/fetch_latest_tsne_results_for_run',
                // applicationType/json leads to bad server response for some reason, so let's use common GET args.
                data: {
                    run_title: runName
                },
                success: function(response) {
                    window.TSNE_RESULTS = JSON.parse(response);

                    $("#runopt_qualitySlider").data("ionRangeSlider").update({
                        from: metadataResponse[currentTSNEIndex].measure_user_quality
                    });

                    // Show dashboard.
                    $("#dashboard").css("display", "block");
                    // Render hyperparameter histograms.
                    renderHyperparameterPanel(metadataResponse, runName, currentTSNESequenceNumber, currentTSNEIndex);
                    // Render quality metrics pane.
                    renderQualityMetricsPane(metadataResponse, runName, currentTSNESequenceNumber, currentTSNEIndex);
                    // Render map for word coordinates.
                    renderMap(window.TSNE_RESULTS, numberOfWordsToDisplayInMap);
                }
            });
        }
    });
}

/**
 * Initialize dashboard content.
 */
function initDashboard()
{
    $.ajax({
        url: '/dashboard_content',
        type: 'GET',
        success: function(html_data) {
            $("#dashboard").html(html_data);

            // Initialize hyperparameter panel.
            initHyperparameterPanel();

            // Initialize query field.
            initQueryField();

            // Initialize quality evaluation box.
            initQualityEvaluationBox();
        }
    });
}

// Init dashboard.
$(document).ready(function(){
    initDashboard();
});