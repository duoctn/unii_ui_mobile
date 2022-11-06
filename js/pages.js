let gl_lFT = false;
let pageHome = {
    reBuildPage: function () {
        let wPage = $('.grid-page').eq(0).width();
        let wCol = wPage / 3;
        $(".other-small-image").each(function () {
            $(this).find('img').css({'height': (wCol)})
        })
    },
    loadImagePage: function () {
        $('.img-page').click(function () {
            let elmId = $(this).data('id');
            let elmItem = $(this).closest('.list-image');
            let image_list = [];
            elmItem.find('.img-page').each(function () {
                image_list.push({'img': $(this).data('img'), 'thumb': $(this).data('thumb'), 'caption' : $(this).data('caption')});
            })
            pageHome.loadGallery(image_list, elmId);
        });
    },
    loadGallery: function (imageList, current = 0) {
        if (gl_lFT) {
            let $fotoramaDiv = $('.fotorama').on('fotorama:ready ' +           // Fotorama is fully ready
                'fotorama:show ' +            // Start of transition to the new frame
                'fotorama:showend ' +         // End of the show transition
                'fotorama:load ' +            // Stage image of some frame is loaded
                'fotorama:error ' +           // Stage image of some frame is broken
                'fotorama:startautoplay ' +   // Slideshow is started
                'fotorama:stopautoplay ' +    // Slideshow is stopped
                'fotorama:fullscreenenter ' + // Fotorama is fullscreened
                'fotorama:fullscreenexit ' +  // Fotorama is unfullscreened
                'fotorama:loadvideo ' +       // Video iframe is loaded
                'fotorama:unloadvideo',       // Video iframe is removed
                function (e, fotorama, extra) {
                    if (e.type == 'fotorama:fullscreenexit') {
                        fotorama.destroy();
                    }
//                        console.log('## ' + e.type);
//                        console.log('active frame', fotorama.activeFrame);
//                        console.log('additional data', extra);
                }
            ).fotorama({
                click: false,
                allowfullscreen: true
            });
            let fotorama = $fotoramaDiv.data('fotorama');
            fotorama.load(imageList);
            fotorama.show(current);
            fotorama.requestFullScreen();
        } else {
            $.getScript(base_url + "desktop/js/fotorama.js").done(function () {
                gl_lFT = !0;
                pageHome.loadGallery(imageList, current);
            })
        }
    },
    Init: function () {
        Vnit.showMoreText('.show-text');
        pageHome.reBuildPage();
        pageHome.loadImagePage();
    }
}


$(document).ready(function () {
    pageHome.Init();
})