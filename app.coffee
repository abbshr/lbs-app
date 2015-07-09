express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
multer = require('multer')
session = require('express-session')
RDBStore = require('express-session-rethinkdb') session

apiRouter = require './routes/index'
routes = require './routes/routes'

Post = require './model/post'
User = require './model/user'

{db, host, port} = require './.config'

User.hasMany Post, "posts", "id", "userId"
Post.belongsTo User, "user", "userId", "id"

apiRouter.set 'User', User
apiRouter.set 'Post', Post

app = express()

app.set 'User', User
app.set 'Post', Post

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'ejs'

# session
app.set 'cookie',
  secret: "lbsapp"
  cookie:
    maxAge: 1000 * 60 * 60 * 24 * 7
  store: new RDBStore
    connectOptions:
      db: db
      host: host
      port: port

# uncomment after placing your favicon in /public
#app.use(favicon(__dirname + '/public/favicon.ico'))
app.use logger 'dev'
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use multer()
app.use cookieParser()
app.use express.static path.join(__dirname, 'public')
app.use session app.get 'cookie'

# locals保存session
app.use (req, res, next) ->
  res.locals.session = req.session
  next()

# 基础路由
routes app
# api
app.use '/api', apiRouter

# catch 404 and forward to error handler
app.use (req, res, next) ->
  err = new Error 'Not Found'
  err.status = 404
  next err

# error handlers

# development error handler
# will print stacktrace
if app.get('env') is 'development'
  app.use (err, req, res, next) ->
    res.status(err.status or 500)
    res.render 'error',
      message: err.message
      error: err

# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status(err.status or 500)
  res.render 'error',
    message: err.message
    error: {}

module.exports = app
