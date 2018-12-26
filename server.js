var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
const session = require('express-session');
mongoose.connect('mongodb://localhost/27017');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
    secret: 'itsasecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }
}))

var quotes = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    quote: { type: String, required: true, maxlength: 255 }
}, {timestamps: true});

mongoose.model('quotes', quotes);
var quotes = mongoose.model('quotes');

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/quotes', function (req, res) {
    quotes.find({}, function(err, quotes){
        res.render('quotes', {quotes: quotes});
    })
})

app.post('/quotes', function (req, res) {
    quotes.create(req.body, function (err, quotes) {
        if (err) {
            for (var key in err.errors) {
                req.flash('create', "All fields are required");
            }
            res.redirect('/');
        }
        else {
            res.redirect('/quotes');
        }
    })
})


app.listen(8000, function () {
    console.log("listening on port 8000");
})