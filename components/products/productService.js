const Product = require("./productModel");
const PAGE_SIZE = 3;
exports.listProducts = (page) => {
  console.log(page);
  if (!page) {
    page = 1;
  }
  if (page < 0) {
    page = 1;
  }
  const Skip = (page - 1) * PAGE_SIZE;
  page = parseInt(page);
  return Product.find({}).skip(Skip).limit(PAGE_SIZE);
};

exports.totalProductNum = () => Product.countDocuments();
exports.viewOne = (id) => Product.findOne({ _id: id }).lean();
