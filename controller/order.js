import OrderModel from "../model/OrderModel.js";
import {customers, items, orders} from "../db/dataBase.js";
let cart = [];

const customerId = $('#customerIdDRD');
const item_Id = $('#itemIdDRD');
const orderId = $('#orderId');
const customerName = $('#customerName');
const itemName = $('#ItemName1');
const qtyOnHand = $('#qtyOnHand');
const unit_Price = $('#unitPrice');
const orderDate = $('#orderDate');
const net_total = $('#netTotal');
const sub_total = $('#subTotal');
const order_quantity = $('#order_quantity');
const discount = $('#inputItemDiscount');
const addCartBtn = $('#addCartBtn');
const cash = $('#inputItemCash');
const balance = $('#inputQntOnBalance');

initialize()

function initialize(){
    if (orders.length === 0) {
        orderId.val(1);
    } else {
        orderId.val(parseInt(orders[orders.length - 1].orderId) + 1);
    }
}
customerId.on('input', () => {
    console.log("set cmb box value")

    if (customerId.val() !== 'select the customer'){

        customerName.val(customers[customerId.val() - 1].name);

    }else{
        customerName.val('');
    }
});

const formattedDate = new Date().toISOString().substr(0, 10);
orderDate.val(formattedDate);

export function setCustomerIds(data) {
    customerId.empty();
    customerId.append('<option selected>select the customer</option>');

    for (let i = 0; i < data.length; i++) {
        customerId.append('<option value="' + (i + 1) + '">' + data[i].id + '</option>');
    }
}

export function setItemIds(data) {
    item_Id.empty();
    item_Id.append('<option selected>select the item</option>');

    for (let i = 0; i < data.length; i++) {
        item_Id.append('<option value="' + (i + 1) + '">' + data[i].itemCode + '</option>');
    }
}

item_Id.on('input', () => {
    if (item_Id.val() !== 'select the customer'){
        itemName.val(items[item_Id.val() - 1].itemName);
        qtyOnHand.val(items[item_Id.val() - 1].itemQty);
        unit_Price.val(items[item_Id.val() - 1].itemPrice);
    }else{
        itemName.val('');
        qtyOnHand.val('');
        unit_Price.val('');
    }
});

addCartBtn.on('click', () => {
    let itemId = item_Id.val();
    let orderQTY = parseInt(order_quantity.val());
    let unitPrice = unit_Price.val();
    let qty = qtyOnHand.val();
    let total = unitPrice * orderQTY;

    if (qty >= orderQTY) {
        let cartItemIndex = cart.findIndex(cartItem => cartItem.itemId === itemId);
        if (cartItemIndex < 0) {
            let cart_item = {
                itemId: itemId,
                unitPrice: unitPrice,
                qty: orderQTY,
                total: total
            }
            cart.push(cart_item);
            loadCart();
            setTotalValues()
            clearItemSection();
        } else {
            cart[cartItemIndex].qty += orderQTY;
            cart[cartItemIndex].total = cart[cartItemIndex].qty * cart[cartItemIndex].unitPrice;
            loadCart();
            setTotalValues()
            clearItemSection();
        }
    } else {
        alert("not enough quantity in stock");
    }

});

function loadCart() {
    $('tbody').eq(2).empty();
    cart.map((item) => {
        $('tbody').eq(2).append(
            `<tr>
                <th scope="row">${item.itemId}</th>
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
                <td><button class="cart_remove" data-id="${item.itemId}">Remove</button></td>
            </tr>`
        );
    });
}

function setTotalValues(){
    let netTotal = calculateTotal();
    net_total.text(`${netTotal}/=`);

    let discount_percentage = discount.val() || 0;
    let discountAmount = (netTotal * discount_percentage) / 100;
    sub_total.text(`${netTotal - discountAmount}/=`);
}

function calculateTotal(){
    let netTotal = 0;
    cart.map((cart_item) => {
        netTotal += cart_item.total;
    });
    return netTotal;
}

function clearItemSection() {
    item_Id.val('select the item');
    itemName.val('');
    unit_Price.val('');
    qtyOnHand.val('');
    order_quantity.val('')

}
function setBalance(){
    let subTotal = parseFloat(sub_total.text());
    let cashAmount = parseFloat(cash.val());
    balance.val(cashAmount - subTotal);
}

cash.on('input', () => setBalance());

//set sub total value
discount.on('input', () => {
    let discountValue = parseFloat(discount.val()) || 0;
    if (discountValue < 0 || discountValue > 100) {
        discountValue = Math.min(100, Math.max(0, discountValue));
        discount.val(discountValue);
    }

    let total_value = calculateTotal();
    let discountAmount = (total_value * discountValue) / 100;
    sub_total.text(`${total_value - discountAmount}/=`);
    setBalance();
});

$('tbody').on('click', '.cart_remove', function() {
    const item_Id = $(this).data('id');
    console.log(item_Id)
    const index = item_Id - 1;

    if (index !== -1) {
        cart.splice(index, 1);
        loadCart();
        setTotalValues();
    }

});
