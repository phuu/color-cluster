#!/usr/bin/env node

var kmeans = require('node-kmeans');
var colorString = require('color-string');

var regex = /(#[0-9a-f]{3,6})/gi;

exports.clusterColors = function (colors, opts, cb) {
    cb = cb || function () {};

    kmeans.clusterize(colors, { k: parseInt(opts.means || (colors.length * 0.8), 10) }, cb);
};

exports.extractColors = function (cssString) {
    var colors = [];
    cssString.replace(regex, function (match, value) {
        try {
            var result = colorString.getRgb(value);
            colors.push(result);
        } catch (e) {}
        return match;
    });
    return colors;
};