var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../jobsearchattempt2.zip');
var kuduApi = 'https://jobsearchattempt2.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$jobsearchattempt2';
var password = 'sr2rXva8uyqXErN76lGew4qi8DF3ftQk7ldBXBLnuGawvAfnFmprlfs1f3Pl';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('jobsearchattempt2 publish');
  } else {
    console.error('failed to publish jobsearchattempt2', err);
  }
});