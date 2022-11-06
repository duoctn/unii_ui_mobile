var buyNow = {
    shipping_method: function () {
        $(document).on('click', '#buynow .itemShippingService', function () {
            var id = $(this).data('id');
            var name = $(this).data('name');
            $("#buynow .itemShippingService").removeClass('active');
            $(this).addClass('active');
            $(".method-choice span").text(name);
            shipping_method_id = id;
            buyNow.sendShippingMethod(shipping_method_id);
            buyNow.disableCheckout();
        })
    },
    sendShippingMethod: function (shipping_method_id) {
        $.ajax({
            url: base_url + 'buy-now/save-shipping',
            type: 'POST',
            data: {'shipping_method_id': shipping_method_id, 'code': product_code, '_token': _token},
            dataType: 'json',
            success: function (json) {
                buyNow.getTotal();
            },
            error: function (xhr, ajaxOptions, thrownError) {

                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    },
    getTotal: function () {
        $.ajax({
            url: base_url + 'buy-now/total',
            type: 'POST',
            data: {'_token': _token, 'code': product_code},
            dataType: 'json',
            success: function (json) {
                $("#buynow #total").html(json.html);
                buyNow.enableCheckout();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    choiceBank: function () {
        $("#frm_buy_now #payment_atm .bank-list .bank").click(function () {
            var id = $(this).data('id');
            var name = $(this).data('name');
            $("#frm_buy_now #payment_atm .bank-list .bank").removeClass('active');
            $(this).addClass('active');
            $("#frm_buy_now #payment_atm #bank_name").text(name);
            $("#frm_buy_now input[name='bank']").val(id);
        })
    },
    choiceVisa: function () {
        $("#frm_buy_now #payment_visa .bank-list .bank").click(function () {
            var id = $(this).data('id');
            var name = $(this).data('name');
            $("#frm_buy_now #payment_visa .bank-list .bank").removeClass('active');
            $(this).addClass('active');
            $("#frm_buy_now #payment_visa #bank_name").text(name);
            $("#frm_buy_now input[name='bank']").val(id);
        })
    },
    postShipping: function () {
        var shipping_city_id = $("#buynow select[name='shipping_city_id']").val();
        var shipping_district_id = $("#buynow select[name='shipping_district_id']").val();
        var shipping_ward_id = $("#buynow select[name='shipping_ward_id']").val();
        var objectData = {
            'code': product_code,
            '_token': _token,
            'city_id': shipping_city_id,
            'district_id': shipping_district_id,
            'ward_id': shipping_ward_id
        }
        $.ajax({
            url: base_url + 'checkout/shipping-address-buy-now',
            type: 'post',
            dataType: 'json',
            data: objectData,
            success: function (json) {
                buyNow.getShipping();
                buyNow.getTotal();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    getShipping: function () {
        $.ajax({
            url: base_url + 'buy-now/shipping',
            type: 'post',
            dataType: 'json',
            data: {'_token': _token, 'code': product_code},
            success: function (json) {
                $("#buynow #shipping_method").html(json.html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    submitData: function (dataPost) {
        $.ajax({
            url: $("#frm_buy_now").attr("action"),
            type: 'POST',
            data: dataPost,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (json) {
                if (json.error == 0) {
                    if (json.redirect) {
                        window.location.href = json.redirect;
                    }
                    if (json.data_return.code === '00') {
                        if (window.vnpay) {
                            vnpay.open({width: 480, height: 600, url: json.data_return.data});
                        } else {
                            window.location.href = json.data_return.data;
                        }
                        return false;
                    } else {
                        Vnit.showBootbox(json.data_return.message);
                    }

                } else {
                    if (json.redirect) {
                        window.location.href = json.redirect;
                    }
                    if (json.message) {
                        Vnit.showBootbox(json.message);
                        $("#frm_buy_now .btn_checkout").html('Xác nhận đặt hàng');
                        buyNow.enableCheckout();
                    }
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                buyNow.enableCheckout();
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    disableCheckout: function () {
        $("#buynow .btn_checkout").each(function () {
            $(this).prop('disabled', true);
        })
    },
    enableCheckout: function () {
        $("#buynow .btn_checkout").each(function () {
            $(this).prop('disabled', false);
        })
    },
    checkDiscount: function () {
        $("#btn_discount_apply").click(function () {
            var discount_code = $("#discount_code").val();
            if (discount_code == '') {
                Vnit.showBootbox("Vui lòng nhập mã giảm giá");
            } else {
                $.ajax({
                    url: base_url + 'buy-now/discount',
                    type: 'POST',
                    data: {'_token': _token, 'code': $("#discount_code").val(), 'product_code': product_code},
                    dataType: 'json',
                    success: function (json) {
                        if (json.error == 1) {
                            bootbox.alert({
                                size: "small",
                                message: json.message
                            });
                        } else {
                            buyNow.getTotal();
                            $("#frm_buy_now #discount_code").prop('disabled', true);
                            $("#btn_discount_apply").hide();
                            $("#btn_discount_remove").show();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            }
        })
    },
    removeDiscount: function () {
        $(document).on('click', "#btn_discount_remove", function () {
            $.ajax({
                url: base_url + 'buy-now/remove-discount',
                type: 'POST',
                data: {'_token': _token, 'product_code': product_code},
                dataType: 'json',
                success: function (json) {
                    $("#btn_discount_apply").show();
                    $("#btn_discount_remove").hide();
                    $("#frm_buy_now #discount_code").prop('disabled', false);
                    buyNow.getTotal();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        })

    },
    getInsurance: function () {
        $("body").on('click', '#insurance_fee', function () {
            var insurance = ($(this).is(':checked')) ? 1 : 0;
            $.ajax({
                url: base_url + 'buynow/insurance',
                type: 'POST',
                data: {'insurance': insurance, '_token': _token, 'code': product_code},
                dataType: 'json',
                success: function () {
                    window.location.reload();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        })
    },
    init: function () {

        buyNow.getInsurance();
        buyNow.postShipping();
        buyNow.shipping_method();
        $("#buynow .agree").click(function () {
            $("#buynow .agree").prop("checked", false);
            $("#myModal_terms_conditions").modal('show');
        })
        $(document).on('click', '#myModal_terms_conditions #check_ok', function () {
            $("#buynow .agree").prop("checked", true);
            $("#myModal_terms_conditions").modal('hide');
            $('#frm_buy_now').data('bootstrapValidator').revalidateField('agree');
        })


        $("#frm_buy_now input[name='payment_method']").click(function () {
            $("#frm_buy_now .tab-pane").removeClass('active');
            $("#pane-" + $(this).val()).addClass('active');
            $(".form-submit").addClass('active');
            if ($(this).val() == 'vnpay') {
                $("#frm_buy_now input[name='bank']").val('VNPAYQR');
            } else {
                $("#frm_buy_now input[name='bank']").val('');
                $(".bank-list .bank").removeClass('active');
                if ($(this).val() == 'visa') {
                    $("#payment_visa #bank_name").text('Vui lòng chọn loại thẻ');
                } else if ($(this).val() == 'banking') {
                    $("#payment_atm #bank_name").text('Vui lòng chọn ngân hàng để thanh toán');
                }
            }
        });

    }
}



$(document).ready(function () {
    buyNow.init();
    var fields = ['fullname', 'phone', 'address', 'email'];
    var fields_select = ['city_id', 'district_id', 'ward_id'];
    var payment_same_shipping = $('#payment_same_shipping').is(":checked");
    $("#buynow #payment_same_shipping").change(function () {
        payment_same_shipping = $('#payment_same_shipping').is(":checked");
        if (payment_same_shipping) {
            fields.forEach(function (field) {
                $("#buynow input[name='shipping_" + field + "']").prop('disabled', true);
                $("#buynow input[name='shipping_" + field + "']").val($("#buynow input[name='payment_" + field + "']").val());
            })
            fields_select.forEach(function (field) {
                $("#buynow select[name='shipping_" + field + "']").prop('disabled', true);
                $("#buynow select[name='shipping_" + field + "']").html($("#buynow select[name='payment_" + field + "']").html());
                $("#buynow select[name='shipping_" + field + "']").val($("#buynow select[name='payment_" + field + "']").val());
                buyNow.postShipping();
            })
        } else {
            fields.forEach(function (field) {
                $("#buynow input[name='shipping_" + field + "']").prop('disabled', false);
                //$("#buynow input[name='shipping_"+field+"']").val($("#buynow input[name='payment_"+field+"']").val());
            })
            fields_select.forEach(function (field) {
                $("#buynow select[name='shipping_" + field + "']").prop('disabled', false);
                // $("#buynow select[name='shipping_"+field+"']").html($("#buynow select[name='payment_"+field+"']").html());
                // $("#buynow select[name='shipping_"+field+"']").val($("#buynow select[name='payment_"+field+"']").val());
                buyNow.postShipping();
            })
        }
    })
    fields.forEach(function (field) {
        $("#buynow input[name='payment_" + field + "']").keyup(function () {
            if (payment_same_shipping) {
                $("#buynow input[name='shipping_" + field + "']").val($("#buynow input[name='payment_" + field + "']").val());
                $('#frm_buy_now').data('bootstrapValidator').revalidateField('shipping_' + field);
            }
        })
    })
    fields_select.forEach(function (field) {
        $("#buynow select[name='shipping_" + field + "']").change(function () {
            $('#frm_buy_now').data('bootstrapValidator').revalidateField('shipping_' + field);
            buyNow.postShipping();
        })
        $("#buynow select[name='payment_" + field + "']").change(function () {
            if (payment_same_shipping) {
                buyNow.postShipping();
            }
        })
    })

    $("#buynow .city_id").change(function () {
        var type = $(this).data('type');
        if (payment_same_shipping) {
            $("select[name='shipping_city_id']").val($(this).val());
        }
        $.ajax({
            url: base_url + 'customer/address/get-ajax?field=country&id=' + $(this).val(),
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $('#buynow select[name="' + type + '_district_id"]').html(json.html);
                $('#buynow select[name="' + type + '_ward_id"]').html('<option value="">Chọn Phường xã</option>');
                if (payment_same_shipping) {
                    $('#buynow select[name="shipping_district_id"]').html(json.html);
                    $('#buynow select[name="shipping_ward_id"]').html('<option value="">Chọn Phường xã</option>');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    })

    $("#buynow .district_id").change(function () {
        var type = $(this).data('type');
        if (payment_same_shipping) {
            $("#buynow select[name='shipping_district_id']").val($(this).val());
        }
        $.ajax({
            url: base_url + 'customer/address/get-ajax?field=district&id=' + $(this).val(),
            type: 'get',
            dataType: 'json',
            success: function (json) {
                $('select[name="' + type + '_ward_id"]').html(json.html);
                if (payment_same_shipping) {
                    $('select[name="shipping_ward_id"]').html(json.html);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    })
    $("#buynow .ward_id").change(function () {
        if (payment_same_shipping) {
            $("select[name='shipping_ward_id']").val($(this).val());
        }
    })
})