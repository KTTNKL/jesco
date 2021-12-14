const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userid: String,

    username: String,
    email_address: String,
    phone: String,
    address: String,

    image: [String],
    productName: [String],
    price: [Number],
    quantity: [Number],
    subtotal: [Number],
    total: Number,

    note: String,
    status: String,
    shippingFee: Number,

});
const order = mongoose.model("Order", orderSchema);

module.exports = order;
