const Product = require("./productModel");

exports.listProducts = () => Product.find().lean();

exports.viewOne = (id) => Product.findOne({ _id: id }).lean();
