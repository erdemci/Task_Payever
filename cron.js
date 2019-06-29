const cron = require("node-cron");
const express = require("express");
var  app = express();
var request = require('request');

var url='https://reqres.in/api/';
var userList=[];
var currPage=1;
//https://reqres.in/api/users?page=1
  cron.schedule("* * * * *", function() {
    const link=url+"users?page="+currPage;
    request.get(
      link,
      function (error, response, body) {
          if (!error && response.statusCode == 200 || response.statusCode==201) {
             var u=JSON.parse(body).data;
             userList = [...new Set([...userList, ...u])];
             console.log(userList);
          }
          else
          console.log(error);
      }
    );
    currPage++;
  });


  app.listen(3001);
