$(document).ready(function () {
    $('body').on('click', '.address_update', function () {
        let id = $(this).data('id');
        $.ajax({
            url: base_url + 'customer/address/ajax/update/' + id,
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $(".item-inner").show();
                $("#address_" + id + " .item-inner").hide();
                $(".zone-update").html('').hide();
                $("#address_" + id + " .zone-update").html(json.html).show();
                $(".checkout-area .shipping_add_address").html('').hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
    $('body').on('click', '.address_delete', function () {
        let id = $(this).data('id');
        bootbox.confirm({
            size: "small",
            message: "Bán có muốn xóa địa chỉ giao hàng này?",
            buttons: {
                confirm: {
                    label: 'Có',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Không',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: base_url + 'customer/address/ajax/delete/' + id,
                        type: 'get',
                        dataType: 'json',
                        success: function (json) {
                            $(".zone-update").html('').hide();
                            $("#address_" + id + " .item-inner").show();
                            window.location.reload();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });
                }
            }
        });
        return false;
    });
    $(document).on('click', ".address_cancel", function () {
        let id = $(this).data('id');
        if (id) {
            $(".zone-update").html('').hide();
            $("#address_" + id + " .item-inner").show();
        } else {
            $(".checkout-area .shipping_add_address").html('').hide();
        }
    });

    $(document).on('change', ".checkout-area select[name=city_id]", function () {
        $.ajax({
            url: base_url + 'customer/address/get-ajax?field=country&id=' + $(this).val(),
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $('select[name="district_id"]').html(json.html);
                $('select[name="ward_id"]').html('<option value="">Chọn Phường xã</option>');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $(document).on('change', ".checkout-area select[name=district_id]", function () {
        $.ajax({
            url: base_url + 'customer/address/get-ajax?field=district&id=' + $(this).val(),
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $('select[name="ward_id"]').html(json.html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $(".checkout-area #add_address").click(function () {
        $.ajax({
            url: base_url + 'customer/address/ajax/create',
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $(".checkout-area .shipping_add_address").html(json.html).show();
                $(".zone-update").html('').hide();
                $(".checkout-area .item-inner").show();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $(document).on('click', ".address_save", function () {
        $("#frm_address").bootstrapValidator({
            excluded: ':disabled',
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng nhập họ tên"
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng nhập số điện thoại"
                        }
                    }
                },
                city_id: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng chọn Tỉnh/Thành phố"
                        }
                    }
                },
                district_id: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng chọn Quận huyện"
                        }
                    }
                },
                ward_id: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng chọn Phường xã"
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {
                            message: "Vui lòng nhập địa chỉ"
                        }
                    }
                }
            }
        }).on('success.form.bv', function (event) {
            event.preventDefault();
            //grab all form data
            let formData = new FormData($("#frm_address")[0]);
            $.ajax({
                url: $("#frm_address").attr("action"),
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (json) {
                    if (json.error == 0) {
                        window.location.reload();
                    } else {
                        Vnit.showBootbox(json.message);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

            return false;
        });
    });
});