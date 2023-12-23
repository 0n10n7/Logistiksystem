import { read } from "fs";
import { stringify } from "querystring";
import { PollingWatchKind, textChangeRangeIsUnchanged } from "typescript";
import { Elysia } from "elysia";

//import mongoose,{ Mongoose} from "mongoose";

const uri = "mongodb+srv://0n10n7:<password>@cluster0.bumepuf.mongodb.net/?retryWrites=true&w=majority";
//Mongoose.connect(uri);

const server = new Elysia();
server.listen(8080);

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
    constructor(productType,orderDate) {
      this.productType = productType;
      this.picker ;
      this.status = OrderStates.Ordered;
      this.orderDate = orderDate;
    }
    FindPicker() {
        this.status=OrderStates.Asigned;
        this.productType.shelfX
        this.productType.warehouseIndex
        let picker;
        let manhatanDistance = -9;
        let workersOnShitf = Working(Date.now(),this.productType.warehouseIndex)
        for(let i =0 ; i < workersOnShitf.length; i++){
            let worker = workersOnShitf[i];
            if(worker.orderList.length != 0){
                let lastOrder = worker.orderList[worker.orderList.length-1];
                
                tempDistance = (abs(this.productType.shelfX-lastOrder.productType.shelfX) + abs(this.productType.shelfY-lastOrder.productType.shelfY));                
                if(tempDistance < manhatanDistance || manhatanDistance === -9)
                {
                    manhatanDistance = tempDistance;
                    picker = worker;
                }
            }
            else{
                picker = worker;
                break;
            }
        }
        //calculate distance from a picker to shelf number using manhattan distance.
        //One of the distances needs to be multiplied with 5, either x or y depending on shelf oriantation
        //Distance is calculated from youngest active order asigned to a picker

    }
}
class Purchase{
    constructor(){
        this.orderDate = Date.now();
        this.completionDate;
        this.orders=[];
        this.price=0;
    }
    AddOrder(order){
        this.orders.push(order);
        this.price+=order.productType.price;
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
            shiftStart : new Date(shiftStart%604800000),
            shiftEnd : new Date (shiftEnd%604800000),
            repeat: repeat,
        }
        this.schedule.push(scheduleElement);
    }
}
class Product {
    constructor(name,weight,price,shelfX,shelfY,warehouseIndex,inStock){
        this.name = name;
        this.weight = weight;
        this.price = price;
        this.shelfX = shelfX;
        this.shelfY = shelfY;
        this.warehouseIndex = [];
        this.warehouseIndex[0] = warehouseIndex;
        this.inStock = inStock;
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
function GeneratePurchase(){
    let generatedPurchase = new Purchase();
    let randomYear = Math.round(Math.random()*2 + 2021);
    let randomMonth = Math.round(Math.random()*12);
    let randomDate = Math.round(Math.random()*30 + 1);//Overflow is fine it just carries over to the next month
    let randomHour = Math.round(Math.random()*24);
    let randomMinuteAndSecond = Math.round(Math.random()*60);
    for(let i = 0; i < Math.floor(Math.random()* 12 + 2); i ++){
        let randomProductType = products[Math.floor(Math.random() * products.length)];
        let generatedOrder = new Order(randomProductType,new Date(randomYear,randomMonth,randomDate,randomHour,randomMinuteAndSecond,randomMinuteAndSecond));
        generatedOrder.FindPicker();
        generatedPurchase.AddOrder(generatedOrder); 
    }
    //this will create some orders that where placed in the future (Untill after 31st of december 2023)
    
    generatedPurchase.orderDate = new Date(randomYear,randomMonth,randomDate,randomHour,randomMinuteAndSecond,randomMinuteAndSecond);
    purchases.push(generatedPurchase);
}
let purchases = [];
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
        let product = new Product(boardgames[i].name,Math.floor(Math.random()* 1000 + 250),Math.floor(Math.random()* 5010 + 450),i%60,shelfYCounter%120,warehouseIndexCounter,Math.floor(Math.random()*50 + 12));
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
    for (let i = 0; i < 2000; i++) {
        GeneratePurchase();
    }
    Bun.write("src/data.json",JSON.stringify(warehouses));
    Bun.write("src/orders.json",JSON.stringify(purchases));
    console.log("Generated Data");
}

function Working(time,warehouseIndex){
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
    return workersWorking;
}
function ProductsInStock(){
    let productsInStockCurrently = [];
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        if(product.inStock > 0){
            productsInStockCurrently.push(product);
        }
    }
    return productsInStockCurrently;
}
function CompletedPurchases(){
    let completedPurchases = [];
    for (let i = 0; i < purchases.length; i++) {
        let purchase = purchases[i];
        if(typeof(purchase.completionDate) == Date){
            completedPurchases.push(purchase);
        }
    }
    return completedPurchases;
}
GenerateData();

//Endpoints

server.get("/Working/:warehouseIndex/:day", async ({ params }) => {
    console.log("Working today");
    let arr = warehouses[params.warehouseIndex].workers;
    let workersWorkingDay = [];
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    if (!days.includes(params.day)) {
        return `'${params.day}' is not a valid day`
    }

    //arr = arr.filter(e => e.schedule[days.indexOf(params.day)]);
    for (let i = 0; i < arr.length; i++) {
        let worker = arr[i];
        for(let j= 0; j < worker.schedule.length; j++){
            try {
                if(days[worker.schedule[j].shiftStart.getDay()] == params.day || days[worker.schedule[j].shiftEnd.getDay()] == params.day){
                    workersWorkingDay.push(worker);
                    break;
                }
            } catch (error) {
                //Janky solution to a problem in the data generation
                console.log("this one is one of the incorectly generated ones");
            }
        }
    }
    if (workersWorkingDay.length === 0) {
        return `No employees working on ${params.day}s`;
    }

    return workersWorkingDay;
});
//Wokrers working att a given warehouse
server.get("Working/:warehouseIndex", async ({ params }) => {
    console.log("Working in ", params.warehouseIndex, "called")
    return warehouses[params.warehouseIndex].workers;
});
//Working currently at a given warehouse
server.get("/Working/now/:warehouseIndex", async ({ params }) => {
    console.log("Working now in " , params.warehouseIndex, "called");
    return Working(Date.now(),params.warehouseIndex)
});
server.get("/Productsinstock/All" , async()=> {
    console.log("prodcuts in stock called");
    return ProductsInStock();
});
server.get("/Productsinstock/:productName", async({ params })=> {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        if(product.name == params.productName){
            return product;
        }
    }
    return "Product doesnt exsist";
});
server.get("/pickers/without/:param", async({params}) => {
    let withoutOrder =[];
    for (let i = 0; i < warehouses.length; i++) {
        const warehouse = warehouses[i];
        for (let j = 0; j < warehouse.workers.length; j++) {
            const worker = warehouse.workers[j];
            if(worker.orderList.length == 0 && worker.jobTitle === JobTitle.Picker){
                withoutOrder.push(worker);
            }
        }
    }
    return withoutOrder;
});
server.get("/Orderstobe/picked", async({params}) => {
    let toBePicked =[];
    for (let i = 0; i < purchases.length; i++) {
        const purchase = purchases[i];
        for (let j = 0; j < purchase.orders.length; j++) {
            const order = purchase.orders[j];
            if(order.status === OrderStates.Asigned){
                toBePicked.push(order);
            }
        }
    }
    return toBePicked;
});
server.get("/Orderstobe/driven/:oldestOrAll", async({params}) => {
    let toBeDriven =[];
    let oldest;
    let oldestOrder;
    for (let i = 0; i < purchases.length; i++) {
        const purchase = purchases[i];
        for (let j = 0; j < purchase.orders.length; j++) {
            const order = purchase.orders[j];
            if(order.status === OrderStates.PickedUp){
                toBeDriven.push(order);
                if(order.orderDate < oldest || typeof(oldest) == undefined){
                    oldest = order.orderDate;
                    oldestOrder=order;
                }
            }
        }
    }
    if(params.oldestOrAll == "oldest"){
        console.log(oldestOrder);
        return oldestOrder;
    }
    return toBeDriven;
});
server.get("/orders/:month/:totalOrSingle", async({params}) => {
    const months = [
        "january",
        "febuary",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
    ];

    if (!months.includes(params.month)) {
        return `'${params.month}' is not a valid month`
    }
    let completedPurchases = CompletedPurchases();
    if(params.totalOrSingle == "total"){
        let totalPrice = 0;
        for (let i = 0; i < completedPurchases.length; i++) {
            let purchase = completedPurchases[i];
            totalPrice += purchase.price;
        }
        return totalPrice;
    }
    else if(params.totalOrSingle == "priciest"){
        let priciest = 0;
        let priciestPurchase;
        for (let i = 0; i < completedPurchases.length; i++) {
            let purchase = completedPurchases[i];
            if(purchase.price > priciest){
                priciest = purchase.price;
                priciestPurchase = purchase;
            }
        }
        return priciestPurchase;
    }
    else{
        return `'${params.totalOrSingle}' is not valid, put total or priciest`
    }
});