const Product = require("./productModel");

exports.listProducts = () => Product.find().lean();

// exports.viewOne = (id) => {
//   try {
//     const product = Product.findOne({ _id: id }).lean();
//     return product;
//   } catch (err) {
//     return {
//       error: 404,
//     };
//   }
// };
