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
                        columns: [
                            ["data", 1, 2, 3, 4, 5, 6, 7]
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
                        show: false
                    },
                    axis: {
                            x: {show: false},
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
        }
    });
}

// Init dashboard.
$(document).ready(function(){
    initDashboard();
});