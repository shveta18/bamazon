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


// function for the customer to select a product ID to purchase and code to return the product name
function productSelect() {
    inquirer
        .prompt({
            name: "productID",
            type: "input",
            message: "Enter the ID of the product you would like to purchase: "
        })
        .then(function (answer) {
            var query = "SELECT product_name, department_name FROM products WHERE ?";
            connection.query(query, { item_id: answer.productID }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("Product: " + res[i].product_name + "(" + res[i].department_name + ")" + " has been selected.");
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
            console.log("You selected: " + answer.qty);
        });
}
