
function makeHTMLfromJSON(data) {
    d = data[0];

    var str = "";
    for (serial in data) {
        d = data[serial];
        console.log(d);
        console.log(serial);

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
                      <img data-name="product_image" src="images/`+ serial + `.png"
                          class="product-img" alt="`+ d["itemname"] + `" title="` + d["itemname"] + `">
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
                        `+(d["subs"][0]["srp"]==d["subs"][0]["mrp"]?"":"₹ "+d["subs"][0]["mrp"])+`
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
                  <input id="hidden_product_price`+ serial + `" name="product_price" value="` + d["subs"][0]["mrp"] + `" type="hidden">
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