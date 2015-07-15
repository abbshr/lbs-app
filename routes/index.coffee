# api routes

# HTTP API

express = require 'express'
apiRouter = express.Router()

module.exports = (app) ->

  Post = app.get 'Post'
  User = app.get 'User'

  apiRouter.route '/post'
  # 发布新po
  # 文字, 图片
  # POST => /post
  .post (req, res, next) ->
    if req.session.user?.id?
      next()
    else
      res.json error: (new Error 'not login!').toString()
  .post (req, res, next) ->
    req.body.time = new Date
    req.body.ip = req.ip
    req.body.userId = req.session.user?.id
    req.body.geopoint = [+req.body.lng, +req.body.lat]
    new Post req.body
    .save()
    .then (post) ->
      res.json success: yes
    .error (err) ->
      res.json error: err

  # 单个po详细信息
  # GET => /post?postId=xxx
  .get (req, res, next) ->
    Post.getPost req.query["postId"], (err, post) ->
      if err?
        res.json error: err
      else
        res.json
          success: yes
          post: post

  # 获取任何地理位置附近的po
  # GET => /near?lng=126.555&lat=45.233&distance=2000&limit=150
  apiRouter.get '/near', (req, res, next) ->
    console.log req.session
    position = [+req.query["lng"], +req.query["lat"]]
    distance = +req.query["distance"]
    limit = +req.query["limit"]

    Post.nearBy
      position: position
      distance: distance
      limit: limit
    , (err, posts) ->
      if err?
        res.json error: err
      else
        res.json
          success: yes
          posts: posts

  # 个人地图
  # GET => /map?user=haoge
  apiRouter.get '/map', (req, res, next) ->
    User.find req.query["user"] ? req.session.user.username, (err, user) ->
      if err?
        res.json error: err
      else
        Post.userMap user.id, (err, map) ->
          if err?
            res.json error: err
          else
            res.json
              success: yes
              map: map

  # 挂载到app
  app.use '/api', apiRouter
