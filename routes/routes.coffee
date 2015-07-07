User = require '../model/user'
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
        req.session.user = user
        res.json success: yes
      else
        res.json error: new Error 'user not found'

  app.post '/registy', (req, res, next) ->
    User.find
      name: req.body.username
    , (err, user) ->
      if err? or not user?
        res.json error: err
      else
        User.create req.body, (err) ->
          if err?
            res.json error: err
          else
            res.json success: yes

  app.get '/logout', (req, res, next) ->
    req.session.user = null
    res.json success: yes
