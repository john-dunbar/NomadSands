const https = require('https');
const express = require('express');

const app = express();

const httpsOptions = {
    cert: fs.readFileSync('www_nomadsands_com.crt'),
    ca: fs.readFileSync('www_nomadsands_com.ca-bundle'),
    key: fs.readFileSync('private-key.pem')
};

const httpsServer = https.createServer(httpsOptions, app);

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
        res.sendFile(path.join(__dirname+'/login.html'));
    })

    // process the form (POST http://localhost:8080/login)
    .post(function(req, res) {
        
        res.sendFile(path.join(__dirname+'/index.html'));
    });

//add the router
app.use('/', router);
httpsServer.listen(443, 'nomadsands.com');

console.log('Running at Port 443');
