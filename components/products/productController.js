const productService = require("./productService");
const { ObjectId } = require("mongodb");
exports.list = async function (req, res) {
  let page;
  if (req.query.page === undefined) {
    page = 1;
  } else if (req.query.page < 0) {
    page = 1;
  } else {
    page = parseInt(req.query.page);
  }
  const products = await productService.listProducts(page);
  let totalPage = await productService.totalProductNum();
  totalPage = Math.ceil(totalPage / 3);
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
