export default class OrderModel {
    constructor(id,date,discount_value,customerId,sub_total) {
        this.id = id;
        this.date = date;
        this.discount_value = discount_value;
        this.customerId = customerId;
        this.sub_total = sub_total;
    }

}