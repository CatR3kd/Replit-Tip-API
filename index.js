const { fetch } = require('undici');
const express = require('express');
const app = express();
const url = require('url');
const { QuickDB } = require("quick.db");
const db = new QuickDB();


// Server and API

app.listen(8000, () => {
  console.log('Server online');
});

// /totalOnRepl?Id=REPLIDHERE
app.get('/totalOnRepl', async function(req, res) {
  const total = await totalOnRepl(req.query.replId);
  
  res.send({total: total});
});

// /hasTipped?username=USERNAMEHERE&replId=REPLIDHERE
app.get('/hasTipped', async function(req, res) {
  const hasTipped = await userTippedOnRepl(req.query.username, req.query.replId);
  
  res.send({hasTipped: hasTipped});
});

// /top?replId=REPLIDHERE
app.get('/top', async function(req, res) {
  const topUser = await topUserOnRepl(req.query.replId);
  
  res.send({topUser: topUser});
});

// /total?username=USERNAMEHERE&replId=REPLIDHERE
app.get('/total', async function(req, res) {
  const total = await userTotalOnRepl(req.query.username, req.query.replId);
  
  res.send({total: total});
});


// Classes

class User{
  constructor(){
    this.tippedRepls = {};
  }
}

class TippedRepl{
  constructor(){
    this.tips = {};
    this.total = 0;
  }
}

class Tip{
  constructor(amount, notificationId){
    this.amount = amount;
  }
}


// Data harvesting

async function getTips(){
  const query = `query Notifications($count: Int!) {
    notifications(count: $count) {
          items {
        ...on TipReceivedNotification {
        	id,
          tip { sender { username }, amount, repl { id }}
        }
      }
    }
  }`;
  const variables = {"count":1000};
  let notifications;
  
  await fetch('https://graphql-playground.pikachub2005.repl.co/', {method: 'POST', body: JSON.stringify({"queries":query,"variables":variables,"SID":process.env.REPLIT_TOKEN}), headers: {"Content-Type": "application/json"}})
  .then(r => r.json().then(res => {
  	notifications = res;
  }));

  let tips = [];

  for(let notification of notifications.notifications.items){
    if(Object.keys(notification).length > 0){
      const tip = {
        sender: notification.tip.sender.username,
        amount: notification.tip.amount,
        replId: notification.tip.repl.id,
        notificationId: notification.id,
      }

      tips.push(tip);
    }
  }

  return tips;
}

/*
type Tip {
  id: Int!
  amount: Int!
  timeCreated: Date!
  fee: Int!
  sender: User!
  recipient: User!
  repl: Repl
}
*/

async function updateUsers(){
  const tips = await getTips();

  for(let tip of tips){
    let user = await db.get(tip.sender);
    if(user == undefined) user = new User();

    let tippedRepl = user.tippedRepls[tip.replId];
    if(tippedRepl == undefined) tippedRepl = new TippedRepl();

    if(tippedRepl.tips[tip.notificationId] != undefined) return;

    tippedRepl.tips[tip.notificationId] = new Tip(tip.amount);
    tippedRepl.total += tip.amount;

    user.tippedRepls[tip.replId] = tippedRepl;
    db.set(tip.sender, user);
  }
}

updateUsers();
setInterval(updateUsers, 10_000);


// API functions

async function userTotalOnRepl(username, replId){
  const user = await db.get(username);
  if(user == undefined) return 0;
  
  let total = user.tippedRepls[replId].total;
  if(total == undefined) return 0;
  
  return total;
}

async function topUserOnRepl(replId){
  let users = await db.all();

  if(users.length < 1) return undefined;

  for(let i in users){
    const user = users[i].value;
    if(user.tippedRepls[replId] == undefined) users.splice(i, 1);
  }

  if(users.length < 1) return undefined;

  users.sort(function (a, b) {
    return b.tippedRepls[replId].total - a.tippedRepls[replId].total;
  });
  
  return(users[0].id);
}

async function userTippedOnRepl(username, replId){
  const user = await db.get(username);
  if(user == undefined) return false;
  
  return (user.tippedRepls[replId] != undefined);
}

async function totalOnRepl(replId){
  let users = await db.all();

  if(users.length < 1) return undefined;
  let total = 0;

  for(let i in users){
    const user = users[i].value;
    if(user.tippedRepls[replId] != undefined) total += user.tippedRepls[replId].total
  }
  
  return total;
}