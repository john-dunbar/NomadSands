const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/darkTheme.css',function(req,res){
  res.sendFile(path.join(__dirname+'/darkTheme.css'));
  //__dirname : It will resolve to your project folder.
});

router.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/about.html'));
});

router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});

router.get('/Javascript/menuClick.js',function(req,res){
  res.sendFile(path.join(__dirname+'/Javascript/menuClick.js'));
});

app.route('/login')

    // show the form (GET http://localhost:8080/login)
    .get(function(req, res) {
        res.send(__dirname+'/login.html');
    })

    // process the form (POST http://localhost:8080/login)
    .post(function(req, res) {
        
        res.send(__dirname+'/index.html');
    });

//add the router
app.use('/', router);
app.listen(process.env.port || 8080);

console.log('Running at Port 8080');
