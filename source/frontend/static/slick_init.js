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

$(document).ready(function(){
    carousel = $('.carousel');

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
});

