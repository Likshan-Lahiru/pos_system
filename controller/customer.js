import CustomerModel from "../model/customerModel.js";
import {customers} from "../db/dataBase.js";


function loadTable(){

    $('#customer-tbl-tBody').empty();
    customers.map((item, index)=>{
        let record = `<tr>
            <td class="customer-id-value">${item.id}</td>
            <td class="customer-name-value">${item.name}</td>
            <td class="customer-address-value">${item.address}</td>
            <td class="customer-salary-value">${item.salary}</td>
        </tr>`;
        $('#customer-tbl-tBody').append(record)
    })
}
$('#register').on('click',()=>{
    console.log("register new Customer");
    var customerId = $('#recipient-id').val();
    var customerName = $('#recipient-name').val();
    var customerAddress = $('#recipient-address').val();
    var customerSalary = $('#recipient-phone').val();

    let customer = new CustomerModel(
        customerId,customerName,customerAddress,customerSalary
    );
    customers.push(customer);

    loadTable();

})