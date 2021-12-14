const productService = require("./productService");
const { ObjectId } = require("mongodb");
const orderService = require("../order/orderService");

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
    const query = { brand: product.brand };
    Relatedproducts = await productService.listRelatedProducts(1, query);
    console.log(Relatedproducts.length);
    for (let i = 0; i < Relatedproducts.length; i++) {
      if (Relatedproducts[i].name === product.name) {
        Relatedproducts.splice(i, 1);
      }
    }

    res.render("products/views/product_detail", { product, Relatedproducts });
  } catch {
    res.render("error");
  }
};

exports.review = async function (req, res) {

  const product = req.body;
  currentProduct = await productService.viewOne(req.params.id);
  try {

    if (currentProduct.review_detail === undefined) {
      currentProduct.review_detail = new Array();
    }

    console.log(currentProduct.review_detail);
    var feed = { username: product["name"], comment: product["your_review"] };
    currentProduct.review_detail.push(feed);
    currentProduct.review = currentProduct.review + 1;

    console.log(currentProduct);
    await productService.update(currentProduct);
    res.redirect("/product/" + req.params.id);
  }
  catch {
    res.render("error");
  }
}

exports.order = async function (req, res) {

  if (req.body.userid === "") {
    res.redirect("/login");
  } else {
    currentOrder = await orderService.viewOrder(req.body.userid);

    if (currentOrder === null) {
      const subtotal = req.body.price * req.body.quantity;
      const item = {
        productid: req.body.productid,
        image: req.body.image,
        productName: req.body.productName,
        price: req.body.price,
        quantity: req.body.quantity,
        subtotal: subtotal,
        status: "PROCESSING"
      }
      await orderService.makeOrder(req.body, item, subtotal);

    } else {
      //Add more 
      let isNewProduct = 1;
      for (let i = 0; i < currentOrder.item.length; ++i) {
        if (currentOrder.item[i].productName === req.body.productName) {
          currentOrder.item[i].subtotal = req.body.quantity * req.body.price;
          console.log(req.body.price);
          currentOrder.total += (req.body.quantity - currentOrder.item[i].quantity) * req.body.price;
          currentOrder.item[i].quantity = Math.floor(req.body.quantity);
          isNewProduct = 0;
          await orderService.updateOrder(currentOrder);
        }
      }
      if (isNewProduct === 1) {
        let subtotal = req.body.price * req.body.quantity;
        const newitem = {
          productid: req.body.productid,
          image: req.body.image,
          productName: req.body.productName,
          price: req.body.price,
          quantity: req.body.quantity,
          subtotal: subtotal,
          status: "PROCESSING"
        }
        currentOrder.item.push(newitem);
        currentOrder.total += subtotal;
        await orderService.updateOrder(currentOrder);
      }

    }
    res.redirect("/cart");
  }
}