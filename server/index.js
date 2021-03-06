const path = require('path');
const http = require('http');
const Koa = require('koa');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const logger = require('koa-logger');
const mongoose = require('mongoose');
global.db = mongoose.createConnection('mongodb://127.0.0.1/tianzi_user', { promiseLibrary: Promise });

const app = new Koa();
const server = http.createServer(app.callback());

let port = 3001;
if (process.env.NODE_ENV === 'production') {
  port = 80;
}

const routes = require('./routes');

app.keys = ['secret', 'key'];
app.use(logger());
app.use(bodyParser());
app.use(serve(path.join(__dirname, '../public')));
//views
app.use(views(path.join(__dirname, '../views'), {
  map: {
    dt: 'dust'
  },
  extension: 'dt'
}));

// response router
app.use(async (ctx, next) => {
  await routes.routes()(ctx, next);
});

server.listen(port);
server.on('listening', () => {
  console.log(`Listening on port: ${port}`);
});
module.exports = app;
