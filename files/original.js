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

/*!
 * jQuery Smart Cart v3.0.1
 * The smart interactive jQuery Shopping Cart plugin with PayPal payment support
 * http://www.techlaboratory.net/smartcart
 *
 * Created by Dipu Raj
 * http://dipuraj.me
 *
 * Licensed under the terms of the MIT License
 * https://github.com/techlab/SmartCart/blob/master/LICENSE
 */

;(function ($, window, document, undefined) {
    "use strict";
    // Default options
    var defaults = {
            cart: [], // initial products on cart
            resultName: 'cart_list', // Submit name of the cart parameter
            theme: 'default', // theme for the cart, related css need to include for other than default theme
            combineProducts: true, // combine similar products on cart
            highlightEffect: true, // highlight effect on adding/updating product in cart
            cartItemTemplate: '<img class="img-responsive pull-left" src="{product_image}" /><h4 class="list-group-item-heading">{product_name}</h4><p class="list-group-item-text">{product_desc}</p>',
            cartItemQtyTemplate: '{display_price} × {display_quantity} = {display_amount}',
            productContainerSelector: '.sc-product-item',
            productElementSelector: '*', // input, textarea, select, div, p
            addCartSelector: '.sc-add-to-cart',
            chageDeliveryOption: '.delivery-options',
            paramSettings : { // Map the paramters
                productPrice: 'product_price',
                productQuantity: 'product_quantity',
                productName: 'product_name',
                productId: 'product_id',
            },
            submitSettings: {
                submitType: 'ajax', // form, paypal, ajax
                ajaxURL: '', // Ajax submit URL
                ajaxSettings: {} // Ajax extra settings for submit call
            },
            toolbarSettings: {
                showToolbar: true,
                showCheckoutButton: false,
                showClearButton: true,
                showCartSummary:true,
                checkoutButtonStyle: 'default', // default, paypal, image
                checkoutButtonImage: '', // image for the checkout button
                toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
            },
            debug: false
        };

    // The plugin constructor
    function SmartCart(element, options) {
        // Merge user settings with default, recursively
        this.options = $.extend(true, {}, defaults, options);
        // Cart array
        this.cart = [];
        // Cart element
        this.cart_element = $(element);
        // Call initial method
        this.init();
    }

    $.extend(SmartCart.prototype, {

        init: function () {
            // Set the elements
            this._setElements();
            
            // Add toolbar
            this._setToolbar();
            
            // Assign plugin events
            this._setEvents();
            
            // Set initial products
            var mi = this;
            $(this.options.cart).each(function(i, p) {
                p = mi._addToCart(p);
            });
            
            // Call UI sync
            this._hasCartChange();
        },

// PRIVATE FUNCTIONS
        /* 
         * Set basic elements for the cart
         */
        _setElements: function () {
            // The element store all cart data and submit with form
            var cartListElement = $('<input type="hidden" name="' + this.options.resultName + '" id="' + this.options.resultName + '" />');
            this.cart_element.append(cartListElement);
            // Set the cart main element
            this.cart_element.addClass('panel panel-default sc-cart sc-theme-' + this.options.theme);
            this.cart_element.append('<div class="panel-heading sc-cart-heading">' + this.options.lang.cartTitle + ' <span class="sc-cart-count badge">0</span></div>');
            this.cart_element.append('<div class="list-group sc-cart-item-list"></div>');
        },
        /* 
         * Set the toolbar for the cart 
         */
        _setToolbar: function () {
            if(this.options.toolbarSettings.showToolbar !== true) { return false; }
            
            var toolbar = $('<div></div>').addClass('panel-footer sc-toolbar');
            var toolbarButtonPanel = $('<div class="sc-cart-toolbar">');
            var toolbarSummaryPanel = $('<div class="sc-cart-summary">');
            
            // Checkout Button
            if(this.options.toolbarSettings.showCheckoutButton){
                var btnCheckout = '';
                switch(this.options.toolbarSettings.checkoutButtonStyle){
                    case 'paypal':
                        btnCheckout = '<button class="sc-button-checkout-paypal sc-cart-checkout" type="submit"><img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-medium.png" alt="Check out with PayPal" /></button>'; 
                        break;
                    case 'image':
                        btnCheckout = '<button class="sc-button-checkout-paypal sc-cart-checkout" type="submit"><img src="'+this.options.toolbarSettings.checkoutButtonImage+'" alt="Check out" /></button>'; 
                        break;    
                    default:
                        btnCheckout = '<button class="btn btn-info sc-cart-checkout" type="button">' + this.options.lang.checkout + '</button> ';
                        break;
                }
                toolbarButtonPanel.append(btnCheckout);
            }
            
            // Clear Button
            if(this.options.toolbarSettings.showClearButton){
                var btnClear = $('<button class="btn btn-outline-dark sc-cart-clear" type="button">').text(this.options.lang.clear);
                toolbarButtonPanel.append(btnClear);
            }
            
            // Add extra toolbar buttons
            if(this.options.toolbarSettings.toolbarExtraButtons && this.options.toolbarSettings.toolbarExtraButtons.length > 0){
                toolbarButtonPanel.append(this.options.toolbarSettings.toolbarExtraButtons);
            }
            
            // Cart Summary
            if(this.options.toolbarSettings.showCartSummary){
                var panelSubTotal = $('<div class="sc-cart-summary-subtotal">');
                if(this.options.lang.extra_charge.active){
                    panelSubTotal.append('<div class="sc-cart-summary-extraCharge d-none">'+this.options.lang.extra_charge.message+': <span class="sc-cart-extraCharge">'+this._getMoneyFormatted(this.options.lang.extra_charge.charge)+'</span></div>');
                }
                panelSubTotal.append(this.options.lang.subtotal).append(' <span class="sc-cart-subtotal">0</span>');
                toolbarSummaryPanel.append(panelSubTotal);
            }
            
            toolbar.append(toolbarSummaryPanel);
            toolbar.append(toolbarButtonPanel);
            this.cart_element.append(toolbar);
        },
        /* 
         * Set events for the cart
         */
        _setEvents: function () {
            var mi = this;
            // Capture add to cart button events
            $(this.options.addCartSelector).on( "click", function(e) {
                e.preventDefault();
                var p = mi._getProductDetails($(this));
                p = mi._addToCart(p);
                $(this).parents(mi.options.productContainerSelector).addClass('sc-added-item').attr('data-product-unique-key', p.unique_key);
                updateCart();
            });

            $(this.options.chageDeliveryOption).on( "click", function() {
                mi._hasCartChange();
            });
            
            // Item remove event
            $(this.cart_element).on( "click", '.sc-cart-remove', function(e) {
                e.preventDefault();
                $(this).parents('.sc-cart-item').fadeOut("normal", function() {
                    mi._removeFromCart($(this).data('unique-key'));
                    $(this).remove();
                    mi._hasCartChange();
                    changeCartCount();
                });
            });
            
           

            // Item quantity change event
            var decimal_qty = this.options.lang.decimal_qty;
            var previous;

            $(this.cart_element).on('focus', '.sc-cart-item-qty', function () {
                // Store the current value on focus and on change
                previous = this.value;
            }).on("change", '.sc-cart-item-qty', function (e) {
                e.preventDefault();
                // console.log(decimal_qty, previous);
                var val = $(this).val();
                var valid = true;
                // Check if negetive value
                if (val < 0.1) valid = false;
                if (!decimal_qty) {

                    if (!valid || val % 1 > 0) valid = false;
                }
                if (!valid) $(this).val(previous);
                mi._updateCartQuantity($(this).parents('.sc-cart-item').data('unique-key'), $(this).val());
            });
            
            // Cart checkout event
            $(this.cart_element).on( "click", '.sc-cart-checkout', function(e) {
                if($(this).hasClass('disabled')) { return false; }
                e.preventDefault();
                mi._submitCart();
            });
            
            // Cart clear event
            $(this.cart_element).on( "click", '.sc-cart-clear', function(e) {
                if($(this).hasClass('disabled')) { return false; }
                e.preventDefault();
                $('.sc-cart-item-list > .sc-cart-item', this.cart_element).fadeOut("normal", function() {
                    $(this).remove();
                    mi._clearCart();
                    mi._hasCartChange();
                });
            });
            
        },
        /* 
         * Get the parameters of a product by seaching elements with name attribute/data.
         * Product details will be return as an object
         */
        _getProductDetails: function (elm) {
            var mi = this;
            var p = {};
            elm.parents(this.options.productContainerSelector)
                .find(this.options.productElementSelector)
                .each(function() {
                    if ($(this).is('[name]') === true || typeof $(this).data('name') !== typeof undefined) {
                        var key = $(this).attr('name') ? $(this).attr('name') : $(this).data('name'); 
                        var val = mi._getContent($(this));
                        if(key && val){
                            p[key] = val;    
                        }
                    }
                });
            return p;
        },
        /* 
         * Add the product object to the cart
         */
        _addToCart: function (p) {
            var mi = this;
            
            if (!p.hasOwnProperty(this.options.paramSettings.productPrice)) {
                this._logError('Price is not set for the item');
                return false;
            }
            
            if (!p.hasOwnProperty(this.options.paramSettings.productQuantity)) {
                this._logMessage('Quantity not found, default to 1');
                p[this.options.paramSettings.productQuantity] = 1;
            }
            
            if (!p.hasOwnProperty('unique_key')) {
                p.unique_key =  this._getUniqueKey();
            }

            if(this.options.combineProducts){
                var pf = $.grep(this.cart, function(n, i){
                    return mi._isObjectsEqual(n, p);
                });
                if(pf.length > 0){
                    var idx = this.cart.indexOf(pf[0]);
                    this.cart[idx][this.options.paramSettings.productQuantity] = (this.cart[idx][this.options.paramSettings.productQuantity] - 0) + (p[this.options.paramSettings.productQuantity] - 0);  
                    p = this.cart[idx];
                    // Trigger "itemUpdated" event
                    this._triggerEvent("itemUpdated", [p]);
                }else{
                    this.cart.push(p); 
                    // Trigger "itemAdded" event
                    this._triggerEvent("itemAdded", [p]);
                }
            }else{
                this.cart.push(p);
                // Trigger "itemAdded" event
                this._triggerEvent("itemAdded", [p]);
            }
            
            this._addUpdateCartItem(p);
            return p;
        },
        /* 
         * Remove the product object from the cart
         */
        _removeFromCart: function (unique_key) {
            var mi = this;
            $.each( this.cart, function( i, n ) {
                if(n.unique_key === unique_key){
                    var itemRemove = mi.cart[i];
                    $('#badge-quantity'+n.product_id).html(0);
                    $('#badge-quantity'+n.product_id).addClass("d-none");
                    mi.cart.splice(i, 1);
                    $('*[data-product-unique-key="' + unique_key + '"]').removeClass('sc-added-item');
                    mi._hasCartChange();
                    
                    // Trigger "itemRemoved" event
                    mi._triggerEvent("itemRemoved", [itemRemove]);
                    return false;
                }
            });
        },
        /* 
         * Clear all products from the cart
         */
        _clearCart: function () {
            this.cart = [];
            // Trigger "cartCleared" event
            this._triggerEvent("cartCleared");
            this._hasCartChange();
            $('.quantity-badge').html(0);
            $('.quantity-badge').addClass("d-none");
            changeCartCount();
        },
        /* 
         * Update the quantity of an item in the cart
         */
        _updateCartQuantity: function (unique_key, qty) {
            var mi = this;
            var qv = this._getValidateNumber(qty);
            $.each( this.cart, function( i, n ) {
                if(n.unique_key === unique_key){
                    if(qv){
                        mi.cart[i][mi.options.paramSettings.productQuantity] = qty;   
                    }
                    $('#badge-quantity'+n.product_id).html(n.product_quantity);
                    mi._addUpdateCartItem(mi.cart[i]);
                    // Trigger "quantityUpdate" event
                    mi._triggerEvent("quantityUpdated", [mi.cart[i], qty]);
                    return false;
                }
            });
        },
        /* 
         * Update the UI of the cart list
         */
        _addUpdateCartItem: function (p) {
            var productAmount = (p[this.options.paramSettings.productQuantity] - 0) * (p[this.options.paramSettings.productPrice] - 0);
            var cartList = $('.sc-cart-item-list',this.cart_element); 
            var elmMain = cartList.find("[data-unique-key='" + p.unique_key + "']");
            if(elmMain && elmMain.length > 0){
                elmMain.find(".sc-cart-item-qty").val(p[this.options.paramSettings.productQuantity]);
                elmMain.find(".sc-cart-item-amount").text(this._getMoneyFormatted(productAmount));
            }else{
                elmMain = $('<div></div>').addClass('sc-cart-item list-group-item');   
                elmMain.append('<button type="button" class="sc-cart-remove">' + this.options.lang.cartRemove + '</button>');
                elmMain.attr('data-unique-key', p.unique_key);
                
                elmMain.append(this._formatTemplate(this.options.cartItemTemplate, p));
                
                var itemSummary = '<div class="sc-cart-item-summary"><span class="sc-cart-item-price">' + this._getMoneyFormatted(p[this.options.paramSettings.productPrice]) + '</span>';
                itemSummary += '<span class="price-span" id="price-span"> × </span><input type="number" min="1" max="1000" class="sc-cart-item-qty" value="' + this._getValueOrEmpty(p[this.options.paramSettings.productQuantity]) + '" />';
                itemSummary += '<span class="price-span"> = </span><span class="sc-cart-item-amount">' + this._getMoneyFormatted(productAmount) + '</span></div>';
                
                elmMain.append(itemSummary);
                cartList.append(elmMain);
            }
            
            // Apply the highlight effect
            if(this.options.highlightEffect === true){
                elmMain.addClass('sc-highlight');
                setTimeout(function() {
                    elmMain.removeClass('sc-highlight');
                },500);                
            }
            
            this._hasCartChange();
        },
        /* 
         * Handles the changes in the cart 
         */
        _hasCartChange: function () {
            $('.sc-cart-count',this.cart_element).text(this.cart.length);
            $('.sc-cart-count').text(this.cart.length);
            $('.sc-cart-count').removeClass('d-none');
            $('.sc-cart-subtotal',this.element).text(this._getCartSubtotal());
            
            if(this.cart.length === 0){
                $('.sc-cart-item-list',this.cart_element).empty().append($('<div class="sc-cart-empty-msg">' + this.options.lang.cartEmpty + '</div>'));
                $(this.options.productContainerSelector).removeClass('sc-added-item');
                $('.sc-cart-checkout, .sc-cart-clear').addClass('disabled');
                $('.sc-cart-summary-extraCharge').addClass('d-none');
                
                // Trigger "cartEmpty" event
                this._triggerEvent("cartEmpty");
            }else{
                $('.sc-cart-item-list > .sc-cart-empty-msg',this.cart_element).remove();
                $('.sc-cart-checkout, .sc-cart-clear').removeClass('disabled');
                $('.sc-cart-summary-extraCharge').removeClass('d-none');
            }
            
            // Update cart value to the  cart hidden element 
            $('#' + this.options.resultName, this.cart_element).val(JSON.stringify(this.cart));
        },
        /* 
         * Calculates the cart subtotal
         */
        _getCartSubtotal: function () {
            var mi = this;
            var subtotal = 0;
            $.each(this.cart, function( i, p ) {   
                if(mi._getValidateNumber(p[mi.options.paramSettings.productPrice])){
                    subtotal += (p[mi.options.paramSettings.productPrice] - 0) * (p[mi.options.paramSettings.productQuantity] - 0);
                }
            });
            var delivery = $("input[name='pickup']:checked").data('value');
            // console.log(this.options.lang.extra_charge.options[0]);
            if($.inArray(delivery, this.options.lang.extra_charge.options) !== -1){
                if(this.options.lang.extra_charge.active){
                    if(this.cart.length > 0){
                        if(this.options.lang.extra_charge.threshold > subtotal || this.options.lang.extra_charge.threshold == -1){
                            subtotal += parseFloat(this.options.lang.extra_charge.charge);
                            $('.sc-cart-summary-extraCharge').show();
                            $('#extra_charge').val(this.options.lang.extra_charge.charge);
                        }
                        else{
                            $('.sc-cart-summary-extraCharge').hide();
                            $('#extra_charge').val('');
                        }
                    }
                }
            }else{
                $('.sc-cart-summary-extraCharge').hide();
                $('#extra_charge').val('');
            }
            return this._getMoneyFormatted(subtotal);
        },
        /* 
         * Cart submit functionalities
         */
        _submitCart: function () {
            var mi = this;
            var formElm = this.cart_element.parents('form');
            if(!formElm){
                this._logError( 'Form not found to submit' ); 
                return false;
            }
            
            switch(this.options.submitSettings.submitType){
                case 'ajax':
                    var ajaxURL = (this.options.submitSettings.ajaxURL && this.options.submitSettings.ajaxURL.length > 0) ? this.options.submitSettings.ajaxURL : formElm.attr( 'action' );

                    var ajaxSettings = $.extend(true, {}, {
                        url: ajaxURL,
                        type: "POST",
                        data: formElm.serialize(),
                        beforeSend: function(){
                            mi.cart_element.addClass('loading');
                        },
                        error: function(jqXHR, status, message){
                            mi.cart_element.removeClass('loading');
                            mi._logError(message);
                        },
                        success: function(res){
                            mi.cart_element.removeClass('loading');
                            mi._triggerEvent("cartSubmitted", [mi.cart]);
                            mi._clearCart();
                        }
                    }, this.options.submitSettings.ajaxSettings);

                    $.ajax(ajaxSettings);
                
                    break;
                case 'paypal':
                    formElm.children('.sc-paypal-input').remove();
                    // Add paypal specific fields for cart products
                    $.each(this.cart, function( i, p ) {   
                        var itemNumber = i + 1;
                        formElm.append('<input class="sc-paypal-input" name="item_number_' + itemNumber + '" value="' + mi._getValueOrEmpty(p[mi.options.paramSettings.productId]) + '" type="hidden">')
                               .append('<input class="sc-paypal-input" name="item_name_' + itemNumber + '" value="' + mi._getValueOrEmpty(p[mi.options.paramSettings.productName]) + '" type="hidden">')
                               .append('<input class="sc-paypal-input" name="amount_' + itemNumber + '" value="' + mi._getValueOrEmpty(p[mi.options.paramSettings.productPrice]) + '" type="hidden">')
                               .append('<input class="sc-paypal-input" name="quantity_' + itemNumber + '" value="' + mi._getValueOrEmpty(p[mi.options.paramSettings.productQuantity]) + '" type="hidden">');
                    });

                    formElm.submit();
                    this._triggerEvent("cartSubmitted", [this.cart]);
                    
                    break;
                default:
                    formElm.submit();
                    this._triggerEvent("cartSubmitted", [this.cart]);
                    
                    break;
            }
            
            return true;
        },
        
// HELPER FUNCTIONS
        /* 
         * Get the content of an HTML element irrespective of its type
         */
        _getContent: function (elm) {
            if(elm.is(":checkbox, :radio")){
                return elm.is(":checked") ? elm.val() : '';
            } else if (elm.is("[value], select")){
                return elm.val();
            } else if (elm.is("img")){
                return elm.attr('src');
            } else {
                return elm.text();
            }
            return '';
        },
        /* 
         * Compare equality of two product objects
         */
        _isObjectsEqual: function (o1, o2) {
            if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length) {
                return false;
            }
            for (var p in o1) {
                if(p === 'unique_key' || p === this.options.paramSettings.productQuantity) {
                    continue; 
                }
                if (typeof o1[p] === typeof undefined && typeof o2[p] === typeof undefined) { 
                    continue; 
                }
                if (o1[p] !== o2[p]){
                    return false;
                }
            }
            return true;
        },
        /* 
         * Format money
         */
        _getMoneyFormatted: function (n) {
            n = n - 0;
            return Number(n.toFixed(2)).toLocaleString(this.options.currencySettings.locales, this.options.currencySettings.currencyOptions);
        },
        /* 
         * Get the value of an element and empty value if the element not exists 
         */
        _getValueOrEmpty: function (v) {
            return (v && typeof v !== typeof undefined) ? v : '';
        },
        /* 
         * Validate Number
         */
        _getValidateNumber: function (n) {
            n = n - 0;
            if(n && n > 0){
               return true;
            }
            return false;
        },
        /* 
         * Small templating function
         */
        _formatTemplate: function (t, o){
            var r = t.split("{"), fs = '';
            for(var i=0; i < r.length; i++){
                var vr = r[i].substring(0, r[i].indexOf("}")); 
                if(vr.length > 0){
                    fs += r[i].replace(vr + '}', this._getValueOrEmpty(o[vr]));
                }else{
                    fs += r[i];
                }
            }
            return fs;
        },
        /* 
         * Event raiser
         */
        _triggerEvent: function (name, params) {
            // Trigger an event
            var e = $.Event(name);
            this.cart_element.trigger(e, params);
            if (e.isDefaultPrevented()) { return false; }
            return e.result;
        },
        /* 
         * Get unique key
         */
        _getUniqueKey: function () {
            var d = new Date();
            return d.getTime();
        },
        /* 
         * Log message to console
         */
        _logMessage: function (msg) {
            if(this.options.debug !== true) { return false; }
            // Log message
            console.log(msg);
        },
        /* 
         * Log error to console and terminate execution
         */
        _logError: function (msg) {
            if(this.options.debug !== true) { return false; }
            // Log error
            $.error(msg);
        },

// PUBLIC FUNCTIONS
        /* 
         * Public function to sumbit the cart
         */
        submit: function () {
            this._submitCart();
        },
        /* 
         * Public function to clear the cart
         */
        clear: function () {
            this._clearCart();
        }
    });

    // Wrapper for the plugin
    $.fn.smartCart = function(options) {
        var args = arguments;
        var instance;

        if (options === undefined || typeof options === 'object') {
            return this.each( function() {
                if ( !$.data( this, "smartCart") ) {
                    $.data( this, "smartCart", new SmartCart( this, options ) );
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            instance = $.data(this[0], 'smartCart');

            if (options === 'destroy') {
                $.data(this, 'smartCart', null);
            }

            if (instance instanceof SmartCart && typeof instance[options] === 'function') {
                return instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            } else {
                return this;
            }
        }
    };

})(jQuery, window, document);

// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    "use strict";
    
    var Toast = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toast.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindToast();
            this.animate();
        },

        setup: function () {
            
            var _toastContent = '';
            
            this._toastEl = this._toastEl || $('<div></div>', {
                class : 'jq-toast-single'
            });

            // For the loader on top
            _toastContent += '<span class="jq-toast-loader"></span>';            

            if ( this.options.allowToastClose ) {
                _toastContent += '<span class="close-jq-toast-single">&times;</span>';
            };

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                };

                _toastContent += '<ul class="jq-toast-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                };
                _toastContent += this.options.text;
            }

            this._toastEl.html( _toastContent );

            if ( this.options.bgColor !== false ) {
                this._toastEl.css("background-color", this.options.bgColor);
            };

            if ( this.options.textColor !== false ) {
                this._toastEl.css("color", this.options.textColor);
            };

            if ( this.options.textAlign ) {
                this._toastEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._toastEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastEl.addClass('jq-icon-' + this.options.icon);
                };
            };

            if ( this.options.class !== false ){
                this._toastEl.addClass(this.options.class)
            }
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : this.options.position.top ? this.options.position.top : 'auto',
                    bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
                    left : this.options.position.left ? this.options.position.left : 'auto',
                    right : this.options.position.right ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindToast: function () {

            var that = this;

            this._toastEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastEl.find('.close-jq-toast-single').on('click', function ( e ) {

                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastEl.on('beforeShow', function () {
                    that.options.beforeShow(that._toastEl);
                });
            };

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastEl.on('afterShown', function () {
                    that.options.afterShown(that._toastEl);
                });
            };

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastEl.on('beforeHide', function () {
                    that.options.beforeHide(that._toastEl);
                });
            };

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastEl.on('afterHidden', function () {
                    that.options.afterHidden(that._toastEl);
                });
            };

            if ( typeof this.options.onClick == 'function' ) {
                this._toastEl.on('click', function () {
                    that.options.onClick(that._toastEl);
                });
            };    
        },

        addToDom: function () {

             var _container = $('.jq-toast-wrap');
             
             if ( _container.length === 0 ) {
                
                _container = $('<div></div>',{
                    class: "jq-toast-wrap",
                    role: "alert",
                    "aria-live": "polite"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toast-single:hidden').remove();

             _container.append( this._toastEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
                
                var _prevToastCount = _container.find('.jq-toast-single').length,
                    _extToastCount = _prevToastCount - this.options.stack;

                if ( _extToastCount > 0 ) {
                    $('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
                };

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._toastEl.find('.jq-toast-loader');

            // 400 is the default time that jquery uses for fade/slide
            // Divide by 1000 for milliseconds to seconds conversion
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-toast-loaded');
        },

        animate: function () {

            var that = this;

            this._toastEl.hide();

            this._toastEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastEl.fadeIn(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastEl.slideDown(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else {
                this._toastEl.show(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {

                var that = this;

                window.setTimeout(function(){
                    
                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.fadeOut(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.slideUp(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.hide(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            };
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toast-wrap').remove();
            } else {
                this._toastEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindToast();
        },
        
        close: function() {
            this._toastEl.find('.close-jq-toast-single').click();
        }
    };
    
    $.toast = function(options) {
        var toast = Object.create(Toast);
        toast.init(options, this);

        return {
            
            reset: function ( what ) {
                toast.reset( what );
            },

            update: function( options ) {
                toast.update( options );
            },
            
            close: function( ) {
            	toast.close( );
            }
        }
    };

    $.toast.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {},
        onClick: function () {}
    };

})( jQuery, window, document );

$('.category-link').click(function(){
    // $('#about').hide();
    $('.category-link').removeClass('active');
    $(this).addClass('active');
    var input = $(this).data('category');
    var products = $('.product-details');
    var count = products.length;
    products.hide();
    products.each(function(i, obj) {
        var value = $(this).data('category_name');
        if(value == input) {
            $(this).fadeIn();
        }else{
            count--
            $(this).fadeOut();
        }
    });
    if(input == '*'){
        // $('#about').show();
        products.fadeIn();
    }
});

function formatAddress() {

    return 1200;
} // End of formatAddress

function encodeURL(str) {

    str = (str + '');
    return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E')
    .replace(/%20/g, '+');
} // End of encodeURL

function isPhoneValid(phone) {

    var phone = phone.replace(/[^0-9]/g,'');

    if (phone.length<5)
        return false;
    else
        return true;
} // End of isPhoneValid

function validateCustomerData(list, name, address, phone, zip, location, address_required) {

    list        = list.length > 0 ? true : false;
    phone       = isPhoneValid(phone);
    address     = address == '' ? false : true;
    name        = name == '' ? false : true;
    zip         = zip == '' ? false : true;
    location    = location == '' ? false : true;
    
    var arr = [];

    if (!list) {
        arr.push('Your cart is empty!');
    }

    if (!name) {
        arr.push('Please enter name!');
    }

    if (!phone) {
        arr.push('Enter a valid mobile number!');
    }

    if (!address && address_required) {
        // console.log(address_required)
        arr.push('Address field is empty!');
    }

    if (!zip && address_required) {
        // arr.push('ZIP/Postal field is empty!')
    }
    return arr;
} // End of validateCustomerData

function parseCartItems(items) {

    var total = 0;
    if (items.length > 0) {
        
        var item_str = '_Total items:_ *' + items.length + '*\n';

        for( var i = 0; i < items.length; i++ ) {
            // item_str = item_str + "*" + (i + 1) + "* - " + $.trim(items[i].product_name) + " x " + items[i].product_quantity + " (" + items[i].product_price + "x" + items[i].product_quantity + "=" + parseFloat(items[i].product_price) * parseFloat(items[i].product_quantity) + ")\n";

            item_str = item_str + "*" + (i + 1) + "* - " + $.trim(items[i].product_name) + " x " + items[i].product_quantity + "\n";

            total = total + parseFloat(items[i].product_price) * parseFloat(items[i].product_quantity);
        }
    }

    return {item_str, total};
} // End of parseCartItems

function formatMessage(items, total, price, order_note, extra_charge, identifier, delivery, name, address, phone, zip, location) {

    var items       = parseCartItems(items);
    // var item_str    = items.item_str;
    var address_str = address == '' ? '' : '\n*_Address:_*\n' + address + '\n' + zip ;
    
    if (location != '') {

        var address_str = address_str + '\n*_Location:_*\nhttps://www.google.com/maps?q=' + location ;
    }

    var note_str    = order_note == '' ? '' : '\n*_Order Note:_*\n' + order_note + '\n' ;
    
    var charge_str  = extra_charge ? '\n_Inc Extra Charge: ' + extra_charge + '_\n' : '';
    var total_str   = price ? '\nTotal Payable: *' + total + '*' + charge_str : '';

    var option      = delivery.data('value');

    if (identifier == '')
        var message = delivery.val() == 1 ? '*(' + option + ')*\n' : '';
    else
        var message = delivery.val() == 1 ? '*(' + option + ' - ' + identifier + ')*\n' : '*(' + identifier + ')*\n';

    message = message + '\n' + items.item_str + total_str  + '\n' + note_str + '\n*_Name:_*\n' + name  + '\n*_Mobile:_*\n' + phone + address_str + '\n\n===============\n';

    return message;
} // End of formatMessage

function processData(data, message, shop_phone) {
    console.log("will send to firebase");
    // console.log(db);
    db.collection("orders").add(data)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    sendToWhatsApp(docRef.id, message, shop_phone);

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    return;
    // $.ajax({
    //     method: 'POST',
    //     url: window.location.pathname,
    //     data: data,
    //     success: function(res) {
    //         sendToWhatsApp(res.user_token, message, shop_phone);
    //     },
    //     error: function(e) {

    //         console.log(e);
    //         alert("Something went wrong!!");
    //     }
    // });
} // End of formatMessage

function sendToWhatsApp(token, message, wa_number) {

    console.log("*New Order : #" + (token) + "*\n" + message);
    url = "https://api.whatsapp.com/send?phone="+ wa_number + "&text=" + encodeURL("*New Order*\n https://safewaydelivery.in/orders/#" + (token) + "\n" + message);
    // window.open(url, '_blank');
    window.location.assign(url);
} // End of sendToWhatsApp

function changeCartCount() {

    let cartList = JSON.parse($('#cart_list').val());
    if(cartList.length == 0) {

        $('.badge-wrapper').addClass('d-none');
    }else{

        $('.badge-wrapper').removeClass('d-none');
    }
} // End of changeCartCount

function updateCart() {

    let cartList = JSON.parse($('#cart_list').val());
    changeCartCount();
    $.each(cartList, function(index, value) {

        $('#badge-quantity'+value.product_id).html(value.product_quantity);
        if (value.product_quantity > 0) {

            $('#badge-quantity' + value.product_id).removeClass('d-none');
        } else {

            $('#badge-quantity' + value.product_id).addClass('d-none');
        }
    });
} // End of updateCart

function search() {

    $('#about').hide();
    $('.category-link').removeClass('active');
    $('.all-category').addClass('active');
    var input = $('#search-input').val().toString().toUpperCase();
    var products = $('.product-details');
    var count = products.length;
    products.each(function(i, obj) {

        var value = $(this).data('product_name').toString().toUpperCase();

        if(value.indexOf(input) > -1) {

            $(this).fadeIn();
        }else{

            count--
            $(this).fadeOut();
        }
    });

    if(input.length === 0) {

        $('#about').fadeIn();
    }

    if(count === 0) {

        $('#noresult').removeClass('d-none');
        $('#noresult').removeClass('d-none');
        $('#noresult').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> No result found');
    } else {

        $('#noresult').empty();
        $('#noresult').addClass('d-none');
    }
} // End of search

function getLocation() {

    if (navigator.geolocation) {

        return navigator.geolocation.getCurrentPosition(showPosition);
    } else {

        return "Geolocation is not supported by this browser.";
    }
} // End of getLocation

function showPosition(position) {

    return (position.coords.latitude, position.coords.longitude);
}
