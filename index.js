#!/usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var argv = require('optimist').argv;
var kmeans = require('node-kmeans');

var file = fs.readFileSync(argv._[0], { encoding: 'utf8' });

var regex = /\$([a-z0-9_]+)\s*:\s*#([0-9a-f]+)\s*;/gi;

var colors = [];
file.replace(regex, function (match, name, value) {
    var result = extractHex(name, value);
    if (result) {
        colors.push(result);
    }
    return match;
});

if (typeof argv.find !== "undefined") {
    argv.find = ''+argv.find;
}

var showNew = false;
if (typeof argv.new !== "undefined") {
    argv.new = ''+argv.new;
    showNew = true;
    var result = extractHex('_', ''+argv.new);
    if (result) {
        colors.push(result);
    }
}

var vectors = colors.map(function (color) {
    return [color.r, color.g, color.b];
});

kmeans.clusterize(vectors, { k: parseInt(argv.means || (vectors.length * 0.8), 10) }, function(err, clusters) {
    if (err) throw err;
    clusters.forEach(function (cluster) {
        var names = cluster.clusterInd.map(function (index) {
            return colors[index].name;
        });
        var values = cluster.clusterInd.map(function (index) {
            return colors[index].value;
        });
        var showCluster = true;
        if (argv.find) {
            showCluster = ~names.indexOf(argv.find) ||
                          ~values.indexOf(argv.find);
        }
        if (argv.new) {
            showCluster = ~names.indexOf('_');
        }
        if (showCluster) {
            console.log();
            if (showNew) {
                console.log(chalk.green('#' + argv.new));
            }
            cluster.clusterInd.forEach(function (index) {
                if (colors[index].name === '_') return;
                var name = '$' + colors[index].name;
                var value = '#' + colors[index].value;
                if (name === '$' + argv.find) {
                    name = chalk.green(name);
                }
                if (value === '#' + argv.find) {
                    value = chalk.green(value);
                }
                console.log(name, value);
            });
        }
  });
});

/**
 * Utils
 */

function extractHex(name, value) {
    if (value.length === 3) {
        return extract3Hex(name, value);
    } else if (value.length === 6) {
        return extract6Hex(name, value);
    }
}

function extract3Hex(name, value) {
    return {
        name: name,
        value: value,
        r: parseInt(value.slice(0,1) + value.slice(0,1), 16),
        g: parseInt(value.slice(1,2) + value.slice(1,2), 16),
        b: parseInt(value.slice(2,3) + value.slice(2,3), 16)
    };
}

function extract6Hex(name, value) {
    return {
        name: name,
        value: value,
        r: parseInt(value.slice(0,2), 16),
        g: parseInt(value.slice(2,4), 16),
        b: parseInt(value.slice(4,6), 16)
    };
}