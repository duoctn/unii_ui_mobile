$(function () {
    let owl;
    let image_active = 0;
    $.getScript(base_url + "mobile/js/owl.carousel.js").done(function () {
        owl = $("#banner").owlCarousel({
            autoPlay: 5000,
            margin: 0,
            nav: true,
            dots: false,
            lazyLoad: true,

            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            stopOnHover: true,
            scrollPerPage: true,
            responsive: {
                0: {
                    items: 4,
                    slideBy: 4,
                },
                768: {
                    items: 7,
                    slideBy: 7,
                },
                1024: {
                    items: 5,
                    slideBy: 5,
                }
            }
        });
    });
    $('body').on('click',"#banner .item", function(){
        if(!$(this).hasClass('active_')){
            let img = $(this).data('img');
            $("#banner .item").removeClass('active_');
            $(this).addClass('active_');
            $(".main-image").append('<div style="opacity: 0" class="inner-image"><div class="zone-item"><img src="'+img+'" class="img-fluid"></div></div>');
            $(".main-image .inner-image").eq(0).animate({opacity: 0}, 500, function() {
                $(".main-image .inner-image").eq(0).remove();
            });
            $(".main-image .inner-image").eq(1).animate({opacity: 1}, 1000);
            image_active = $(this).data('target');

        }
    });
})