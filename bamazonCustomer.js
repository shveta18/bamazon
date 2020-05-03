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

function productSelect() {
    inquirer
        .prompt({
            name: "select product ID",
            type: "list",
            message: "select the ID of the product you would like to purchase",
            choices: [

            ]

        })
}