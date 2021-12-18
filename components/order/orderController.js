
const orderService = require("./orderService");
const productService = require("../products/productService");
exports.list = async function (req, res) {
    const currentOrder = await orderService.viewOrder(req.user._id);
    let grandTotal;
    if (currentOrder) {
        grandTotal = currentOrder.total + currentOrder.shippingFee;
    } else {
        grandTotal = 0;
    }
    res.render("order/views/cart", { currentOrder, grandTotal });
}

exports.deleteItem = async function (req, res) {
    let currentOrder = await orderService.viewOrder(req.user._id);
    const myItemToDelete = currentOrder.item.filter(function (el) { return el.productid == req.params.id });

    const curProduct= await productService.viewOne(req.params.id );
    
    curProduct.saleNumber-=myItemToDelete[0].quantity;
    await productService.update(curProduct);
    const newTotal = currentOrder.total - myItemToDelete[0].subtotal;

    const updateItem = currentOrder.item.filter(function (el) { return el.productid != req.params.id });
    currentOrder.item = updateItem;
    currentOrder.total = newTotal;
    await orderService.updateOrder(currentOrder);
    res.redirect("/cart");
}
