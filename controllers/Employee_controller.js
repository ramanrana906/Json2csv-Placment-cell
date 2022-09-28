const Employee = require('../models/employee');

module.exports.profile = async function(req, res){
    try{
        let employee = await Employee.findById(req.user._id);
        // console.log("Employeeeee", employee);
        return res.render('profile', {
            title: "Employee Profile",
            employee: employee
        });
    }catch(err){
        console.log("Error in loading profile", err);
        return res.redirect('back');
    }
}


module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/employees/profile');
    }
    return res.render('sign_in',{
        title : "Placment Cell : Sign In"
    });
}


module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/employees/profile');
    }
    return res.render('sign_up',{
        title : "Placment Cell : Sign Up"
    });
}


module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }

    Employee.findOne({email:req.body.email},function(err,employee){
        if(err){
            console.log('error in finding user for signup');
            return;
        }
        if(!employee){
            Employee.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user for signup');
                    return;
                }
                return res.redirect('/employees/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    });

}

module.exports.createSession = function(req,res){
    req.flash('success','logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    // res.clearCookie('codeial');
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        req.flash('success','You have logged out');
      });

   
    // req.session.destroy(function (err) {
    //     res.redirect('/');
    //   });
}
