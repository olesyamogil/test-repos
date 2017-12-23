
$(document).ready(function(){

    var o = {};
    for (var itemCount = 0; itemCount < 5; itemCount++) {
        o[itemCount * 250] = {
            items: itemCount
        };
    }
    $("#owl-1").owlCarousel({
        items:4,
        loop:true,
        nav:false,
        dots:false,
        // margin:10,
        autoplay: true,
        responsive: o
    });
    $('#home').click(function () {
        $('html, body').animate({
            scrollTop: $('header').offset().top
        }, 1000);

    })
});
