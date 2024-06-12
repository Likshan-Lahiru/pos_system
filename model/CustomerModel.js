export default class customerModel{
    constructor(id,name,address,salary) {
        this._id = id;
        this._name = name;
        this._address = address;
        this._salary = salary;
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get address(){
        return this._address;
    }
    get salary(){
        return this._salary;
    }
    set id(id){
        this._id = id;
    }
    set name(name){
        this._name = name;
    }
    set address(address){
        this._address = address;
    }
    set salary(salary){
        this._salary = salary;
    }


}