import { read } from "fs";
import { stringify } from "querystring";
import { PollingWatchKind, textChangeRangeIsUnchanged } from "typescript";
import { Elysia } from "elysia";
//import mongoose,{ Mongoose} from "mongoose";

const uri = "mongodb+srv://0n10n7:<password>@cluster0.bumepuf.mongodb.net/?retryWrites=true&w=majority";
//Mongoose.connect(uri);

const server = new Elysia();

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
      this.status = OrderStates.Ordered;
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
    constructor(job,name){
        this.jobTitle = job;
        this.orderList = []; 
        this.schedule = [];
        this.name = name;
    }
    //Should add foolproofing, making sure that there isnt overlap in the schedule
    CreateSchedule(repeat,shiftStart,shiftEnd){
        let scheduleElement = {
            shiftStart : shiftStart%604800000,
            shiftEnd : shiftEnd%604800000,
            repeat: repeat,
        }
        this.schedule.push(scheduleElement);
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
const file = Bun.file("src/boardgames_ranks.csv");
const namntab11File = Bun.file("src/be0001namntab11-2022.csv");
const namntab12File = Bun.file("src/be0001namntab12-2022.csv");


let input = await file.text();
let boardgames  = [];
let boardgamesRaw = input.split("\n");
for(let i = 0; i< boardgamesRaw.length; i ++){
    let rowArray = boardgamesRaw[i].split(",");
    let boardgame = {
        id: rowArray[0],
        name: rowArray[1],
        yearpublished: rowArray[2],
        rank : rowArray[3],
        bayesaverage: rowArray[4],
        average: rowArray[5],
        userrated: rowArray[6],
        abstracts_rank: rowArray[7],
        cgs_rank: rowArray[8],
        childrensgames_rank: rowArray[9],
        familygames_rank: rowArray[10],
        partygames_rank: rowArray[11],
        strategygames_rank: rowArray[12],
        thematic_rank: rowArray[13],
        wargames_rank: rowArray[14],
    };
    boardgames.push(boardgame);
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

input = await namntab11File.text();
let namntab11 = input.split("\n");
input = await namntab12File.text();
let namntab12 = input.split("\n");

function GenerateData(){
    let shelfYCounter = 0;
    let warehouseIndexCounter = 0;
    let workerAmount = 60;
    let workerSplit = 2; // 1/workersplit = fraction of working pop that is named after the female names list
    CreateWarehouse(`Location ${warehouseIndexCounter}`);
    for(let i = 0; i < boardgames.length; i++){
        if(i%60 === 0){
            shelfYCounter++;
        }
        if(shelfYCounter%120 === 0 && i%60 === 0){
            warehouseIndexCounter++;
            CreateWarehouse(`Location ${warehouseIndexCounter}`);
        }
        let product = new Product(boardgames[i].name,Math.floor(Math.random()* 1000 + 250),Math.floor(Math.random()* 5010 + 450),i%60,shelfYCounter%120,warehouseIndexCounter);
        warehouses[warehouseIndexCounter].productsInStock.push(product);
        products.push(product);
    }
    workerAmount *= warehouseIndexCounter;
    for (let i = 0; i < workerAmount; i++) {
        let readName = "";
        if(i % workerSplit === 0){
            readName = namntab11[Math.floor(Math.random()* namntab11.length)];
            readName = readName.split(",")[0];
            readName = readName.replaceAll(`"`,"");
        }
        else{
            readName = namntab12[Math.floor(Math.random()* namntab12.length)];
            readName = readName.split(",")[0];
            readName = readName.replaceAll(`"`,"");
        }
        let worker;
        if(i%5 === Math.floor(Math.random()* 5)){
            worker = new Worker(JobTitle.Driver,readName)
        }
        else{
            worker = new Worker(JobTitle.Picker,readName)
        }
        let randomTime = Math.floor(Math.random()* 86400000 * 7);
        for(let j = 1; j <= 7; j++){
            let shiftLength = Math.floor(Math.random()* 86400000 / Math.floor(Math.random()* 6)+6);
            worker.CreateSchedule(true,new Date(Date.now() + randomTime * j),new Date(Date.now() + (randomTime * j)+shiftLength))
        }
        warehouses[i%warehouseIndexCounter+1].workers.push(worker);
    }
    // products.push(new Product("Brass: Birmingham", 1000, "800 Kr"));
    // products.push(new Product("Brass: Lancashire", 900, "750 Kr"));
    // products.push(new Product("Brass: Stoke-on-Trent", 999, "799 Kr"));
    // products.push(new Product("Brass: Sevenoaks", 700, "1200 Kr"));
    // products.push(new Product("Brass: Tonnebridge", 100, "300 Kr"));
    // products.push(new Product("Brass: Exiter", 1-0, "50 Kr"));
    // products.push(new Product("Brass: London", 1000, "700 Kr"));
    // CreateWarehouse("Bismark");
    // for(let i = 0; i < warehouses.length; i++){
    //     console.log(warehouses[i]);
    // }
    //console.log(warehouses);
    Bun.write("src/data.json",JSON.stringify(warehouses));
}

function Working(time,warehouseIndex){
    console.log("These people are working")
    let workersWorking = [];
    let warehouse = warehouses[warehouseIndex];
    for (let i = 0; i < warehouse.workers.length; i++) {
        
        let worker = warehouse.workers[i];
        let working = false;
        for (let i = 0; i < worker.schedule.length; i++) {
            let scheduleElement = worker.schedule[i];
            if(Number(scheduleElement.shiftStart) > time%604800000 && Number(scheduleElement.shiftEnd< time%604800000)){
                working = true;
            }
        }
        if(working){
            workersWorking.push(worker);
        }
    }
    console.log(workersWorking);
    return workersWorking;
}

GenerateData();
for(let i = 0; i < warehouses.length; i ++){
    Working(Date.now(),i);
}
