let urlPage = $('[name=url]').attr('content');
var Deluxe = {
    categoryFilter: function () {
        $('body').on('click', '#btn-action-filter', function () {
            Vnit.loading();
            let param = '';
            $('.item-sub-cat').each(function () {
                param_group = $(this).data('name');
                param_value = '';
                $(this).find('input.filter').each(function () {
                    if ($(this).is(':checked')) {
                        param_value += $(this).data('name') + ',';
                    }
                });
                param_value = trim(param_value, ',');
                if (param_value != '') {
                    param += param_group + '=' + param_value + '&';
                }

            });
            param = trim(param, '&');
            if (param != '') {
                window.location.href = urlPage + '?' + param;
            } else {
                window.location.href = urlPage;
            }
        })
    },
    showMore: function () {
        $('body').on('click', '.show_more', function () {
            let elmId = $(this).data('id');
            console.log(elmId);
            if ($(this).attr('data-show') == 'hidden_') {
                $("[data-name=" + elmId+']').find('li.filter-item').removeClass('hide');
                $(this).attr('data-show','show_');
                $(this).text('Thu gọn');
            } else {
                $("[data-name=" + elmId+']').find('li.filter-item').addClass('hide');
                $(this).attr('data-show','hidden_');
                $(this).text('Xem thêm');
            }
        });
    },
    Init: function () {
        Deluxe.categoryFilter();
        Deluxe.showMore();
        $("#loading-more").click(function () {
            Vnit.loading();
        })
        $(document).on('click', "#close-zone-fix, .zone-fix .heading .arrow", function(){
            $(".zone-fix").removeClass('is_show');
        });
        $(document).on('click', ".open-zone-fix", function(){
            $(".zone-fix").addClass('is_show');
        });
    }
}
$(document).ready(function () {
    Deluxe.Init();
})