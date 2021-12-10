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
  const sort = query.sort ? query.sort : 0;

  const activeJacket = category == "Jacket" ? true : false;
  const activeShirt = category == "T-shirt" ? true : false;
  const activeBack = category == "Backpack" ? true : false;
  const activeJeans = category == "Jeans" ? true : false;
  const activeShoe = category == "Shoe" ? true : false;
  const activeHoodie = category == "Hoodie" ? true : false;
  const activePant = category == "Pant" ? true : false;

  const activePopular = gen == "Popular" ? true : false;
  const activeNew = gen == "New" ? true : false;
  const activeHot = gen == "Hot" ? true : false;
  const activeLimited = gen == "Limited" ? true : false;


  const categoryString = category != 0 ? "&category=" + category : "";
  const keywordString = keyword != 0 ? "&keyword=" + keyword : "";
  const genString = gen != 0 ? "&gen=" + gen : "";
  const sortString = sort != 0 ? "&sort=" + sort : "";

  const products = await productService.listProducts(page, query);
  let totalPage = await productService.totalProductNum(query);
  totalPage = Math.ceil(totalPage / 3);
  res.render("products/views/product", {
    page: page, // Current Page
    totalPage, // Total Page
    products: products,
    keyword: keyword,
    category: category,
    gen: gen,
    sort: sort,
    activeJacket,
    activeShirt,
    activeBack,
    activeJeans,
    activeShoe,
    activeHoodie,
    activePant,
    activePopular,
    activeHot,
    activeNew,
    activeLimited,
    categoryString,
    keywordString,
    genString,
    sortString,
  });
  // } catch {
  //   res.render("error");
  // }
};

exports.item = async function (req, res) {
  try {
    const product = await productService.viewOne(ObjectId(req.params.id));
    product._id = product._id.toString();

    res.render("products/views/product_detail", { product });
  } catch {
    res.render("error");
  }
};

exports.review = async function (req, res) {

  const product = req.body;
  currentProduct = await productService.viewOne(req.params.id);
  try {
    console.log(product["name"]);
    console.log(currentProduct);
    console.log(currentProduct.review_detail);
    if (currentProduct.review_detail === undefined) {
      currentProduct.review_detail = new Array();
    }

    console.log(currentProduct.review_detail);
    var feed = { username: product["name"], comment: product["your_review"] };
    currentProduct.review_detail.push(feed);
    currentProduct.review = currentProduct.review + 1;

    console.log(currentProduct);
    await productService.update(currentProduct);
    console.log("review successfully");
    res.redirect("/product/" + req.params.id);
  }
  catch {
    res.render("error");
  }
}