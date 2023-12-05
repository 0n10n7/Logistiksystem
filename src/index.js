import { PollingWatchKind, textChangeRangeIsUnchanged } from "typescript";

const OrderStates = Object.freeze({
	Ordered: Symbol("Ordered"),
	Asigned: Symbol("Asigned"),
	PickedUp: Symbol("PickedUp"),
	Delivering: Symbol("Delivering"),
    Delivered: Symbol("Delivered")
});
const JobTitle = Object.freeze({
	Picker: Symbol("picker"),
	Driver: Symbol("driver"),
	Mix: Symbol("mix")
});
class Order {
    //productType should be Product
    //wareHouseIndex should be an integer
    //picker should be a Worker
    constructor(productType) {
      this.productType = productType;
      this.picker ;
      this.status = 0;
    }
    FindPicker() {
        this.productType.shelfX
        this.productType.warehouseIndex
        let picker = new Worker(picker);
        for(let i =0 ; i < warehouses[this.productType.warehouseIndex].workers.length; i++){
            let worker = warehouses[this.productType.warehouseIndex].workers[i];
            if(worker.orderList.length != 0){
                let lastOrder = worker.orderList[worker.orderList.length-1];
            }
            else{
                
            }
            
            let manhatanDistance = -9;
                tempDistance = (abs(this.productType.shelfX-lastOrder.productType.shelfX) + abs(this.productType.shelfY-lastOrder.productType.shelfY));                
                if(tempDistance < manhatanDistance || manhatanDistance === -9)
                {
                    manhatanDistance = tempDistance;
                }
            
        }
        //calculate distance from a picker to shelf number using manhattan distance.
        //One of the distances needs to be multiplied with 5, either x or y depending on shelf oriantation
        //Distance is calculated from youngest active order asigned to a picker

    }
}
class Worker {
    constructor(job){
        this.jobTitle = job;
        this.orderList = []; 
    }
}
class Product {
    constructor(name,weight,price,shelfX,shelfY,warehouseIndex){
        this.name = name;
        this.weight = weight;
        this.price = price;
        this.shelfX = shelfX;
        this.shelfY = shelfY;
        this.warehouseIndex = warehouseIndex;
    }
}
let warehouses = [];
let products = [];
function CreateWarehouse(name) {
    let warehouse = {
        locationName: name,
        productsInStock: [],
        workers: [],
    };
    warehouses.push(warehouse);
}
function GenerateData(){
    products.push(new Product("Brass: Birmingham", 1000, "800 Kr"));
    products.push(new Product("Brass: Lancashire", 900, "750 Kr"));
    products.push(new Product("Brass: Stoke-on-Trent", 999, "799 Kr"));
    products.push(new Product("Brass: Sevenoaks", 700, "1200 Kr"));
    products.push(new Product("Brass: Tonnebridge", 100, "300 Kr"));
    products.push(new Product("Brass: Exiter", 1-0, "50 Kr"));
    products.push(new Product("Brass: London", 1000, "700 Kr"));
    CreateWarehouse("Bismark");
}

GenerateData();