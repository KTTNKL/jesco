const orderModel = require("./orderModel");

exports.makeOrder = async (order, item, subtotal) => {
    return orderModel.create({
        userid: order.userid,
        username: order.username,
        address: order.address,
        email: order.email_address,
        phone: order.phone,

        item: [item],

        note: order.note,

        shippingFee: order.shippingFee,

        total: subtotal
    });
};


exports.viewOrder = (id) => orderModel.findOne({ userid: id }).lean();

exports.updateOrder = (order) => {
    orderModel.findOneAndUpdate(
      { _id: order._id },
      order,
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };
  