let mongoose = require ("mongoose");

let productSchema = new mongoose.Schema({

    Productname : {
        type: String
    },

    Brandname : {
        type: String
    },

    Category : {
        type: String
    },

    Price : {
        type: Number
    },

    Stock : {
        type: Number
    },
    image: {
        type: String
    }


},{
    timestamps: true
})


module.exports = mongoose.model("product",productSchema)