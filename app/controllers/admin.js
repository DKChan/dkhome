var mongoose = require('mongoose');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');

exports.index = function(req, res, next) {
    var admin_nav_list = [{name: "resume", href: "/resume"}, {name: "admin", href: "/admin"}];
    return res.render('admin', {
        title: "dk admin",
        nav_list: admin_nav_list,
        settings: [
            {href: '#/user', name: 'users settings'},
            {href: '#/feed', name: 'feeds settings'},
        ],
        now_state: 'logout',
    });
}

exports.getUser = function(req, res) {
    var isall = req.query.all,
        username = req.query.username;
    //console.log(req.query);
    if(isall === '1') {
        User.fetch(function(err, users) {
            if(err) {
                console.log(err);
                res.json({status: -1, data: []});
            }
            res.json({status: 1, data:users});
        });
    } else {
        User.findOneByName(function(err, user){
            if(err) {
                console.log(err);
            }
            res.json({status: -1, data: []});
        });
    }
}

exports.addUser = function(req, res) {
    // TODO
    // get user data to var _user
    var _user = req.body;
    console.log(req.body);
    User.findOne({username: _user.username}, function(err, user) {
        if(err) {
            console.log(err);
            return res.json({status: -1}); 
        }
        if(!user) {
            var user = new User(_user);
            user.save(function(err) {
                if(err) {
                    console.log("add user failed");
                    return res.json({status: -1});
                }
                return res.json({status: 1});
            });
        } else {
            return res.json({status: -1});
        }
    })

}

exports.delUser = function(req, res) {
    var id = req.query.id;
    User.remove({_id:id},function(err) {
        if(err) {
            console.log(err);
            return res.json({status: -1});
        }
        return res.json({status: 1});
    });
}

exports.getFeed = function(req, res) {
    // var num = req.body.num ;
    Feed.fetch(function(err, feeds){
        if(err) {
            console.log(err);
            return res.json({status: -1, data: []});
        }
        return res.json({status: 1, data: feeds});
    });
}   

exports.addFeed = function(req, res) {
    // console.log(req.body);
    // console.log(req.data);
    var _feed = new Feed();
    _feed.content = req.body.content;
    _feed.by_who = req.session.user;
    _feed.save(function(err) {
        if(err) {
            console.log(err);
            return res.json({status: -1});
        }
        return res.json({status: 1});
    });
    // return res.json({status: 1});
}

exports.delFeed = function(req, res) {
    var id = req.query.id;
    // console.log(req.query);
    // console.log(id);
    Feed.remove({_id:id}, function(err, info) {
        // console.log(info);
        if(err) {
            console.log(err);
            return res.json({status: -1});
        }
        console.log("delete success");
        return res.json({status: 1});
    });
}