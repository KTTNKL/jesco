const orderModel = require("./orderModel");

exports.makeOrder = async (user,order, item, subtotal) => {
    return orderModel.create({
        userid: user._id,
        username: user.username,
        address: user.address,
        email: user.email_address,
        phone: user.phone,

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
  