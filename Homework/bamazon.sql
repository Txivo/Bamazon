DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	position INT NOT NULL,
    item_id VARCHAR(100) NULL,
    product_name VARCHAR(100) NULL,
    year INT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,4) NULL,
    stock_quantity DECIMAL(10,4) NULL,
    PRIMARY KEY (position)
);


SELECT * FROM products;