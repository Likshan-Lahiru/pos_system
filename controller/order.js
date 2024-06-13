import OrderModel from "../model/OrderModel.js";
import {customers, orders} from "../db/dataBase.js";


const customerId = $('#customerIdDRD');
const itemId = $('#itemIdDRD');
const orderId = $('#orderId');
const customerName = $('#customer_name');

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

export function setCustomerIds(data) {
    customerId.empty();
    customerId.append('<option selected>select the customer</option>');

    for (let i = 0; i < data.length; i++) {
        customerId.append('<option value="' + (i + 1) + '">' + data[i].id + '</option>');
    }
}

export function setItemIds(data) {
    itemId.empty();
    itemId.append('<option selected>select the item</option>');

    for (let i = 0; i < data.length; i++) {
        itemId.append('<option value="' + (i + 1) + '">' + data[i].itemCode + '</option>');
    }
}
