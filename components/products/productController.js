const productService = require("./productService");
const { ObjectId } = require("mongodb");
const url = require("url");
const queryString = require("querystring");

// function getUrl(req) {
//   var urlobj = url.parse(req.originalUrl);
//   urlobj.protocol = req.protocol;
//   urlobj.host = req.get("host");
//   var requrl = url.format(urlobj);
//   return requrl;
// }
exports.list = async function (req, res) {
  // try {

  let query = { ...req.query };
  let page;
  if (query.page === undefined) {
    page = 1;
  } else if (query.page < 0) {
    page = 1;
  } else {
    page = parseInt(query.page);
  }
  const excludedFields = ["page"];
  excludedFields.forEach((el) => delete query[el]);

  const keyword = query.keyword ? query.keyword : 0;
  const category = query.category ? query.category : 0;
  const gen = query.gen ? query.gen : 0;
  const products = await productService.listProducts(page, query);
  let totalPage = await productService.totalProductNum(query);
  totalPage = Math.ceil(totalPage / 3);
  res.render("product", {
    page: page, // Current Page
    totalPage, // Total Page
    products: products,
    keyword: keyword,
    category: category,
    gen: gen,
  });
  // } catch {
  //   res.render("error");
  // }
};

exports.item = async function (req, res) {
  try {
    const product = await productService.viewOne(ObjectId(req.params.id));

    res.render("product_detail", { product });
  } catch {
    res.render("error");
  }
};
