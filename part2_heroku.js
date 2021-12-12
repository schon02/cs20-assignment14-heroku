const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://schon02:UKdSmzueq45edrFR@cluster0.kaagh.mongodb.net/band?retryWrites=true&w=majority";

var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var port = process.env.PORT || 3000;
// var port = 8080;
// const port = 8080; 


// app.listen(port, () => {
http.createServer(function(req, res)
{
    if(req.url == "/") {
        file = 'index.html';
        fs.readFile(file, function(err, txt){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(txt);
        res.end();
        });
    }
    else if(req.url == "/part2")
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<h2> PROCESSING FORM </h2>");
        input_data = "";
        req.on('data', data => {
            input_data += data.toString();
        });

        req.on('end', () => {
        input_data = querystring.parse(input_data);
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { 
                console.log("Connection err: " + err); return; 
            }
          
            var dbo = db.db("cs20-assignment14");
            var coll = dbo.collection('companies');
            console.log("before find");
            user_query = {company:input_data['company_input']};
            if (input_data['company_input'] == "")
                user_query = {ticker:input_data['ticker_input']};
            coll.find(user_query).toArray(function(err, items) {
              if (err) {
                console.log("Error: " + err);
              } 
              else 
              {
                // res.write("HEY I THINK I DID IT!");
                
                for (i=0; i<items.length; i++)
                    res.write(i + ": " + items[i].company + " Ticker: " + items[i].ticker);
                if (items.length == 0)
                    res.write("Not found");
              }   
              db.close();
            });
            // res.end();
        });
        })
    }
    else 
    {
        res.end();
    }
}).listen(port);
// });