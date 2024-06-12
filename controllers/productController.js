
let Product = require("../models/productModels");
const { findOne, updateOne } = require("../models/userModel");

let admin = require('firebase-admin')
let serviceAccount = require('../firebase.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://node-project-48fce.appspot.com'
});




module.exports = {

    addProduct: async (req, res) => {
        console.log(req.body);
        console.log(req.file);
        let { Productname, Brandname, Category, Price, Stock } = req.body



        try {
            let result = await Product.findOne({ Productname, Brandname })

            console.log(result);


            if (result) {
                res.json("Product already exist")
                return
            } else {

                const bucket = admin.storage().bucket();


                let filename = Date.now() + '-' + req.file.originalname
                let file = bucket.file(filename)

                await file.save(req.file.buffer, {
                    metadata: {
                        contentType: req.file.mimetype, // Set the appropriate content type
                    }
                })

                let imageUrl = await file.getSignedUrl({
                    action: 'read',
                    expires: '01-01-2050'
                })

                let response = await Product.create({
                    Productname: Productname,
                    Brandname: Brandname,
                    Category: Category,
                    Price: parseInt(Price),
                    Stock: parseInt(Stock),
                    image: imageUrl[0]
                })

                res.json({ message: "this is from Database", data: response });
            }

        } catch (error) {
            console.log(error);
            res.json("Error")
        }
    },

    getProduct: async (req, res) => {
        console.log(req.params);

        try {
            let result = await Product.findOne({ _id: req.params.id })
            if (!result) {
                res.json({ message: "product is not found" })

            } else {
                res.json({ message: result })
            }

        } catch (error) {
            console.log(error);
            res.json("invalid id")

        }

    },

    getAllProducts: async (req, res) => {
        try {
            let result = await Product.find()
            console.log(result);
            res.json(result)

        } catch (error) {
            console.log(error);
            res.json("Something wrong")
        }

    },

    deleteProducts: async (req, res) => {
        try {
            let result = await Product.findOneAndDelete({ _id: req.params.id })

            if (!result) {
                res.json("No product is exist")
            } else {
                res.json("Product is deleted successfully")
            }

        } catch (error) {
            console.log(error);
            res.json("Invalid id or No product ")
        }

    },

    updateProducts: async (req, res) => {

        let { Productname, Brandname, Category, Price, Stock } = req.body
        try {
            let result = await Product.updateOne({ _id: req.params.id }, {
                Productname: Productname, Brandname: Brandname, Category: Category, Price: Price, Stock: Stock
            }, { key: 123, upsert: true })
            res.json(result)
        } catch (error) {
            console.log(error);
            res.json("wroooon nnngggggg")
        }

    }
}

