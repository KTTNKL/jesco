const orderModel = require("./orderModel");

exports.makeOrder = async (order, subtotal) => {
    return orderModel.create({
        userid: order.userid,
        username: order.username,
        address: order.address,
        email: order.email_address,
        phone: order.phone,
        productName: [order.productName],
        image: [order.image],
        price: [order.price],
        note: order.note,
        status: order.status,
        shippingFee: order.shippingFee,
        quantity: [order.quantity],
        subtotal: [subtotal],
        total: subtotal
    });
};


exports.viewOrder = (id) => orderModel.findOne({ userid: id }).lean();