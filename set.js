#!/usr/bin/node

var getChromecastBackgrounds = require('./index');
var sys                      = require('sys')
var exec                     = require('child_process').exec;

var randomInt = function (low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
};

var getHome = function () {
	return process.env.HOME || process.env.USERPROFILE;
};

var set = function (backgound) {
	exec('wget "' + backgound['url'] + '" -O ' + getHome() + '/.wallpaper.jpg', function (error, stdout, stderr) {
		console.log('done downloading wallpaper');
		exec('gconftool -t string -s /desktop/gnome/background/picture_filename ' + getHome() + '/.wallpaper.jpg', function (error, stdout, stderr) {
			console.log('done ubuntu');
		});
		exec('gsettings set org.gnome.desktop.background draw-background false && gsettings set org.gnome.desktop.background picture-uri file://'+getHome()+'/.wallpaper.jpg && gsettings set org.gnome.desktop.background draw-background true', function () {
			console.log('done gnome 3');
		});
		exec('set-itemproperty -path "HKCU:Control Panel\\Desktop" -name wallpaper -value ' + getHome() + '/.wallpaper.jpg', function () {
			console.log('done windows');
		});
	});
};

console.log('Remember add to the crontab');
console.log('0,30 * * * * ' + process.mainModule['filename']);

getChromecastBackgrounds().then(function (backgrounds) {	
	console.log('got ' + backgrounds.length + ' wallpapers');
    var index = randomInt(0, backgrounds.length);
    console.log('setting ' + index + ' one');
    set(backgrounds[index]);
});