

const customerId = $('#customerIdDRD');
const itemId = $('#itemIdDRD');

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