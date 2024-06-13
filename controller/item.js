import ItemModel from '../model/ItemModel.js';
import {items} from '../db/dataBase.js';

var recordIndex;

initialize()

function initialize() {
    loadTable();

}

function loadTable() {

    $('#item-tbl-tBody').empty();
    items.map((item, index)=>{
        let record = `<tr>
             <td class="item-code-value">${item.itemCode}</td>
             <td class="item-name-value">${item.itemName}</td>
             <td class="item-price-value">${item.itemPrice}</td>
             <td class="item-qty-value">${item.itemQty}</td>
         </tr>`;
        $('#item-tbl-tBody').append(record);
    })

}
$('#newItem').on('click', ()=>{
    console.log("New Item save")
   var itemCode = $('#ItemId').val();
   var itemName = $('#ItemName').val();
   var itemPrice = $('#ItemPrice').val();
   var itemQty = $('#ItemQty').val();
    console.log(itemCode)

   let item = new ItemModel(itemCode, itemName, itemPrice, itemQty
   );
   items.push(item);

   loadTable();
   $('#item-reset').click();

});