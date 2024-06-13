$("#home-section").css({display:'block'});
$("#customer-section").css({display: 'none'});
$("#item-section").css({display: 'none'});
$("#order-section").css({display: 'none'});
$("#order-details-section").css({display: 'none'});

$("#customer-btn").on('click',()=>{
    $("#customer-section").css({display:'block'});
    $("#item-section").css({display:'none'});
    $("#home-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
    $("#order-details-section").css({display: 'none'});
});
$("#item-btn").on('click',()=>{
    $("#item-section").css({display:'block'});
    $("#customer-section").css({display:'none'});
    $("#home-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
    $("#order-details-section").css({display: 'none'});
});
$("#store-btn").on('click',()=>{
    $("#customer-section").css({display:'none'});
    $("#item-section").css({display:'none'});
    $("#home-section").css({display:'none'});
    $("#order-section").css({display: 'block'});
    $("#order-details-section").css({display: 'none'});
});
$("#home-btn").on('click',()=>{
    $("#home-section").css({display:'block'});
    $("#customer-section").css({display:'none'});
    $("#item-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
    $("#order-details-section").css({display: 'none'});
});
$("#order-detail").on('click',()=>{
    $("#home-section").css({display:'none'});
    $("#customer-section").css({display:'none'});
    $("#item-section").css({display:'none'});
    $("#order-section").css({display: 'none'});
    $("#order-details-section").css({display: 'block'});
});
setInterval(function() {
    document.getElementById('totalCustomers').innerText = Math.floor(Math.random() * 1000); // Randomize for demo
    document.getElementById('totalItems').innerText = Math.floor(Math.random() * 2000); // Randomize for demo
    document.getElementById('totalOrders').innerText = Math.floor(Math.random() * 500); // Randomize for demo
}, 1000);

setInterval(function() {
    var now = new Date();
    var timeString = now.toLocaleTimeString();
    document.getElementById('liveClock').innerText = timeString;
}, 1000);

// Update live calendar every second
setInterval(function() {
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('liveCalendar').innerText = dateString;
}, 1000);