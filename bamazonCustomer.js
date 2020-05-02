var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "junket-serrate-postdate",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    productList();
});

function productList() {
    var productList = "SELECT * FROM products;";
    console.log("List of Products for purchase: ");
    connection.query(productList, function(err, res) {
        if (err) throw err;
        var products = {};
        console.table(res, ["item_id", "product_name", "price"]);
    });
}

function productSelect() {
    inquirer
    .prompt([
        {}
    ])
}

