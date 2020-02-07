const express = require('express');
const fetch = require('node-fetch');
const session = require("express-session");
const FormData = require('form-data');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: '***REMOVED***',
}));

const router = express.Router();
//check if users are logged in before routing

app.use(['/createTeam','/createMatch','/account','/logout'],function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
})

router.get('/',function(req,res){
  
  if (!req.session.user_id) {
    console.log(req.session.user_id);
    res.sendFile(path.join(__dirname,'/html/non-authenticated/home.html'));
  } else {
    console.log(req.session.user_id);
    res.sendFile(path.join(__dirname,'/html/authenticated/home_auth.html'));
  }
    
});

router.get('/about',function(req,res){
    
  if (!req.session.user_id) {
    res.sendFile(path.join(__dirname,'/html/non-authenticated/about.html'));
  } else {
console.log(req.session.user_id);

    res.sendFile(path.join(__dirname,'/html/authenticated/about_auth.html'));
  }
    
});

router.get('/createTeam', function(req,res){
console.log('create team');    
    res.sendFile(path.join(__dirname,'/html/authenticated/createTeam.html'));
    
});

router.get('/createMatch', function(req,res){
    
    res.sendFile(path.join(__dirname,'/html/authenticated/createMatch.html'));
    
});

router.get('/account', function(req,res){
    
    res.sendFile(path.join(__dirname,'/html/authenticated/account.html'));
    
});

router.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/');
    //res.sendFile(path.join(__dirname,'/html/non-authenticated/home.html'));
    
});

router.get('/welcome.html',function(req,res){
  res.sendFile(path.join(__dirname,'/welcome.html'));
  console.log(req.session.bugyba);
  //console.log(req.sessionID);
});

// Declare the redirect route
router.get('/oauth/redirect', function (req, res) {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code

  const data = new FormData();
  data.append('client_id', '***REMOVED***');
  data.append('client_secret', '***REMOVED***');
  data.append('grant_type', 'authorization_code');
  data.append('scope', 'identify');
  data.append('redirect_uri', 'https://www.nomadsands.com/oauth/redirect');
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
    res.redirect('/?username='+data.username)
  });
});

//add the router
app.use('/', router);
app.listen(3000,"localhost");

console.log('Running at Port 3000');
