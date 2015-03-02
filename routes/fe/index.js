'use strict';

exports.home = function (req, res) {
    res.render('index', { title: 'Welcome to Akshali\'s Wedding Site' });
};

exports.logistics = function (req, res) {
    res.render('logistics', { title: 'Akshali\'s Wedding Events', active: 'logistics' });
};

exports.registry = function (req, res) {
    res.render('registry', { title: 'Akshali\'s Wedding Registry', active: 'registry' });
};

exports.wedding = function (req, res) {
    res.render('wedding', { title: 'Akshali\'s Wedding Events', active: 'wedding' });
};
