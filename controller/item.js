import ItemModel from '../model/ItemModel.js';
import { items} from '../db/dataBase.js';
import {setCustomerIds, setItemIds} from '../controller/order.js';

const regexPrice = /^\d+$/

var recordIndex;

initialize()

function initialize() {
    $.ajax({
        url: "http://localhost:8080/api/v1/item/genItemID",
        type: "GET",
        success: (res) => {

            $('#ItemId').val(res);
        },
        error: (res) => {
            console.error(res);
        }
    });
    setTimeout(() => {
        loadTable();
    },1000)



}

function loadTable() {
    $('#item-tbl-tBody').empty();

    let itemArray = [];
    $.ajax({
        url: "http://localhost:8080/api/v1/item",
        type: "GET",
        dataType: "json",
        success: (res) => {
            console.log(res);
             itemArray = res;
            console.log(itemArray);

            setItemIds(itemArray);

            itemArray.forEach((item, index) => {

                var record = `<tr>
                 <td class="item-code-value">${item.itemId}</td>
                 <td class="item-name-value">${item.description}</td>
                 <td class="item-price-value">${item.unitPrice}</td>
                <td class="item-qty-value">${item.quantity}</td>
            </tr>`;

                $('#item-tbl-tBody').append(record);
            });

        },
        error: (res) => {
            console.error("Failed to load customers:", res);
            customAlert("Failed to load customers.", 'assets/alert/alert-error.gif'); // Optional
        }
    });
}

$('#newItem').on('click', ()=>{
    console.log("New Item save")
   var itemCode = $('#ItemId').val();
   var itemName = $('#ItemName').val();
   var itemPrice = $('#ItemPrice').val();
   var itemQty = $('#ItemQty').val();


    if (itemCode == "" || itemName == "" || itemPrice == "" || itemQty == "") {
        customAlert("Please fill all the fields");
    }else if (!regexPrice.test(itemPrice)) {
        customAlert("Please enter a valid price!",'assets/alert/alert-blink.gif');
    }else if (!regexPrice.test(itemQty)) {
        customAlert("Please enter a valid Qty!",'assets/alert/alert-blink.gif');
    }  else {
        let item = new ItemModel(itemCode, itemName, itemPrice, itemQty
        );
        let jsonItem = JSON.stringify(item);

        console.log(jsonItem);

        $.ajax({
            url: "http://localhost:8080/api/v1/item",
            type: "POST",
            data: jsonItem,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                loadTable();
                $('#item-reset').click();
                console.log(JSON.stringify(res));
                Swal.fire({
                    title: "Item saved successfully!",
                    text: JSON.stringify(),
                    icon: "success"
                });
            },
            error: (res) => {
                console.error(res);
            }
        });



        setTimeout(() => {
            initialize()
        },1000)
    }



});

$("#ItemUpdate").on("click", function() {

    console.log("update Item details")

    var id = $('#ItemId').val();
    var itemName = $('#ItemName').val();
    var itemPrice = $('#ItemPrice').val();
    var itemQty = $('#ItemQty').val();



    if ( itemName == "" || itemPrice == "" || itemQty == "") {
        customAlert("Please fill all the fields",'assets/alert/alert-blink.gif');
    }else if (!regexPrice.test(itemPrice)) {
        customAlert("Please enter a valid price!",'assets/alert/alert-blink.gif');
    }else if (!regexPrice.test(itemQty)) {
        customAlert("Please enter a valid Qty!",'assets/alert/alert-blink.gif');
    }  else {
        let item = new ItemModel(id, itemName, itemPrice, itemQty);
        let jsonItem = JSON.stringify(item);
        console.log(jsonItem);

        $.ajax({
            url: "http://localhost:8080/api/v1/item",
            type: "PUT",
            data: jsonItem,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                $('#item-reset').click();
                console.log(JSON.stringify(res));
                Swal.fire({
                    title: "Item update successfully!",
                    text: JSON.stringify(),
                    icon: "success"

                });

            },
            error: (res) => {
                console.error(res);
                Swal.fire({
                    title: JSON.stringify(res),
                    icon: "error"
                });
            }
        });



        setTimeout(() => {
            initialize()
        },1000)

    }





});

$('#item-tbl-tBody').on('click','tr', function () {
    recordIndex = $(this).index();
    let code = $(this).find('.item-code-value').text();
    let name = $(this).find('.item-name-value').text();
    let price = $(this).find('.item-price-value').text();
    let qty = $(this).find('.item-qty-value').text();



    $('#ItemId').val(code);
    $('#ItemName').val(name);
    $('#ItemPrice').val(price);
    $('#ItemQty').val(qty);
});

$('#ItemDelete').on('click',  () => {
    var id = $('#ItemId').val();
    console.log(id)
    $.ajax({
        url: "http://localhost:8080/api/v1/item/" + id,
        type: "DELETE",
        success: (res) => {
            $('#item-reset').click();
            console.log(JSON.stringify(res));
            Swal.fire({
                title: "Item Delete successfully!",
                text: JSON.stringify(),
                icon: "success"
            });
        },
        error: (res) => {
            console.error(res);
            Swal.fire({
                title: JSON.stringify(res),
                icon: "error"
            });
        }
    });

    $('#item_reset').click();

    setTimeout(() => {
        initialize();
    },1000)

})

$("#searchItem").on("input", function() {
    var itemId = $("#searchItem").val();
    console.log("search Item"+itemId)
    if (itemId.trim() === "") {
        loadTable();
    } else {
        $.ajax({
            url: "http://localhost:8080/api/v1/item/" + itemId,
            type: "GET",
            data: "json",
            success: (res) => {
                console.log(res);

                if (res) {
                    try {


                        $('#item-tbl-tBody').empty();

                        var record = `<tr>
                        <td class="item-code-value">${res.itemId}</td>
                         <td class="item-name-value">${res.description}</td>
                         <td class="item-price-value">${res.unitPrice}</td>
                         <td class="item-qty-value">${res.quantity}</td>
                     </tr>`;

                        $('#item-tbl-tBody').append(record);

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                } else {
                    console.warn("Received empty response from server.");
                    $('#item-tbl-tBody').empty();
                    $('#item-tbl-tBody').append('<tr><td colspan="4">No customer found</td></tr>');
                }
            },
            error: (res) => {
                console.error("AJAX error:", res);
            }
        });
    }
});




