// Remember assigned IDs.
var assignedIDs = new Set();

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

// UI elements in page for running optimization. Parameter names are used as keys on leaf-level.
// Hyperparameter pane.
chartElements.hyperparameters = {
    numDimensions: {
        displayName: "Number of dimensions",
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
        attributeNameInDB: "learnin_rate",
        minValue: 1,
        maxValue: 5000,
        values: null,
        type: "numerical",
        histogram: uniqueID("histogram"),
        label: uniqueID("label")
    },

    numIterations: {
        displayName: "Number of iterations",
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
 * Initializes hyperparameter panel.
 */
function initHyperparameterPanel()
{
    $(document).ready(function() {
        for (var key in chartElements.hyperparameters) {
            let currElement = chartElements.hyperparameters[key];

            if (currElement.histogram != null) {
                // Append new div.
                $("#hyperparamPane").append(
                    "<div class='runopt_histogramContainer'> " +
                    "   <div class='runopt_histogramContainer_header'>" +
                    "       <span class='runopt_histogramParamLabel'>" + currElement.displayName + "</span>" +
                    "       <span class='runopt_histogramValueLabel'>" + "234"+ "</span>" +
                    "   </div>" +
                    "   <div class='runopt_histogram' id='" + currElement.histogram + "'></div>" +
                    "   <div class='runopt_histogramExtremaLabelContainer'> " +
                    "       <span class='runopt_histogramMinValueLabel'>MIN</span>" +
                    "       <span class='runopt_histogramMaxValueLabel'>MAX</span>" +
                    "   </div> " +
                    "</div>");

                // Generate chart in new div.
                var chart = c3.generate({
                    bindto: "#" + currElement.histogram,
                    data: {
                        x: 'x',
                        columns: [
                            ["x", "cat1", "cat2", "cat3", "cat4", "cat5"],
                            ["data", 1, 2, 3, 4, 5],
                        ],
                        groups: [
                              ['data']
                        ],
                        colors: {
                            data: '#3d4a57'
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
                                type: 'category'
                            },
                            y: {show: false}
                    },
                    size: {
                        width: ($('#hyperparamPane').width() * 0.4)
                    },
                    point: {
                        show: true
                    }
                });
            }
        }
    });
}

/**
 * Initializes query field.
 */
function initQueryField()
{

}

/**
 * Initializes quality pane.
 */
function initQualityPane()
{
    $(document).ready(function() {
        // Generate quality metrics line chart.
        var chart = c3.generate({
            bindto: "#qualityMetricsLinechart",
            data: {
                columns: [
                    ["Trustworthiness", 0.1, 0.2, 0.3, 0.4, 0.5],
                    ["Continuity", 0.5, 0.4, 0.3, 0.2, 0.1],
                    ["Generalization accuracy", 0.4, 0.5, 0.2, 0.3, 0.1],
                    ["WE information ratio", 0.5, 0.2, 0.1, 0.3, 0.4]
                ],
                colors: {
                    Trustworthiness: "#ccc"
                },
                type: 'line'
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
                    }
                },
                y: {
                    show: true,
                    max: 1,
                    min: 0,
                    type: 'number',
                    tick: {
                        values: [0, 1]
                    }
                }
            },
            size: {
                width: ($('#qualityPane').width()) * 1,
                height: ($('#qualityPane').height()) * 0.92
            },
            point: {
                show: false
            }
        });
    });
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
        min: 0,
        max: 10000,
        from: 1000,
        type: 'single',
        step: 10,
        grid: true,
        grid_num: 3,
        // Define hooks to steppers.
        onChange: function (data) {
            // Fetch corresponding stepper element.
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
        step: 0.1,
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
        }, 100, function() {});
    });
    // Initialize leave listener.
    $("#qualityEvaluationBox").mouseleave(function() {
        $("#qualityEvaluationBox").animate({
            width: "150px",
            height: "25px",
        }, 100, function() {});
    });
}

/**
 * Initialize scatterplot for display of low-dim. word vectors.
 */
function initMap()
{
    $(document).ready(function() {
        var chart = c3.generate({
            bindto: "#runopt_wvScatterplot",
            data: {
                xs: {
                    setosa: 'setosa_x',
                    versicolor: 'versicolor_x',
                },
                // iris data from R
                columns: [
                    ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
                    ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
                    ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                    ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                ],
                type: 'scatter'
            },
            axis: {
                x: {
                    show: false,
                    label: 'Sepal.Width',
                    tick: {
                        fit: false
                    }
                },
                y: {
                    show: false,
                    label: 'Petal.Width'
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
                show: true
            },
            zoom: {
                enabled: true
            }
        });
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

            // Initialize quality pane.
            initQualityPane();

            // Initialize map.
            initMap();
        }
    });
}

// Init dashboard.
$(document).ready(function(){
    initDashboard();
});