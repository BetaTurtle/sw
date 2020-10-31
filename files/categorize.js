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