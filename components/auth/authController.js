const userService = require('./userService');

exports.register = async(req,res)=>{
    const{username,email, password}= req.body;
    const user = await userService.register(username, email, password);
    res.redirect('/login');

};

exports.logout = (req,res) =>{
    req.logout();
    res.redirect('/');
};

exports.login = (req, res) =>{
    const wrongPassword = req.query['wrong-password'] !== undefined;
    res.render('auth/views/login',{wrongPassword});
}

