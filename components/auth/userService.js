const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

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
  // const link = process.env.DOMAIN_NAME+"/login/activate?email="+email+"&activation-string="+activationString;

  // let testAccount = await nodemailer.createTestAccount();

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  // let info = await transporter.sendMail( {
  //   to: email,
  //   from: process.env.EMAIL_SENDER,
  //   subject: 'JESCO ACCOUNT EMAIL ACTIVATION',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: `<h1>Thanks for register your account with Jesco</h1><p>Please activate your account <a href=${link}>Activate now</a></p>`,
  // });
  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// exports.activate = async (email, activationString)=>{
//   const user = await userModel.findOne({
//     email, activationString,
//   }).lean();
//   if(!user){
//     return false;
//   }
//   await userModel.updateOne({
//     email, activationString,
//   },{
//     $set:{
//       isBan: true,
//     },
//   });
//   return true;
// };

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
