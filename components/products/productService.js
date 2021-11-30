const Product = require("./productModel");
const PAGE_SIZE = 3;
exports.listProducts = (page) => {
  console.log(page);

  const Skip = (page - 1) * PAGE_SIZE;
  page = parseInt(page);
  return Product.find({}).skip(Skip).limit(PAGE_SIZE);
};

exports.totalProductNum = () => Product.countDocuments();
exports.viewOne = (id) => Product.findOne({ _id: id }).lean();
