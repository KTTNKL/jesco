const productService = require("./productService");
const { ObjectId } = require("mongodb");
exports.list = async function (req, res) {
  const products = await productService.listProducts();
  console.log(products);
  res.render("product", { products });
};

exports.item = async function (req, res) {
  const product = await productService.viewOne(ObjectId(req.params.id));

  res.render("product_detail", { product });
};
