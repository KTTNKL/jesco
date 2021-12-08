const Product = require("./productModel");
const PAGE_SIZE = 3;
exports.listProducts = (page, query) => {
  console.log(query);
  const Skip = (page - 1) * PAGE_SIZE;
  if (query.keyword) {
    query.$or = [
      { name: { $regex: query.keyword, $options: "i" } },
      { brand: { $regex: query.keyword, $options: "i" } },
    ];
  }
  return Product.find(query).skip(Skip).limit(PAGE_SIZE);
};

exports.totalProductNum = (query) => Product.find(query).countDocuments();
exports.viewOne = (id) => Product.findOne({ _id: id }).lean();

exports.update = (product) => {
  Product.findOneAndUpdate(
    { _id: product._id },
    product,
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
    }
  );
};