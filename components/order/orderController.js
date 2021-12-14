
const orderService = require("./orderService");

exports.list = async function (req, res) {
    const currentOrder = await orderService.viewOrder(req.user._id);
    console.log(currentOrder);


    res.render("order/views/cart", { currentOrder })
}
