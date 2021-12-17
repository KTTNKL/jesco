
const orderService = require("./orderService");

exports.list = async function (req, res) {
    const currentOrder = await orderService.viewOrder(req.user._id);

    const grandTotal = currentOrder.total + currentOrder.shippingFee;
    res.render("order/views/cart", { currentOrder, grandTotal });
}

exports.deleteItem = async function (req, res) {
    let currentOrder = await orderService.viewOrder(req.user._id);
    const myItemToDelete = currentOrder.item.filter(function (el) { return el.productid == req.params.id });


    const newTotal = currentOrder.total - myItemToDelete[0].subtotal;

    const updateItem = currentOrder.item.filter(function (el) { return el.productid != req.params.id });
    currentOrder.item = updateItem;
    currentOrder.total = newTotal;
    await orderService.updateOrder(currentOrder);
    res.redirect("/cart");
}
