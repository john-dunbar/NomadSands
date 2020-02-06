const express = require('express');
const fetch = require('node-fetch');
const session = require("express-session");
const FormData = require('form-data');
const path = require('path');

const app = express();

app.use(session({
  secret: 'myPassword',
}));

const router = express.Router();

const data = new FormData();
data.append('client_id', '671913842263195650');
data.append('client_secret', 'YyDzblJUL24U7XRL--vEFgs1QQkRhW7g');
data.append('grant_type', 'authorization_code');
data.append('scope', 'identify');
data.append('redirect_uri', 'https://www.nomadsands.com/oauth/redirect');


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

router.get('/welcome.html',function(req,res){
  res.sendFile(path.join(__dirname+'/welcome.html'));
  console.log(req.session.bugyba);
  //console.log(req.sessionID);
});

// Declare the redirect route
router.get('/oauth/redirect', function (req, res) {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  data.append('code',requestToken);
  console.log('before fetch');
  fetch('https://discordapp.com/api/oauth2/token', {
	method: 'POST',
	body: data,
  })
    
 .then(fetchResp => fetchResp.json())
 .then(tokenData => fetch('https://discordapp.com/api/users/@me', {
	headers: {
			authorization: `${tokenData.token_type} ${tokenData.access_token}`,
		},
	}))
  .then(userData => userData.json())
  .then(data => {
    console.log(data.username)
    req.session.user_id = data.username
    res.redirect('/welcome.html?username='+data.username)
  });
});

//add the router
app.use('/', router);
app.listen(3000,"localhost");

console.log('Running at Port 3000');
