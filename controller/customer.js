import CustomerModel from "../model/customerModel.js";
import {customers} from "../db/dataBase.js";
import {setCustomerIds} from '../controller/order.js';

const addressPattern = /^[a-zA-Z0-9\s,'-]*$/
const mobilePattern = /^(?:\+94|94|0)?7\d{8}$/

var recordIndex;

initialize()

function initialize() {
    $.ajax({
        url: "http://localhost:8080/pos/customer",
        type: "GET",
        data: {"nextid": "nextid"},
        success: (res) => {
            let code = res.substring(1, res.length - 1);
            $('#customerId').val(code);
        },
        error: (res) => {
            console.error(res);
        }
    });

    setTimeout(() => {
        loadTable();
    },1000)
}


function loadTable(){

    $('#customer-tbl-tBody').empty();
    let customersArray = [];

    $.ajax({
        url: "http://localhost:8080/pos/customer",
        type: "GET",
        data: {"all": "getAll"},
        success: (res) => {
            console.log(res);
            customersArray = JSON.parse(res);
            console.log(customersArray);

            setCustomerIds(customersArray);

            customersArray.map((customer, index) => {

                var record = `<tr>
                     <td class="customer-id-value">${customer.id}</td>
                     <td class="customer-name-value">${customer.name}</td>
                     <td class="customer-address-value">${customer.address}</td>
                     <td class="customer-phone-value">${customer.contact}</td>
                </tr>`;

                $('#customer-tbl-tBody').append(record);
            });

        },
        error: (res) => {
            console.error(res);
        }
    });
}

$('#register1').on('click',()=>{

    var customerId = $('#customerId').val();
    var customerName = $('#newCustomerName').val();
    var customerAddress =$('#customerAddress').val();
    var customerPhone =  $('#customerPhone').val();

    console.log(customerId, customerName, customerAddress, customerPhone);



    if (customerId == "" || customerName == "" || customerAddress == "" || customerPhone == "") {
       customAlert("Please fill all the fields",'assets/alert/alert-blink.gif');
    } else if (!mobilePattern.test(customerPhone)) {
        customAlert("Please enter a valid phone number",'assets/alert/alert-blink.gif');
    } else {
        let customer = new CustomerModel(
            customerId,customerName,customerAddress,customerPhone
        );
        let jsonCustomer = JSON.stringify(customer);
        console.log(jsonCustomer);

        $.ajax({
            url: "http://localhost:8080/pos/customer",
            type: "POST",
            data: jsonCustomer,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                loadTable();
                initialize();
                $('#customerButtonReset').click();
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

    }



})
$("#customerButtonUpdate").on("click", function() {
    console.log("update customer details")

    var newCustomerName = $('#newCustomerName').val();
    var customerAddress = $('#customerAddress').val();
    var customerPhone = $('#customerPhone').val();
    var customerId = $("#customerId").val();


    if (customerId == "" || customerName == "" || customerAddress == "" || customerPhone == "") {
        customAlert("Please fill all the fields",'assets/alert/alert-blink.gif');
    } else if (!mobilePattern.test(customerPhone)) {
        customAlert("Please enter a valid phone number",'assets/alert/alert-blink.gif');
    } else {
        let customer = new CustomerModel(
            customerId,newCustomerName,customerAddress,customerPhone
        );
        let jsonCustomer = JSON.stringify(customer);
        console.log(jsonCustomer);

        $.ajax({
            url: "http://localhost:8080/pos/customer",
            type: "PUT",
            data: jsonCustomer,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                $('#customerButtonReset').click();
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




        setTimeout(() => {
            initialize();
        },1000)
    }




});

$('#customer-tbl-tBody').on('click','tr', function () {
    recordIndex = $(this).index();
    let id = $(this).find('.customer-id-value').text();
    let name = $(this).find('.customer-name-value').text();
    let address = $(this).find('.customer-address-value').text();
    let phone = $(this).find('.customer-phone-value').text();

    console.log("Customer id: ",id);
    console.log(recordIndex)

    $('#customerId').val(id);
    $('#newCustomerName').val(name);
    $('#customerAddress').val(address);
    $('#customerPhone').val(phone);
});

$("#searchCustomer").on("input", function() {
    var typedText = $("#searchCustomer").val();
    customers.map((customer, index) => {
        if (typedText == "") {
            loadTable()
        }

        if (typedText == customer.id) {
            var select_index = index;

            $('#customer-tbl-tBody').empty();

            var record = `<tr>
                <td class="customer-id-value">${customers[select_index].id}</td>
                <td class="customer-name-value">${customers[select_index].name}</td>
                <td class="customer-address-value">${customers[select_index].address}</td>
                <td class="customer-phone-value">${customers[select_index].phone}</td>
            </tr>`;

            $('#customer-tbl-tBody').append(record);
        }
    })
});

$("#customerButtonDelete").on('click', () => {
    customers.splice(recordIndex, 1);
    loadTable();
    $("#customerButtonReset").click();
});





