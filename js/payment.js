var paymentOrder={choiceBank:function(){$("#frm_payment_order #payment_atm .bank-list .bank").click(function(){var e=$(this).data("id"),a=$(this).data("name");$("#frm_payment_order #payment_atm .bank-list .bank").removeClass("active"),$(this).addClass("active"),$("#frm_payment_order #payment_atm #bank_name").text(a),$("#frm_payment_order input[name='bank']").val(e)})},choiceVisa:function(){$("#frm_payment_order #payment_visa .bank-list .bank").click(function(){var e=$(this).data("id"),a=$(this).data("name");$("#frm_payment_order #payment_visa .bank-list .bank").removeClass("active"),$(this).addClass("active"),$("#frm_payment_order #payment_visa #bank_name").text(a),$("#frm_payment_order input[name='bank']").val(e)})},submitData:function(e){$.ajax({url:$("#frm_payment_order").attr("action"),type:"POST",data:e,async:!1,cache:!1,contentType:!1,processData:!1,dataType:"json",success:function(e){if(0==e.error){if(e.redirect&&(window.location.href=e.redirect),"00"===e.data_return.code)return window.vnpay?vnpay.open({width:480,height:600,url:e.data_return.data}):window.location.href=e.data_return.data,!1;Vnit.showBootbox(e.data_return.message)}else e.redirect&&(window.location.href=e.redirect),e.message&&(Vnit.showBootbox(e.message),$("#frm_payment_order .btn_checkout").html("Thanh toán"),paymentOrder.enableCheckout())},error:function(e,a,t){paymentOrder.enableCheckout(),console.log(t+"\r\n"+e.statusText+"\r\n"+e.responseText)}})},disableCheckout:function(){$("#frm_payment_order .btn_checkout").each(function(){$(this).prop("disabled",!0)})},enableCheckout:function(){$("#frm_payment_order .btn_checkout").each(function(){$(this).prop("disabled",!1)})}};$(document).ready(function(){$("#frm_payment_order .agree").click(function(){$("#frm_payment_order .agree").prop("checked",!1),$("#myModal_terms_conditions").modal("show")}),$(document).on("click","#myModal_terms_conditions #check_ok",function(){$("#frm_payment_order .agree").prop("checked",!0),$("#myModal_terms_conditions").modal("hide"),$("#frm_payment_order").data("bootstrapValidator").revalidateField("agree")}),$("#frm_payment_order .payment-methods a").click(function(){$("#frm_payment_order input[name='payment_method']").val($(this).data("method")),"vnpay"==$(this).data("method")?$("#frm_payment_order input[name='bank']").val("VNPAYQR"):($("#frm_payment_order input[name='bank']").val(""),$(".bank-list .bank").removeClass("active"),"visa"==$(this).data("method")?$("#frm_payment_order #bank_name").text("Vui lòng chọn loại thẻ"):"banking"==$(this).data("method")&&$("#frm_payment_order #bank_name").text("Vui lòng chọn ngân hàng để thanh toán"))}),$("#frm_payment_order").bootstrapValidator({excluded:":disabled",fields:{agree:{validators:{notEmpty:{message:"Bạn phải đồng ý với Điều khoản & điều kiện"}}}}}).on("success.form.bv",function(e){e.preventDefault();var a=new FormData($("#frm_payment_order")[0]);paymentOrder.disableCheckout(),$("#frm_payment_order .btn_checkout").html('<i class="fa fa-spinner fa-spin"></i> Đang xử lý thanh toán');var t=$("#frm_payment_order input[name='payment_method']").val(),n=$("#frm_payment_order input[name='bank']").val();if("banking"==t||"visa"==t){if(""==n)return"banking"==t?Vnit.showBootbox("Vui lòng chọn ngân hàng để thanh toán"):"visa"==t&&Vnit.showBootbox("Vui lòng chọn loại thẻ"),$("#frm_payment_order .btn_checkout").html("Thanh toán"),paymentOrder.enableCheckout(),!1;paymentOrder.submitData(a)}else paymentOrder.submitData(a);return!1})});