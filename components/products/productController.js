const productService = require("./productService");
const { ObjectId } = require("mongodb");
exports.list = async function (req, res) {
  const products = await productService.listProducts(req.query.page);
  let totalPage = await productService.totalProductNum();
  totalPage = Math.ceil(totalPage / 3);
  console.log(totalPage);
  res.render("product", {
    page: req.query.page, // Current Page
    totalPage, // Total Page
    products: products,
  });
};

exports.item = async function (req, res) {
  const product = await productService.viewOne(ObjectId(req.params.id));

  res.render("product_detail", { product });
};
