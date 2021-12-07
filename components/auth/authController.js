const userService = require("./userService");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userService.register(username, email, password);
  res.redirect("/login");
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

exports.login = (req, res) => {
  const wrongPassword = req.query["wrong-password"] !== undefined;
  res.render("auth/views/login", { wrongPassword });
};

exports.updateAccount = async function (req,res) {
  const user = req.body;
  try{

  await userService.update(user);
  if(user['old-password'] !== "" && user['new-password'] !=="")
  {
    console.log("if 1");
    console.log(user['old-password']);
    console.log(user.current_password);
    if(bcrypt.compare( user.current_password, user['old-password']))
    {
      console.log("if 2");
      user.password = user['new-password'];
      await userService.update(user);
      console.log("password changed successfully");
    }

  }

  }
  catch(err){}

  res.render("auth/views/account", {user});
};

exports.viewAccount = (req,res)=>{
  res.render("auth/views/account");
};
