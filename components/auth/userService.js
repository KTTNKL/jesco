const userModel = require('./userModel');
const bcrypt = require('bcrypt');

exports.findByUsername = (username) =>{
    return userModel.findOne({
        username: username
    }).lean();
}

exports.validPassword =(password, user)=>{
    return bcrypt.compare(password, user.password);
}

exports.register= async(username, email, password)=>{
    const passwordHash = await bcrypt.hash(password, 10);
    return userModel.create({
        username: username,
        email_address: email,
        password: passwordHash
    });
}

exports.update = (user)=>{
    console.log(user);
    userModel.findOneAndUpdate(
        {_id: user._id},
        user,
        { new: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          }       
        }  
    );
};