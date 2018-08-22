var mysql = require("mysql");
var inquirer = require("inquirer");

//To format tables in command line
var asTable = require ('as-table').configure ({ maxTotalWidth: 200, delimiter: ' | ' });

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});


  
    //Function display
    var displayProducts = function () {

        var query = "SELECT * FROM products WHERE stock_quantity > 0;";
        connection.query(query, function(err, res) {

            console.log("\n"+ asTable(res));
            toDo();
        });
    };

    
    var toDo = function () {

        console.log ("\n");
        inquirer
            .prompt({

            name: "product_id",
            type: "input",
            message: "Enter 'item_id' of the product being bought!",



            validate: function(value) {

                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            })



            .then(function(answer) {

                inquirer
                    .prompt({


                    name: "units",
                    type: "input",
                    message: "How many units are being bought?",
                    validate: function(value) {


                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                    })

                    .then(function(ans) {
                        validateStock(parseInt(answer.product_id), parseInt(ans.units));
                    });
        });
    };

    //Function to check stock for availability

    var validateStock = function (product_id, units) {
    
        var query = "SELECT stock_quantity FROM products WHERE ?";

        connection.query(query, { item_id: product_id}, function(err, res) {
            
            var stock = parseInt(res[0].stock_quantity);
          
            if ( stock > 0 && units <= stock) {
                var newqty = stock - units;
                placeOrder(product_id, newqty, units);
            }

            //out of stock
            else {
                 
                console.log("\n==========================================================");
                console.log("Sorry  out of stock!);
                console.log("==========================================================\n");
                ask(); 
            }
        });
    };

    //Place another order 
    var placeOrder = function (id, quantity, units) {

        var query1 = "UPDATE products SET stock_quantity ="+quantity+" WHERE ?";
        
        connection.query(query1, { item_id: id}, function(err, res) {
            var query2= "SELECT price FROM products WHERE ?";
            connection.query(query2, { item_id: id}, function(err, response) {
                console.log("\n============================================================");
                console.log("Your order has been placed! \n Total of order: $"+((response[0].price)*units));
                console.log("============================================================\n");
                ask();  
            });
        });
    };

    //end session or continue
    var ask = function () {

        inquirer
                .prompt({

                name: "confirm",
                type: "confirm",
                message: "Would you like to keep shopping?",
                default: true
                })

                .then(function(response) {

                
                    if(response.confirm){
                        displayProducts();
                    }
                    else {
                        console.log("\n============================================");
                        console.log ("Thank you! end of session.");
                        console.log("============================================\n");
                    }
                });
    };

    connection.connect(function(err) {
        if (err) throw err;
        displayProducts();
    });