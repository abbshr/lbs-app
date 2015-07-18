crypto = require 'crypto'

# 基础路由配置
module.exports = (app) ->

  User = app.get 'User'

  app.get '/', (req, res, next) ->
    res.render 'index'

  app.post '/login', (req, res, next) ->
    User.find req.body.username, (err, user) ->
      if err?
        res.json error: err.message
      else if user?
        shadow = crypto
          .createHash 'sha1'
          .update req.body.password
          .digest 'hex'

        if shadow is user.password
          req.session.user = user
          res.json success: yes
        else
          res.json error: "密码错误"
      else
        res.json error: '用户不存在'

  app.post '/registy', (req, res, next) ->
    User.find req.body.username, (err, user) ->
      if err?
        res.json error: err.toString()
      else if user?
        res.json error: '用户已存在'
      else
        req.body.password = crypto
          .createHash 'sha1'
          .update req.body.password
          .digest 'hex'

        new User req.body
        .save()
        .then (user) ->
          res.json success: yes
        .error (err) ->
          res.json error: err.message

  app.get '/logout', (req, res, next) ->
    req.session.user = null
    res.json success: yes
