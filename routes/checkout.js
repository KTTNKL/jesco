var express = require('express');
var router = express.Router();
const orderService = require("../components/order/orderService")
/* GET home page. */
router.get('/', async function (req, res, next) {
  const curOrder = await orderService.viewOrder(req.user._id);
  const total = curOrder.shippingFee + curOrder.total;
  res.render('checkout', { curOrder, total });
});
router.get('/confirm', async function (req, res, next) {
  const curOrder = await orderService.viewOrder(req.user._id);
  const total = curOrder.shippingFee + curOrder.total;
  curOrder.DateOfPurchase = new Date();
  await orderService.updateOrder(curOrder);
  res.render('checkout', { curOrder, total });
});
module.exports = router;
