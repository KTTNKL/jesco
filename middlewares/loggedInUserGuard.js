module.exports = async function loggedInUserGuard(req, res, next) {
  if (req.user) {
    res.locals.order = await orderService.viewOrder(req.user._id);
    next();
  } else {
    res.redirect("/login");
  }
};
