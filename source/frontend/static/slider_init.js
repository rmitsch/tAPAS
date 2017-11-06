$(function ()
{
    for(var i = 1; i <= 12; i++) {
        $("#slider" + i).ionRangeSlider({
            hide_min_max: true,
            keyboard: true,
            min: 0,
            max: 5000,
            from: 1000,
            to: 4000,
            type: 'single',
            step: 1,
            grid: true,
            prettify_enabled: true,
            hide_min_max: true,
            hide_from_to: true,
            grid_num: 3
        });
    }
});

