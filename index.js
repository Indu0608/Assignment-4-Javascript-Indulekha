//including dependancies
var express = require('express');
var path = require('path');
//Including Database
const mongoose = require('mongoose');
//Including functions to validate Quantity, Phone and email using Validation JS
const { validate1item, validateEmail, validatePhone } = require('./public/script/validation');
//Including Tax calculation based on provinces with Calculate JS
const { findTax } = require('./public/script/calculate');
const {
    check,
    validationResult,
} = require('express-validator');
var itemList = [
    {
        name: 'Del monte Juice',
        price: 3.99,
        quantity: 0
    },
    {
        name: 'Sourbelt jelly',
        price: 5.99,
        quantity: 0
    },
    {
        name: 'Chocolate covered Almonds',
        price: 6.99,
        quantity: 0
    },
    {
        name: 'Salted Cashewnuts',
        price: 3.99,
        quantity: 0
    },
    {
        name: 'Rolled Oats',
        price: 0.44,
        quantity: 0
    },
];
//Declare array for Purchased items
var purchasedItems = [];
//Declare Customer Information details
var customerInfo = {
    CustName: "",
    CustPhone: "",
    CustEmail: "",
    CustAddress: "",
    CustCity: "",
    CustProvince: "",
};
//Declare Customer Invoice details
var custInvoice = {
    customerInfo: customerInfo,
    purchasedItems: purchasedItems,
    subtotal: 0,
    tax: 0,
    total: 0,
}
var myapp = express();
//setting the paths for ejs and public folders
myapp.set('views', path.join(__dirname, 'views'));
myapp.use(express.static(__dirname + '/public'));
myapp.set('view engine', 'ejs');
myapp.use(express.urlencoded({
    extended: false
}));

// mongoDB Connection
mongoose.connect("mongodb://localhost:27017/onlinestore", { useNewUrlParser: true, useUnifiedTopology: true, });

//settingup a model for collection
const invoice = mongoose.model('Invoice', {
    customerInfo: Object,
    purchasedItems: Array,
    subtotal: Number,
    tax: Number,
    total: Number,
})
//Get the itemlist table from Home and render
myapp.get('/', (req, res) => {
    res.render('home', { itemList: itemList });
})
//Upon clicking "Purchase" button , Get Order Page for storing Customer Information
myapp.post('/order', [
    //Validate if atleast 1 item is picked using function validate1ite
    check('item').custom(validate1item)], (req, res) => {

        const errors = validationResult(req);
        //if no errors  found, push quantities to purchasedItems array
        if (!errors.array().length) {
            purchasedItems.push(...req.body.item);
            res.render('inner', {
                data: customerInfo,
                errors: [],
            })
        } else {
            res.render('home', {
                data: req.body,
                errors: errors.array(),
                itemList: itemList,
            })
        }
    })

//Upon clicking "Purchase" button , Get Billing Page for calculations and validations
myapp.post('/billing', [
    check('CustPhone').custom(validatePhone), check('CustEmail').custom(validateEmail),
    check('CustProvince', 'Please select a province.').not().isEmpty()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.array().length) {
            customerInfo.CustName = req.body.CustName;
            customerInfo.CustPhone = req.body.CustPhone;
            customerInfo.CustEmail = req.body.CustEmail;
            customerInfo.CustAddress = req.body.CustAddress;
            customerInfo.CustCity = req.body.CustCity;
            customerInfo.CustProvince = req.body.CustProvince;
            for (let i = 0; i < purchasedItems.length; i++) {
                custInvoice.subtotal += itemList[i].price * purchasedItems[i]
            }
            custInvoice.tax = custInvoice.subtotal * 0.13;
            custInvoice.total = custInvoice.subtotal + custInvoice.tax

            //saving data to the Database
            var newInvoice = new invoice(custInvoice);
            newInvoice.save().then(() => {
                console.log('Invoice added to the database.');
            });
            res.render('reciept', {
                data: custInvoice,
                errors: [],
                itemList: itemList,
            })
        } else {
            res.render('inner', {
                data: req.body,
                errors: errors.array(),
                itemList: itemList,
            })
        }
    })
myapp.get('/invoices', (req, res) => {
    var invoices = [];
    invoice.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.render('invoices', { invoices: data });
        }
    });

});

myapp.get('/reciept/:id', (req, res) => {
    var id = req.params.id;
    invoice.findOne({ _id: id }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.render('reciept', { data: data, itemList: itemList });
        }
    });
});
myapp.listen(8080, () => {
    console.log("Server started at port 8080.\nGo to http://localhost:8080");
});

