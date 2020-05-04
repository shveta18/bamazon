var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "junket-serrate-postdate",
    database: "bamazon_db"
});
// once connection is established, run function to list all products
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    productList();
});

var products = [];
// function to display all product list, prices and ids
function productList() {
    var productList = "SELECT * FROM products;";
    console.log("================================ LIST OF PRODUCTS IN OUR STORE ===============================");
    connection.query(productList, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: (" + res[i].item_id + ") " + res[i].product_name + " || $" + res[i].price);
            // push all results to the products array
            products.push(res[i]);
        }
        // run function for product selection
        purchaseDecision();
    });
}

// purchase decision
function purchaseDecision() {
    inquirer
        .prompt({
            name: "purchase decision",
            type: "list",
            message: "Would you like to make a purchase?",
            choices: ["Yes", "No", "exit"]
        })
        .then(function (answer) {
            switch (answer["purchase decision"]) {
                case "Yes":
                    productSelect();
                    break;

                case "No":
                    noPurchase();
                    connection.end()
                    break;

                case "exit":
                    noPurchase();
                    connection.end();
                    break;
            }
        });
}
// if user selects no, or, exits  message displays to exit
function noPurchase() {
    console.log("Thank you for visiting the store! Come back soon!");
}

// created a variable to store the ITEM ID selected so it can be used by the stock calculator function later
var itemID = 0;
// function for the customer to select a product ID to purchase and code to return the product name
function productSelect() {
    inquirer
        .prompt({
            name: "productID",
            type: "input",
            message: "Enter the ID of the product you would like to purchase: "
        })
        .then(function (answer) {
            var query = "SELECT item_id, product_name, department_name FROM products WHERE ?";
            connection.query(query, { item_id: answer.productID }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("Product: " + res[i].product_name + "(" + res[i].department_name + ")" + " has been selected.");
                    itemID = res[i].item_id;
                    console.log("The item id is: " + itemID);
                }
                qty();
            });
        });
}

// Items to fix: 
// if user enters item ID not in list, not a number

// Function to take in qty value
function qty() {
    inquirer
        .prompt({
            name: "qty",
            type: "input",
            message: "Please select the quantity for the product"
            // Items to fix: add validation that a number is punched
        }).then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: itemID }, function (err, res) {
                if (err) throw err;
                if (res[0].stock_quantity < answer.qty) {
                    console.log("Sorry, we do not have sufficient quantity of that product in stock.")
                }
                if (res[0].stock_quantity === 0) {
                    console.log("Sorry, that item is out of stock. Please check again later");
                }
                if (res[0].stock_quantity > answer.qty) {
                    var qtyRequested = answer.qty;
                    var newStockQty = res[0].stock_quantity - answer.qty;
                    //console.log("The new stock qty is: " + newStockQty);
                    updateStock(newStockQty);
                    costCalculator(qtyRequested);
                }
            });
        });
}
// function to update the db with the new stock quantity
function updateStock(newStockQty) {
    var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    connection.query(updateQuery,[newStockQty, itemID], function (err, res) {
        console.log("Your item has been added to the cart.")
    });
}
// function to calculate total cost 
function costCalculator(qtyRequested) {
    var units = qtyRequested;
    var query = "SELECT price FROM products WHERE ?";
    connection.query(query, {item_id: itemID}, function(err, res) {
    var price = res[0].price; 
    var cost = units*price; 
   console.log("The cost of your purchase is: $" + cost);

    })
    
}