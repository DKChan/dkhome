var mongoose = require('mongoose');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');
var moment = require('moment');

var normal_nav_list = [{name: "resume", href: "/resume"}];
var admin_nav_list = [{name: "resume", href: "/resume"}, {name: "admin", href: "/admin"}];
var contact_list = [
    {icon: "fa-qq", link: "http://wpa.qq.com/msgrd?v=3&amp;uin=524912269&amp;site=qq&amp;menu=yes", name: "524912269"},
    {icon: "fa-envelope", link: "mailto:524912269@qq.com", name: "524912269@qq.com"},
    {icon: "fa-github", link: "https://github.com/DKChan", name: "DKChan"},
];
exports.index = function(req, res) {
    //console.log(req.session);
    Feed.fetch(function(err, msg) {
        // console.log("msg : ", msg);
        if(err) {
            console.log(err);
            msg_list = [];
        } else {
            var msg_list = msg;
            msg_list.forEach(function(item) {
                item.date = moment(item.create_at).format('YYYY-MM-DD hh-mm');
            })
        }
        console.log("msg : ", msg);
        res.render("index", {
                title: "DK",
                nav_list: req.session.user?admin_nav_list: normal_nav_list,
                now_state: req.session.user? 'logout': 'login',
                contact: contact_list,
                message: msg_list,
            });
    });
}

exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect('/');
}

exports.login = function(req, res) {
    // console.log(req);
    var user = req.body.user;
    var psd = req.body.psd;
    // console.log(psd);
    User.findOne({username: user}, function(err, user) {
        if(err) {
            console.error(err.stack);
        }
        // console.log(user);
        if(user) {
            // console.log(psd + " " + user.passwd);
            user.comparePassword(psd, function(err, isMatch) {
                if (err) {
                    console.error(err.stack);
                }
                if (isMatch) {
                    req.session.user = user;
                    user.last_login = Date.now();
                    user.save();
                    console.log("login success");
                    //console.log(req.session);
                } else {
                    console.log("login fail");
                }
                return res.redirect('/');
            });
        }
    })
};

exports.resume = function(req, res, next) {
    return res.render('resume',{
        title: 'resume by DK',
        nav_list: nav_list,
    });
}
