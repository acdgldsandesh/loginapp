var app = require('express')();
var bodyParser = require('body-parser');//import body-parser module;
var routes = require('./routes/routes');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use('/',routes);

app.listen(process.env.PORT || 9000);//Your server listens at the port 9000 or any other available port provided by server.