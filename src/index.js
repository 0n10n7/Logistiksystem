import { read } from "fs";
import { stringify } from "querystring";
import { PollingWatchKind, textChangeRangeIsUnchanged } from "typescript";
import { Elysia } from "elysia";
import { OrderDB } from "/Users/kokeritz.mikael/Logistiksystem/src/orders.js";
import { WorkerDB } from "/Users/kokeritz.mikael/Logistiksystem/src/workers.js";
import { WarehouseDB } from "/Users/kokeritz.mikael/Logistiksystem/src/warehouse.js";
import { ProductDB } from "/Users/kokeritz.mikael/Logistiksystem/src/products.js";


import mongoose,{ Mongoose} from "mongoose";

const uri ="mongodb+srv://0n10n7:8JpfcZWlBUFiGWq1@cluster0.bumepuf.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);

const server = new Elysia();
server.listen(8080);

const OrderStates = Object.freeze({
  Ordered: "Ordered",
  Asigned: "Asigned",
  PickedUp: "PickedUp",
  Delivering: "Delivering",
  Delivered: "Delivered",
});
const JobTitle = Object.freeze({
  Picker: "picker",
  Driver: "driver",
  Mix: "mix",
});
class Order {
  //productType should be Product
  //wareHouseIndex should be an integer
  //picker should be a Worker
  constructor(productType, orderDate) {
    this.productType = productType;
    this.worker;
    this.status = OrderStates.Ordered;
    this.orderDate = orderDate;
  }
  FindPicker() {
    this.status = OrderStates.Asigned;
    this.productType.shelfX;
    this.productType.warehouseIndex;
    let manhatanDistance = -9;
    let workersOnShitf = Working(Date.now(), this.productType.warehouseIndex);
    for (let i = 0; i < workersOnShitf.length; i++) {
      let worker = workersOnShitf[i];
      if (worker.jobTitle != JobTitle.Driver) {
        if (worker.orderList.length != 0) {
          let lastOrder = worker.orderList[worker.orderList.length - 1];
          let tempDistance = Math.abs(this.productType.shelfX - lastOrder.productType.shelfX) + Math.abs(this.productType.shelfY - lastOrder.productType.shelfY);
          if (tempDistance < manhatanDistance || manhatanDistance == -9) {
            manhatanDistance = tempDistance;
            this.worker = worker;
          }
        } else {
          this.worker = worker;
          break;
        }
      }
    }
    if(!this.worker){
      this.worker="N/A";
    }
    this.worker.orderList.push(this);
  }
  FindDriver() {
    this.status = OrderStates.Delivering;
    let workersOnShitf = Working(Date.now(), this.productType.warehouseIndex);
    let fewestOrders = -1;
    for (let i = 0; i < workersOnShitf.length; i++) {
      let worker = workersOnShitf[i];
      if (worker.jobTitle != JobTitle.Picker) {
        if (worker.orderList.length != 0) {
          if (worker.orderList.length < fewestOrders || fewestOrders === -1) {
            this.worker = worker;
          }
        } else {
          this.worker = worker;
          break;
        }
      }
    }
    this.worker.orderList.push(this);
  }
}
class Purchase {
  constructor() {
    this.orderDate = Date.now();
    this.completionDate;
    this.orders = [];
    this.price = 0;
  }
  AddOrder(order) {
    this.orders.push(order);
    this.price += order.productType.price;
  }
}
class Worker {
  constructor(job, name) {
    this.jobTitle = job;
    this.orderList = [];
    this.schedule = [];
    this.name = name;
  }
  //Should add foolproofing, making sure that there isnt overlap in the schedule
  CreateSchedule(repeat, shiftStart, shiftEnd) {
    let scheduleElement = {
      shiftStart: new Date(shiftStart % 604800000),
      shiftEnd: new Date(shiftEnd % 604800000),
      repeat: repeat,
    };
    this.schedule.push(scheduleElement);
  }
}
class Product {
  constructor(name, weight, price, shelfX, shelfY, warehouseIndex, inStock) {
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
let boardgames = [];
let boardgamesRaw = input.split("\n");

//for (let i = 0; i < boardgamesRaw.length; i++) {
for (let i = 0; i < 500; i++) {
  let rowArray = boardgamesRaw[i].split(",");
  let boardgame = {
    id: rowArray[0],
    name: rowArray[1],
    yearpublished: rowArray[2],
    rank: rowArray[3],
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
async function GeneratePurchase() {
  let generatedPurchase = new Purchase();
  let orderDB = new OrderDB();
  let randomYear = Math.round(Math.random() * 2 + 2021);
  let randomMonth = Math.round(Math.random() * 12);
  let randomDate = Math.round(Math.random() * 30 + 1); //Overflow is fine it just carries over to the next month
  let randomHour = Math.round(Math.random() * 24);
  let randomMinuteAndSecond = Math.round(Math.random() * 60);
  for (let i = 0; i < Math.floor(Math.random() * 12 + 2); i++) {
    let randomProductType =
      products[Math.floor(Math.random() * products.length)];
    let generatedOrder = new Order(
      randomProductType,
      new Date(
        randomYear,
        randomMonth,
        randomDate,
        randomHour,
        randomMinuteAndSecond,
        randomMinuteAndSecond
      )
    );
    generatedOrder.FindPicker();
    if (i % 3 == 0) {
      generatedOrder.status = OrderStates.PickedUp;
    }
    if (i % 4 == 0) {
      generatedOrder.FindDriver();
    }
    if (i % 5 == 0) {
      generatedOrder.worker = "N/A";
      generatedOrder.status = OrderStates.Delivered;
    }
    if(generatedOrder.worker != "N/A"){
      orderDB.orders.push({
        productType: await ProductDB.findOne({name: generatedOrder.productType.name}),
        worker: await WorkerDB.findOne({name: generatedOrder.worker.name}),
        status: generatedOrder.status,
        orderDate: generatedOrder.orderDate
      });
      let orderWorker = await WorkerDB.findById(orderDB.orders[orderDB.orders.length-1].worker);
      orderWorker.orderList.push(orderDB.orders[orderDB.orders.length-1].id);
      orderWorker.isNew = false;
      orderWorker.save();
    }
    else{
      orderDB.orders.push({
        productType: await ProductDB.findOne({name: generatedOrder.productType.name}),
        worker: null,
        status: generatedOrder.status,
        orderDate: generatedOrder.orderDate
      });
    }
    
    
    generatedPurchase.AddOrder(generatedOrder);
  }
  //this will create some orders that where placed in the future (Untill after 31st of december 2023)

  generatedPurchase.orderDate = new Date(
    randomYear,
    randomMonth,
    randomDate,
    randomHour,
    randomMinuteAndSecond,
    randomMinuteAndSecond
  );
  if (Math.floor(Math.random() * 3) % 2 == 0) {
    generatedPurchase.completionDate = new Date(
      randomYear,
      randomMonth + 1,
      randomDate,
      randomHour,
      randomMinuteAndSecond,
      randomMinuteAndSecond
    );
  }
  
  orderDB.orderDate = generatedPurchase.orderDate;
  orderDB.price = generatedPurchase.price;
  if(typeof(generatedPurchase.completionDate) == Date){
    orderDB.completionDate = generatedPurchase.completionDate;
  }
  await orderDB.save();
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

async function GenerateData() {
  //Drops the previous data
  await WorkerDB.collection.drop();
  await OrderDB.collection.drop();
  await ProductDB.collection.drop();
  await WarehouseDB.collection.drop();

  let shelfYCounter = 0;
  let warehouseIndexCounter = 0;
  let workerAmount = 60;
  let workerSplit = 2; // 1/workersplit = fraction of working pop that is named after the female names list
  CreateWarehouse(`Location ${warehouseIndexCounter}`);
  let warehouseDB = new WarehouseDB({locationName: `Location ${warehouseIndexCounter}`});
  for (let i = 0; i < boardgames.length; i++) {
    if (i % 60 === 0) {
      shelfYCounter++;
    }
    if (shelfYCounter % 120 === 0 && i % 60 === 0) {
      warehouseIndexCounter++;
      CreateWarehouse(`Location ${warehouseIndexCounter}`);
      await warehouseDB.save();
      warehouseDB = new WarehouseDB({locationName: `Location ${warehouseIndexCounter}`});
    }
    let product = new Product(
      boardgames[i].name,
      Math.floor(Math.random() * 1000 + 250),
      Math.floor(Math.random() * 5010 + 450),
      i % 60,
      shelfYCounter % 120,
      warehouseIndexCounter,
      Math.floor(Math.random() * 50 + 12)
    );
    const productDB = new ProductDB(product);
    await productDB.save();
    warehouses[warehouseIndexCounter].productsInStock.push(product);
    warehouseDB.productsInStock.push(productDB.id);
    products.push(product);
  }
  await warehouseDB.save();
  workerAmount *= warehouseIndexCounter + 1;
  for (let i = 0; i < workerAmount; i++) {
    let readName = "";
    if (i % workerSplit === 0) {
      readName = namntab11[Math.floor(Math.random() * namntab11.length)];
      readName = readName.split(",")[0];
      readName = readName.replaceAll(`"`, "");
    } else {
      readName = namntab12[Math.floor(Math.random() * namntab12.length)];
      readName = readName.split(",")[0];
      readName = readName.replaceAll(`"`, "");
    }
    let worker;
    if (i % 5 === Math.floor(Math.random() * 5)) {
      worker = new Worker(JobTitle.Driver, readName);
    } else {
      worker = new Worker(JobTitle.Picker, readName);
    }
    let randomTime = Math.floor(Math.random() * 86400000 * 7);
    for (let j = 1; j <= 7; j++) {
      let shiftLength = Math.floor(
        (Math.random() * 86400000) / Math.ceil(Math.random() * 6) + 6
      );
      worker.CreateSchedule(
        true,
        new Date(Date.now() + randomTime * j),
        new Date(Date.now() + randomTime * j + shiftLength)
      );
    }
    //FIX
    let workerDB = new WorkerDB();
    workerDB.name = worker.name;
    workerDB.schedule = worker.schedule;
    workerDB.jobTitle = worker.jobTitle;
    await workerDB.save();
    warehouses[(i % (warehouseIndexCounter + 1))].workers.push(worker);
    warehouseDB = await WarehouseDB.findOne({locationName: `Location ${i % (warehouseIndexCounter + 1)}`});
    warehouseDB.workers.push(workerDB.id);
    warehouseDB.isNew = false;
    await warehouseDB.save();
  }
  for (let i = 0; i < 500; i++) {
    await GeneratePurchase();
  }
  // Bun.write("src/data.json", JSON.stringify(warehouses));
  // Bun.write("src/orders.json", JSON.stringify(purchases));  
  console.log("Generated Data");
}

function Working(time, warehouseIndex) {
  let workersWorking = [];
  let warehouse = warehouses[warehouseIndex];
  for (let i = 0; i < warehouse.workers.length; i++) {
    let worker = warehouse.workers[i];
    let working = false;
    for (let i = 0; i < worker.schedule.length; i++) {
      let scheduleElement = worker.schedule[i];
      if (
        Number(scheduleElement.shiftStart) > time % 604800000 &&
        Number(scheduleElement.shiftEnd < time % 604800000)
      ) {
        working = true;
      }
    }
    if (working) {
      workersWorking.push(worker);
    }
  }
  return workersWorking;
}
function ProductsInStock() {
  let productsInStockCurrently = [];
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    if (product.inStock > 0) {
      productsInStockCurrently.push(product);
    }
  }
  return productsInStockCurrently;
}
function CompletedPurchases() {
  let completedPurchases = [];
  for (let i = 0; i < purchases.length; i++) {
    let purchase = purchases[i];
    if (typeof purchase.completionDate != undefined) {
      completedPurchases.push(purchase);
    }
  }
  return completedPurchases;
}
await GenerateData();
// const data = Bun.file("src/data.json");
// const orders = Bun.file("src/orders.json");
// input = await data.text();
// warehouses = JSON.parse(input);
// input = await orders.text();
// purchases = JSON.parse(input);
console.log("All is good");

//Endpoints

server.get("/Working/:warehouseIndex/:day", async ({ params }) => {
  let arr = warehouses[params.warehouseIndex].workers;
  let workersWorkingDay = [];
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  if (!days.includes(params.day)) {
    return `'${params.day}' is not a valid day`;
  }

  for (let i = 0; i < arr.length; i++) {
    let worker = arr[i];
    for (let j = 0; j < worker.schedule.length; j++) {
      try {
        if (
          days[worker.schedule[j].shiftStart.getDay()] == params.day ||
          days[worker.schedule[j].shiftEnd.getDay()] == params.day
        ) {
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
  console.log("Working in ", params.warehouseIndex, "called");
  return warehouses[params.warehouseIndex].workers;
});
//Working currently at a given warehouse
server.get("/Working/now/:warehouseIndex", async ({ params }) => {
  console.log("Working now in ", params.warehouseIndex, "called");
  return Working(Date.now(), params.warehouseIndex);
});
server.get("/Productsinstock/All", async () => {
  console.log("prodcuts in stock called");
  return ProductsInStock();
});
server.get("/Productsinstock/:productName", async ({ params }) => {
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    if (product.name == params.productName) {
      return product;
    }
  }
  return "Product doesnt exsist";
});
server.get("/pickers/without/:param", async ({ params }) => {
  let withoutOrder = [];
  for (let i = 0; i < warehouses.length; i++) {
    const warehouse = warehouses[i];
    for (let j = 0; j < warehouse.workers.length; j++) {
      const worker = warehouse.workers[j];
      if (worker.orderList.length == 0 && worker.jobTitle === JobTitle.Picker) {
        withoutOrder.push(worker);
      }
    }
  }
  return withoutOrder;
});
server.get("/Orderstobe/picked/:?", async ({ params }) => {
  let toBePicked = [];
  for (let i = 0; i < purchases.length; i++) {
    const purchase = purchases[i];
    for (let j = 0; j < purchase.orders.length; j++) {
      const order = purchase.orders[j];
      if (order.status === OrderStates.Asigned) {
        toBePicked.push(order);
      }
    }
  }
  return toBePicked;
});
server.get("/Orderstobe/driven/:oldestOrAll", async ({ params }) => {
  let toBeDriven = [];
  let oldest;
  let oldestOrder = -7;
  for (let i = 0; i < purchases.length; i++) {
    const purchase = purchases[i];
    for (let j = 0; j < purchase.orders.length; j++) {
      const order = purchase.orders[j];
      if (order.status === OrderStates.PickedUp) {
        toBeDriven.push(order);
        if (order.orderDate < oldest || oldestOrder == -7) {
          oldest = order.orderDate;
          oldestOrder = order;
          console.log(oldestOrder);
        }
      }
    }
  }
  if (params.oldestOrAll == "oldest") {
    console.log(oldestOrder);
    return oldestOrder;
  }
  return toBeDriven;
});
server.get("/orders/:month/:totalOrSingle", async ({ params }) => {
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
    "december",
  ];

  if (!months.includes(params.month)) {
    return `'${params.month}' is not a valid month`;
  }
  let completedPurchases = CompletedPurchases();
  console.log(completedPurchases);
  if (params.totalOrSingle == "total") {
    let totalPrice = 0;
    for (let i = 0; i < completedPurchases.length; i++) {
      let purchase = completedPurchases[i];
      if (months[purchase.completionDate[j].getMonth()] == params.month) {
        console.log(purchase.price);
        totalPrice += purchase.price;
      }
    }
    return totalPrice;
  } else if (params.totalOrSingle == "priciest") {
    let priciest = 0;
    let priciestPurchase;
    for (let i = 0; i < completedPurchases.length; i++) {
      let purchase = completedPurchases[i];
      if (purchase.price > priciest && months[purchase.completionDate[j].getMonth()] == params.month) {
        priciest = purchase.price;
        priciestPurchase = purchase;
      }
    }
    return priciestPurchase;
  } else {
    return `'${params.totalOrSingle}' is not valid, put total or priciest`;
  }
});
