import ItemModel from '../model/ItemModel.js';
import { items} from '../db/dataBase.js';
import {setItemIds} from '../controller/order.js';

const regexPrice = /^\d+$/

var recordIndex;

initialize()

function initialize() {
    $.ajax({
        url: "http://localhost:8080/pos/item",
        type: "GET",
        data: {"nextid": "nextid"},
        success: (res) => {
            let code = res.substring(1, res.length - 1);
            $('#ItemId').val(code);
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
        url: "http://localhost:8080/pos/item",
        type: "GET",
        data: {"all": "getAll"},
        success: (res) => {
            console.log(res);
            itemArray = JSON.parse(res);
            console.log(itemArray);

            setItemIds(itemArray);

            itemArray.map((item, index) => {

                let record = `<tr>
             <td class="item-code-value">${item.id}</td>
             <td class="item-name-value">${item.name}</td>
             <td class="item-price-value">${item.unitPrice}</td>
             <td class="item-qty-value">${item.qty}</td>
             </tr>`;
                $('#item-tbl-tBody').append(record);
            });

        },
        error: (res) => {
            console.error(res);
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
            url: "http://localhost:8080/pos/item",
            type: "POST",
            data: jsonItem,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                loadTable();
                $('#item-reset').click();
                console.log(JSON.stringify(res));
                Swal.fire({
                    title: JSON.stringify(res),
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
            url: "http://localhost:8080/pos/item",
            type: "PUT",
            data: jsonItem,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                console.log(JSON.stringify(res));
                Swal.fire({
                    title: JSON.stringify(res),
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

        $('#reset').click();

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
        url: "http://localhost:8080/pos/item?id=" + id,
        type: "DELETE",
        success: (res) => {
            console.log(JSON.stringify(res));
            Swal.fire({
                title: JSON.stringify(res),
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
    var typedText = $("#searchItem").val();

    if (typedText.trim() === "") {
        loadTable();
    } else {
        $.ajax({
            url: "http://localhost:8080/pos/item",
            type: "GET",
            data: {"id": typedText},
            success: (res) => {
                console.log(res);

                if (res) {
                    try {
                        let items;

                        if (typeof res === 'string') {
                            items = JSON.parse(res);
                        } else {
                            items = res;
                        }
                        console.log('Parsed items:', items);

                        $('#item-tbl-tBody').empty();

                        if (Array.isArray(items)) {
                            items.forEach((item) => {
                                var record = `<tr>
                                    <td class="item-code-value">${item.id}</td>
                                    <td class="item-name-value">${item.name}</td>
                                    <td class="item-price-value">${item.unitPrice}</td>
                                    <td class="item-qty-value">${item.qty}</td>
                                </tr>`;
                                $('#item-tbl-tBody').append(record);
                            });
                        } else if (typeof items === 'object') {
                            var record = `<tr>
                                <td class="item-code-value">${items.id}</td>
                                <td class="item-name-value">${items.name}</td>
                                <td class="item-price-value">${items.unitPrice}</td>
                                <td class="item-qty-value">${items.qty}</td>
                            </tr>`;
                            $('#item-tbl-tBody').append(record);
                        } else {
                            console.warn('Unexpected response format');
                            $('#item-tbl-tBody').append('<tr><td colspan="4">No items found</td></tr>');
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        $('#item-tbl-tBody').empty();
                        $('#item-tbl-tBody').append('<tr><td colspan="4">Error processing data</td></tr>');
                    }
                } else {
                    console.warn('Received empty response from server.');
                    $('#item-tbl-tBody').empty();
                    $('#item-tbl-tBody').append('<tr><td colspan="4">No items found</td></tr>');
                }
            },
            error: (res) => {
                console.error('AJAX error:', res);
                $('#item-tbl-tBody').empty();
                $('#item-tbl-tBody').append('<tr><td colspan="4">Error retrieving data</td></tr>');
            }
        });
    }
});




