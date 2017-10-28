menuIDs = ["menu_about", "menu_upload", "menu_createrun", "menu_run"]

function updateCarousel(menuItemID)
{
    for(var i = 0; i < menuIDs.length; i++) {
        document.getElementById(menuIDs[i]).classList.remove('pure-menu-selected');
    }
    //document.getElementById(menuIDs.indexOf(menuItemID))).classList.add('pure-menu-selected');

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
        infinite: false
    });

    for(var i = 0; i < menuIDs.length; i++) {
        document.getElementById("menu_" + entrypoint).classList.remove('pure-menu-selected');
    }
    CONTINUE HERE:
        - Add selected class if selected; join menu and carousel navigation, finetune.
        - Add forms for t-SNE runs.
        - Implement layout for dashboard.
    NOTE: Use same approach/framework for PAELLA!
    document.getElementById("menu_" + window.location.hash).classList.add('pure-menu-selected');

    //alert(window.location.hash);
});

