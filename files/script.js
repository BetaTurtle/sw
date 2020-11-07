var firebaseConfig = {
    apiKey: "AIzaSyA89Ry51DT28yrjSGJHGe9-zTYLCZO0zCY",
    authDomain: "hyperlocal-49c9a.firebaseapp.com",
    databaseURL: "https://hyperlocal-49c9a.firebaseio.com",
    projectId: "hyperlocal-49c9a",
    storageBucket: "hyperlocal-49c9a.appspot.com",
    messagingSenderId: "390703634211",
    appId: "1:390703634211:web:8a837a5ce819f761d85e96"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

function imgError(image) {
    image.onerror = "";
    image.src = "images/404.png";
    return true;
}

function makeHTMLfromJSON(data) {
    d = data[0];

    var str = "";
    for (serial in data) {
        d = data[serial];
        // console.log(d);
        // console.log(serial);

        var subs = "";
        d.subs.forEach(el => {

            subs += `<option data-price="` + el["srp"] + `" data-sale="` + el["srp"] + `" data-actual="₹ ` + el["mrp"] + `"
            data-variant="`+ d["itemname"] + ` - ` + el["itemsubname"] + `" data-product_id="` + serial +`" >` + el["itemsubname"] + `</option>`;
        });

        str += `<div class="col-6 col-md-3 product-details" data-product_name="` + d["itemname"] + `" data-category_name="` + d["category"] + `" style="">
      <div class="sc-product-item">
          <div class="card card-poduct d-flex flex-column">
              <div class="product-img-wrapper mx-auto">
                  <a class="fancybox" href="images/`+ serial + `.png"
                      title="`+ d["itemname"] + `">
                      <img loading="lazy" data-name="product_image" src="images/`+ serial + `.png"
                          class="product-img" alt="`+ d["itemname"] + `" title="` + d["itemname"] + `" onerror="imgError(this);">
                  </a>
              </div>
              <div class="product-name">
                  <p class="text-center">`+ d["itemname"] + `</p>
              </div>
              <div class="mt-auto">
                  `+((d.subs.length > 1)?`<div class="variation_wrapper">
                      <div class="form-group">
                          <label>`+d["unit"]+`</label>
                          <select class="form-control variation">
                              `+ subs + `
                          </select>
                      </div>
                  </div>`:"")+
                  `<div class="product-price text-center" style="margin-bottom: 5px">
                      <span>
                      <del class="actual_price" id="product_actual_price`+ serial + `">
                        `+(+d["subs"][0]["srp"]>=d["subs"][0]["mrp"]?"":"₹ "+d["subs"][0]["mrp"])+`
                        </del>
                        <br>
                          <strong>
                              ₹ <span class="price" id="product_price`+ serial + `">` + d["subs"][0]["srp"] + `<span>
                                  </span></span></strong>
                          x
                      </span>
                      <input id="input-quantity`+ serial + `" class="sc-cart-item-qty   text-center"
                          name="product_quantity" min="0.1" value="1" type="number">
                  </div>
                  <input id="hidden_product_name`+ serial + `" name="product_name" value="` + d["itemname"] + ` - ` + d["subs"][0]["itemsubname"] + `" type="hidden">
                  <input id="hidden_product_price`+ serial + `" name="product_price" value="` + d["subs"][0]["srp"] + `" type="hidden">
                  <input name="product_id" value="`+ serial + `" type="hidden">
                  <div class="cart-add-btn-wrapper text-center">
                      <button class="btn btn-success btn-add-cart sc-add-to-cart btn-xs" data-pname="`+ d["itemname"] + `"><i
                              class="fa fa-cart-plus" aria-hidden="true"></i>
                          <span> Add to cart</span></button>
                  </div>
            </div>
                    </div>
                </div>
            </div>`;
    }
    return str;
}
function showAlert(msg) {
    $.toast({
        heading: msg,
        position: 'top-center',
        textAlign: 'center',
        stack: false
    });
}

$(document).ready(function () {

    let local_name = localStorage.getItem('name');
    let local_mobile = localStorage.getItem('mobile');
    let local_address = localStorage.getItem('address');
    let local_zip = localStorage.getItem('zip');
    let location_set = false;
    let pay_online = false;

    $('#cname').val(local_name);
    $('#cphone').val(local_mobile);
    $('#caddress').val(local_address);
    $('#czip').val(local_zip);

    var shop_phone = $('#phone').val();
    var shop_id = $('#uid').val();
    var identifier = $('#identifier').val();

    var options = (JSON.parse($('#options').val()));

    var price = true;

    var hook = 0;

    var order_notes = true;

    var decimal_qty = false;

    fetch("data/data.json").then(function (response) {
        // console.log(response);
        response.json().then(function (data) {
            // console.log(text);
            listcontent = makeHTMLfromJSON(data);
            $("#dynlist").append(listcontent);

            $('#smartcart').smartCart({
                currencySettings: {
                    locales: 'en-US',
                    decimal: 3,
                    currencyOptions: {
                        style: 'currency',
                        currency: 'INR',
                        currencyDisplay: 'symbol',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                },
                lang: {  // Language variables
                    cartTitle: "Shopping Cart",
                    checkout: 'Checkout',
                    clear: 'Clear Cart',
                    extra_charge: options,
                    decimal_qty: decimal_qty,
                    subtotal: 'Subtotal:',
                    cartRemove: '<i class="fa fa-trash" aria-hidden="true"></i>',
                    cartEmpty: 'Cart is Empty!<br />Choose your products'
                },
            });
            $(".fancybox").fancybox();
            $('.sc-add-to-cart').click(function () {

                var product = $(this).attr('data-pname');
                var msg = product + " added to cart";

                showAlert(msg);
            });

            $('.variation').change(function () {
                var option = $(this).find(':selected');
                let variant_price = option.data('price');
                let actual = option.data('actual').split(" ");
                let actual_price = actual[1] > variant_price ? option.data('actual') : '';
                let id = option.data('product_id');

                $('#product_price' + id).html(variant_price);
                $('#product_actual_price' + id).html(actual_price);
                $('#hidden_product_price' + id).val(variant_price);
                let product_name = $('#hidden_product_name' + id).val(option.data('variant'));
            });

            var previous;
            $('.sc-cart-item-qty').on('focus', function () {
                // Store the current value on focus and on change
                previous = this.value;
            }).on('change', function () {
                var val = $(this).val();
                var valid = true;
                // Check if negetive value
                if (val < 0.1) valid = false;
                if (!decimal_qty) {
                    if (!valid || val % 1 > 0) valid = false;
                }
                if (!valid) $(this).val(previous);
            });
        })

    }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    })


    // $("#dynlist").on("focusin", function(){
    //     $(".fancybox").fancybox();
    // })



    var address_field = $("input[name='pickup']:checked").data('address');
    toggleAddressFields(address_field);

    $('.delivery-options').on('click', function () {
        var address_field = $(this).data('address');
        toggleAddressFields(address_field);
    });

    function toggleAddressFields(address_field) {

        if (address_field) {

            $('.address-area').show();
        } else {

            $('.address-area').hide();
        }
    }

    $('#cphone').blur(function (e) {

        var customer_phone = $(this).val().replace(/[^0-9]/g, '');
        $(this).val(customer_phone);
        $('#error-phone').text(isPhoneValid(customer_phone) ? '' : 'Enter valid mobile numer');
    });

    $('#worder').click(function () {

        var items = JSON.parse($("#cart_list").val());
        var total = $('.sc-cart-subtotal').text();

        var customer_name = $.trim($('#cname').val());
        var customer_phone = $.trim($('#cphone').val());
        var customer_address = '';
        var customer_zip = '';
        var customer_location = '';

        if (location_set) customer_location = $.trim($('#my_location').val());

        var delivery = $('input[name="pickup"]:checked');
        var order_note = order_notes ? $.trim($('#order_note').val()) : '';

        var extra_charge = $('#extra_charge').val();

        var option = delivery.data('value');
        var address_required = delivery.data('address');

        if (address_required) {

            var customer_address = $.trim($('#caddress').val());
            var customer_zip = $.trim($('#czip').val());
        }

        var validate = validateCustomerData(items, customer_name, customer_address, customer_phone, customer_zip, customer_location, address_required);

        if (validate.length == 0) {

            localStorage.setItem("name", customer_name);
            localStorage.setItem("mobile", customer_phone);
            if (address_required) {

                localStorage.setItem("address", customer_address);
                localStorage.setItem("zip", customer_zip);
            }

            var data = {
                time: Date.now(),
                items: items,
                total: $.trim(total),
                order_note: order_note,
                extra_charge: extra_charge,
                delivery: { option, identifier },
                name: customer_name,
                phone: customer_phone,
                address: customer_address,
                zip: customer_zip,
                location: customer_location,
                hook: hook,
                pay_online: pay_online,
                shop_id: shop_id,
                // _token: "nOt43AIWiyVr0X4GudEh8lBCUSRPgy416Gy2L0Y0",
            }

            var message = formatMessage(items, total, price, order_note, extra_charge, identifier, delivery, customer_name, customer_address, customer_phone, customer_zip, customer_location);

            processData(data, message, shop_phone);

        } else {

            showAlert(validate[0]);
        }
    });



    // Clear search field
    $('#search-clear').click(function () {
        $('#search-input').val('');
        search();
    });



});