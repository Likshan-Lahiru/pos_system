import CustomerModel from "../model/customerModel.js";
import {customers} from "../db/dataBase.js";
import {setCustomerIds} from '../controller/order.js';

const addressPattern = /^[a-zA-Z0-9\s,'-]*$/
const mobilePattern = /^(?:\+94|94|0)?7\d{8}$/

var recordIndex;

initialize()

function initialize() {
    $.ajax({
        url: "http://localhost:8080/api/v1/customer/genCusID",
        type: "GET",
        success: (res) => {

            $('#customerId').val(res);
        },
        error: (res) => {
            console.error(res);
        }
    });

    setTimeout(() => {
        loadTable();
    }, 1000);
}

function loadTable() {
    let customersArray = [];
    $.ajax({
        url: "http://localhost:8080/api/v1/customer",
        type: "GET",
        dataType: "json",
        success: (res) => {
            console.log(res);
             customersArray = res;
            console.log(customersArray);

            setCustomerIds(customersArray);

            customersArray.forEach((customer, index) => {

                var record = `<tr>
                 <td class="customer-id-value">${customer.customerId}</td>
                 <td class="customer-name-value">${customer.customerName}</td>
                 <td class="customer-address-value">${customer.customerAddress}</td>
                 <td class="customer-phone-value">${customer.customerPhone}</td>
            </tr>`;

                $('#customer-tbl-tBody').append(record);
            });

        },
        error: (res) => {
            console.error("Failed to load customers:", res);
            customAlert("Failed to load customers.", 'assets/alert/alert-error.gif'); // Optional
        }
    });
}

$('#register1').on('click', () => {
    var customerId = $('#customerId').val();
    var customerName = $('#newCustomerName').val();
    var customerAddress = $('#customerAddress').val();
    var customerPhone = $('#customerPhone').val();

    console.log(customerId, customerName, customerAddress, customerPhone);

    if (customerId === "" || customerName === "" || customerAddress === "" || customerPhone === "") {
        customAlert("Please fill all the fields", 'assets/alert/alert-blink.gif');
    } else if (!mobilePattern.test(customerPhone)) {
        customAlert("Please enter a valid phone number", 'assets/alert/alert-blink.gif');
    } else {
        let customer = new CustomerModel(
            customerId, customerName, customerAddress, customerPhone
        );
        let jsonCustomer = JSON.stringify(customer);
        console.log(jsonCustomer);

        $.ajax({
            url: "http://localhost:8080/api/v1/customer",
            type: "POST",
            data: jsonCustomer,
            contentType: "application/json",
            success: (res) => {
                initialize();

                $('#customerButtonReset').click();
                console.log(JSON.stringify(res));
                Swal.fire({
                    title: "Customer saved successfully!",
                    text: JSON.stringify(),
                    icon: "success"
                });
            },
            error: (res) => {
                console.error(res);
                customAlert("Failed to save customer data.", 'assets/alert/alert-blink.gif');
            }
        });
    }
});

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
            url: "http://localhost:8080/api/v1/customer",
            type: "PUT",
            data: jsonCustomer,
            headers: { "Content-Type": "application/json" },
            success: (res) => {
                initialize();
                $('#customerButtonReset').click();
                console.log(JSON.stringify(res));
                Swal.fire({

                     title: "Customer Updated successfully!",
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


    if (typedText.trim() === "") {
        loadTable();
    } else {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer/" + typedText,
            type: "GET",
            data: "json",
            success: (res) => {
                console.log(res);

                if (res) {
                    try {


                        $('#customer-tbl-tBody').empty();

                        var record = `<tr>
                        <td class="customer-id-value">${res.customerId}</td>
                        <td class="customer-name-value">${res.customerName}</td>
                         <td class="customer-address-value">${res.customerAddress}</td>
                         <td class="customer-phone-value">${res.customerPhone}</td>
                         </tr>`;

                        $('#customer-tbl-tBody').append(record);

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                } else {
                    console.warn("Received empty response from server.");
                    $('#customer-tbl-tBody').empty();
                    $('#customer-tbl-tBody').append('<tr><td colspan="4">No customer found</td></tr>');
                }
            },
            error: (res) => {
                console.error("AJAX error:", res);
            }
        });
    }
});

$('#customerButtonDelete').on('click',  () => {

    var id = $('#customerId').val();
    $.ajax({

        url: "http://localhost:8080/api/v1/customer/" + id,
        type: "DELETE",
        success: (res) => {
            initialize();
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
    $('#customerButtonReset').click();
    loadTable();
})
