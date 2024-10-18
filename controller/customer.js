// customerController.js
import CustomerModel from "../model/CustomerModel.js";
import {setCustomerIds, setItemIds} from '../controller/order.js';

const addressPattern = /^[a-zA-Z0-9\s,'-]*$/;
const mobilePattern = /^(?:\+94|94|0)?7\d{8}$/;

initialize();

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
    let customerArray = [];
    $.ajax({
        url: "http://localhost:8080/api/v1/customer",
        type: "GET",
        dataType: "json",
        success: (res) => {
            $('#customer-tbl-tBody').empty();
               customerArray = res;
            setCustomerIds(customerArray);
            res.forEach((customer) => {
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
        }
    });
}

$('#register1').on('click', () => {
    var customerId = $('#customerId').val();
    var customerName = $('#newCustomerName').val();
    var customerAddress = $('#customerAddress').val();
    var customerPhone = $('#customerPhone').val();

    if (customerId === "" || customerName === "" || customerAddress === "" || customerPhone === "") {
        alert("Please fill all fields");
    } else if (!mobilePattern.test(customerPhone)) {
        alert("Please enter a valid phone number");
    } else {
        let customer = new CustomerModel(customerId, customerName, customerAddress, customerPhone);
        let jsonCustomer = JSON.stringify(customer);

        $.ajax({
            url: "http://localhost:8080/api/v1/customer",
            type: "POST",
            data: jsonCustomer,
            contentType: "application/json",
            success: (res) => {
                initialize();
                alert("Customer saved successfully!");
            },
            error: (res) => {
                console.error(res);
                alert("Failed to save customer data.");
            }
        });
    }
});

$("#customerButtonUpdate").on("click", function() {
    var customerName = $('#newCustomerName').val();
    var customerAddress = $('#customerAddress').val();
    var customerPhone = $('#customerPhone').val();
    var customerId = $("#customerId").val();

    if (customerId == "" || customerName == "" || customerAddress == "" || customerPhone == "") {
        alert("Please fill all fields");
    } else if (!mobilePattern.test(customerPhone)) {
        alert("Please enter a valid phone number");
    } else {
        let customer = new CustomerModel(customerId, customerName, customerAddress, customerPhone);
        let jsonCustomer = JSON.stringify(customer);

        $.ajax({
            url: "http://localhost:8080/api/v1/customer",
            type: "PUT",
            data: jsonCustomer,
            contentType: "application/json",
            success: (res) => {
                initialize();
                alert("Customer updated successfully!");
            },
            error: (res) => {
                console.error(res);
                alert("Failed to update customer data.");
            }
        });
    }
});

$('#customer-tbl-tBody').on('click', 'tr', function () {
    let id = $(this).find('.customer-id-value').text();
    let name = $(this).find('.customer-name-value').text();
    let address = $(this).find('.customer-address-value').text();
    let phone = $(this).find('.customer-phone-value').text();

    $('#customerId').val(id);
    $('#newCustomerName').val(name);
    $('#customerAddress').val(address);
    $('#customerPhone').val(phone);
});

$('#customerButtonDelete').on('click', () => {
    var id = $('#customerId').val();
    $.ajax({
        url: "http://localhost:8080/api/v1/customer/" + id,
        type: "DELETE",
        success: (res) => {
            initialize();
            alert("Customer deleted successfully!");
        },
        error: (res) => {
            console.error(res);
            alert("Failed to delete customer data.");
        }
    });
});

$("#searchCustomer").on("input", function() {
    var typedText = $("#searchCustomer").val();
    if (typedText.trim() === "") {
        loadTable();
    } else {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer/" + typedText,
            type: "GET",
            success: (res) => {
                $('#customer-tbl-tBody').empty();
                var record = `<tr>
                    <td class="customer-id-value">${res.customerId}</td>
                    <td class="customer-name-value">${res.customerName}</td>
                    <td class="customer-address-value">${res.customerAddress}</td>
                    <td class="customer-phone-value">${res.customerPhone}</td>
                </tr>`;
                $('#customer-tbl-tBody').append(record);
            },
            error: (res) => {
                console.error("AJAX error:", res);
            }
        });
    }
});
