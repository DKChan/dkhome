var express = require('express');
var mongoose = require('mongoose');
var cIndex = require('../app/controllers/index');
var cAdmin = require('../app/controllers/admin');

module.exports = function(app) {
    // get session user
    app.use(function(req, res, next) {
        /*var _user = req.session.user;
        app.locals.user = _user;*/
        app.locals.user = req.session.user;
        next();
    });
    // index
    app.get('/', cIndex.index);
    // user login/out
    app.post('/login', cIndex.login);
    app.get('/logout', cIndex.logout);
    // resume
    app.get('/resume', cIndex.resume);
    //feed 
    app.get('/admin/feed/get', loginRequire, permissionRequire, cAdmin.getFeed);
    app.post('/admin/feed/add', loginRequire, permissionRequire, cAdmin.addFeed);
    app.delete('/admin/feed', loginRequire, permissionRequire, cAdmin.delFeed);
    // admin
    app.get('/admin', loginRequire, permissionRequire, cAdmin.index);
    app.get('/admin/user/get?', loginRequire, permissionRequire, cAdmin.getUser);
    app.post('/admin/user/add', loginRequire, permissionRequire, cAdmin.addUser);
    app.delete('/admin/user', loginRequire, permissionRequire, cAdmin.delUser);
    
    // app.get('/admin/user/get?', cAdmin.getUser);
}

loginRequire = function(req, res, next) {
    var _user = req.session.user
    if(!_user) {
        console.log("didn't login");
        return res.redirect('/');
    }
    next();
}

permissionRequire = function(req, res, next) {
    var _user = req.session.user;
    if(_user.permission < 50) {
        console.log("low permission");
        return res.redirect('/');
    }
    next();
}

