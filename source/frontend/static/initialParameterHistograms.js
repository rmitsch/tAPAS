/**
 * Draw histograms for distribution of parameters and weights on page for creation of new runs.
 */
$(document).ready(function(){
    for(var i = 1; i < 18; i++) {
        var chart = c3.generate({
            bindto: '#nrph' + i,
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
});