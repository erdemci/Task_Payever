var express=require("express");
var app=express();
var request = require('request');
var port=3000;
var url='https://reqres.in/api/';
var fs=require("fs");
const image2base64 = require('image-to-base64');
const download = require('image-downloader');

app.use(express.static('avatars'));

  //https://reqres.in/api/users?page=1
  //https://reqres.in/api/users/1

  function idValidate(param){
      try {
        return  parseInt(param);
      } catch (error) {
          console.error(error);
          return 0;
      }
  }

//https://reqres.in/api/users/1
  app.get('/api/user/:userId',function(req,res){

      var id=idValidate(req.params.userId);
      if(id>0){
          console.log(id);
          const link=url+"users/"+id;
          request.get(
            link,
            function (error, response, body) {
                if (!error && response.statusCode == 200 || response.statusCode==201) {
                   res.send(response.body);
                }
                else
                console.log(error);
            }
        );
      }
  });
  const uploadDir = './avatars/';
 

  app.get('/api/user/:userId/avatar',function(req,res){

    var id=idValidate(req.params.userId);
    if(id>0){
        console.log(id);
        let link=url+"users/"+id;
       request.get(link,function(err,r,b){
           if(!err && r.statusCode==200){
            var user=JSON.parse(r.body).data;
            var p='out'+id;
            download.image({url:user.avatar,dest:uploadDir+id+".jpg"})
                .then(({ filename, image }) => {
                    console.log('File saved to', filename)

                    image2base64(uploadDir+id+".jpg")
                        .then(
                            (response) => {
                                var f=uploadDir+id+".txt";
                                //write file base64txt
                                fs.appendFile(f, response, function (err) {
                                    if (err) throw err;
                                        console.log('base64 Saved!');
                                });
                                res.send(response);
                            }
                        )
                        .catch(
                            (error) => {
                                console.log(error); //Exepection error....
                            }
                        )
                })
                .catch((err) => {
                    console.error(err)
            })
            
           }
       });
    }
});

app.delete('/api/user/:userId',function(req,res){
    var id=idValidate(req.params.userId);
    if(id>0){
        const pPath = uploadDir+id+".jpg";
        const fPath=uploadDir+id+".txt";

        try {
        fs.unlinkSync(pPath)
        fs.unlinkSync(fPath);
        //file removed
        } catch(err) {
        console.error(err)
        }
    }
})


  app.listen(port, () => console.log('Example app listening on port ${port}!'));