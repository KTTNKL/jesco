
const orderService = require("./orderService");

exports.list = async function (req, res) {
    const currentOrder = await orderService.viewOrder(req.user._id);
    console.log(currentOrder);

    const grandTotal = currentOrder.total + currentOrder.shippingFee;
    res.render("order/views/cart", { currentOrder, grandTotal })
}

exports.deleteItem = async function (req, res) {
    const currentOrder = await orderService.viewOrder(req.user._id);
    const updateItem = currentOrder.item.filter(function (el) { return el.productid != req.params.id });

    res.redirect("/cart")
}
