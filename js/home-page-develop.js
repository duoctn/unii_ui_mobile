var Home = {
    dealHome : function(){
        $.ajax({
            url: base_url + 'home/deal',
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $(".deal-content").html(json.html);
                $("#pagination-deal").html(json.pagination);
                Vnit.getListPriceEbay(json.ebay_object_key);
                Vnit.getListPrice(json.amazon_object_key);
                $("img.lazyload").lazyload();
                Home.countDown();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    countDown : function(){
        $(".time-unit-m").each(function(idx,ele){
            var $that      = $(ele);
            var timeEnd    = $that.data('time-end');
            var $h         = $that.find('.h');
            var $m         = $that.find('.m');
            var $s         = $that.find('.s');
            var totalHours = 0;

            $that.countdown(timeEnd, function(event) {
                totalHours = event.offset.totalDays * 24 + event.offset.hours;

                $h.text(totalHours);
                $m.text(event.strftime('%M'));
                $s.text(event.strftime('%S'));
            });
        });
    },

    Init : function(){
        Home.dealHome();
        $("#pagination-deal").on('click','.pagination a',function () {
            if(!$(this).parent().hasClass('active')){
                scrollToDiv('.deal_now');
                var href = $(this).attr('href');
                $.ajax({
                    url: href,
                    type: 'get',
                    dataType: 'json',
                    success: function (json) {
                        $(".deal-content").html(json.html);
                        $("#pagination-deal").html(json.pagination);
                        Vnit.getListPriceEbay(json.ebay_object_key);
                        Vnit.getListPrice(json.amazon_object_key);
                        $("img.lazyload").lazyload();
                        Home.countDown();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            }
            return false;
        })
        new Swiper(".swiper-container", {
            paginationClickable: true,
            paginationType: 'custom',
            slidesPerView: 1,
            loop:false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    var icon = $("[data-id="+index+"]").data('icon');
                    return '<div class="' + className + '"><span class="round-item bg_'+index+'"><i class="fa ' + icon + '" aria-hidden="true"></i></span></div>';
                },
            }
        });
    },


}
$(document).ready(function () {
    Home.Init();
})