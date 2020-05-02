CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE table products (
item_id INT auto_increment not null,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(7,3) not null,
stock_quantity int not null,
primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values
("The Handmaid's Tale", "Books", 20.99, 10), ("1984", "Books", 10.30, 15), 
("Coffee Beans", "Beverage", 30.50, 50), ("Tea", "Beverage", 25.50, 20), ("Matcha Mix", "Beverage", 34.00, 10), ("Shortbread Cookies (pack of 4)", "Food", 5.99, 30),("Chocolate Cookies (pack of 6)", "Food", 6.20, 30), ("Gluten Free Cookies (pack of 3)", "Food", 7.50, 30), 
("Boujie Fountain Pen", "Stationary",52.30, 5), ("Regular Fountain Pen", "Stationary", 30, 20);
