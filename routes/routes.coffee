crypto = require 'crypto'

# 基础路由配置
module.exports = (app) ->
  app.get '/', (req, res, next) ->
    res.render 'home'

  app.post '/login', (req, res, next) ->
    User.find
      name: req.body.username
    , (err, user) ->
      if err?
        res.json error: err
      else if user?
        shadow = crypto
          .createHash 'sha1'
          .update req.body.password
          .digest 'hex'

        if shadow is user.password
          req.session.user = user
          res.json success: yes
        else
          res.json error: new Error "incorrect password"
      else
        res.json error: new Error 'user not found'

  app.post '/registy', (req, res, next) ->
    app
    .get "User"
    .find
      name: req.body.username
    , (err, user) ->
      if err? or not user?
        res.json error: err
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
          res.json error: err

  app.get '/logout', (req, res, next) ->
    req.session.user = null
    res.json success: yes
