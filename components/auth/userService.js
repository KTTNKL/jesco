const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sgMail = require("../../middlewares/sendGrid");

const userModel = require("./userModel");

exports.findByUsername = (username) => {
  return userModel
    .findOne({
      username: username,
    })
    .lean();
};

exports.findByEmail = (email) =>{
  return userModel.findOne({email_address : email,}).lean();
};

exports.validPassword = (password, user) => {
  return bcrypt.compare(password, user.password);
};



exports.validPasswordForChangePass = (password, passwordInDatabase) => {
  return bcrypt.compare(password, passwordInDatabase);
};

exports.register = async (username, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const activationString= randomstring.generate();
  await userModel.create({
    username: username,
    email_address: email,
    password: passwordHash,
    isBan: true,
    activationString: activationString,
  });
  // Send activation string to user mail
  const link = process.env.DOMAIN_NAME+"/login/activate?email="+email+"&activation-string="+activationString;

  const msg = {
    to: email,
    from: process.env.EMAIL_SENDER,
    subject: 'JESCO ACCOUNT EMAIL ACTIVATION',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<h1>Thanks for register your account with Jesco</h1><p>Please activate your account <a href=${link}>Activate now</a></p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    })


};

exports.update = (user) => {
  userModel.findOneAndUpdate(
    { _id: user._id },
    user,
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
    }
  );
};
