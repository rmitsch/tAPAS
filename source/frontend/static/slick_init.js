menuIDs = ["menu_upload", "menu_createrun", "menu_run", "menu_about"]

function updateCarousel(menuItemID)
{
    for(var i = 0; i < menuIDs.length; i++) {
        document.getElementById(menuIDs[i]).classList.remove('pure-menu-selected');
    }

    // Set selected class for currently selected menu item.
    document.getElementById(menuItemID).classList.add('pure-menu-selected');

    // Move carousel to panel of selected item.
    $('.carousel').slick('slickGoTo', menuIDs.indexOf(menuItemID));
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
        fade: false,
        swipe: true,
        infinite: true,
        speed: 200
    });

    // Always init with "About" as selected menu point.
    document.getElementById("menu_about").classList.add('pure-menu-selected');

    // Move carousel to panel 'About'.
    $('.carousel').slick('slickGoTo', menuIDs.indexOf("menu_about"));

    // Change navigation when slide changes via carousel.
    $('.carousel').on('beforeChange', function(event, slick, currentSlideIndex, nextSlideIndex) {
        window.location.hash = menuIDs[nextSlideIndex];
        updateCarousel(menuIDs[nextSlideIndex]);
    });

//    CONTINUE HERE:
//        - Add selected class if selected; join menu and carousel navigation, finetune.
//        - Add forms for t-SNE runs.
//        - Implement layout for dashboard.

});

