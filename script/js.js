$("#customer-section").css({display: 'block'});
$("#item-section").css({display: 'none'});
$("#order-section").css({display: 'none'});

$("#customer-btn").on('click',()=>{
    $("#customer-section").css({display:'block'});
    $("#item-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
});
$("#item-btn").on('click',()=>{
    $("#item-section").css({display:'block'});
    $("#customer-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
});
$("#store-btn").on('click',()=>{
    $("#customer-section").css({display:'none'});
    $("#item-section").css({display:'none'});
    $("#order-section").css({display: 'block'});
});