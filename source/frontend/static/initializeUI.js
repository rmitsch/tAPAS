menuIDs = ["menu_start", "menu_upload", "menu_createrun", "menu_run"]

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


function initSliders()
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

function initInitialParameterHistograms()
{
    for(var i = 1; i < 17; i++) {
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

    // Initialize "Fix value" toggle buttons.
    for(var i = 1; i < 11; i++) {
        $('#fixValueCheck' + i).lc_switch();
    }
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
        }
    });
});