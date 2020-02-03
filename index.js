const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const router = express.Router();

const clientID = '671913842263195650';
const clientSecret = 'YyDzblJUL24U7XRL--vEFgs1QQkRhW7g';
const grantType = 'authorization_code';
const scope = 'identify';


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

router.get('/welcome',function(req,res){
  res.sendFile(path.join(__dirname+'/welcom.html'));
});

// Declare the redirect route
app.get('/oauth/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  axios({
    // make a POST request
    method: 'post',
    // to the Discord authentication API, with the client ID, client secret
    // and request token
    url: `https://discordapp.com/api/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=${grantType}&code=${requestToken}&scope=${scope}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  })
})

//add the router
app.use('/', router);
app.listen(3000,"localhost");

console.log('Running at Port 3000');
