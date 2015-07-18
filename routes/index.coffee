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
      User.get req.session.user.id
      .getJoin()
      .run()
      .then (user) ->
        req.user = user
        next()
    else
      res.json error: '你尚未登录'
  .post (req, res, next) ->
    req.body.time = new Date
    req.body.ip = req.ip
    req.body.geopoint = [+req.body.lng, +req.body.lat]
    req.body.image = req.files.image?.buffer
    post = new Post req.body
    user = req.user
    user.posts.push post
    user.saveAll()
    .then (user) ->
      delete user.posts
      post.user = user
      post.saveAll()
    .then (post) ->
      res.json success: yes
    .error (err) ->
      res.json error: err.message

  # 单个po详细信息
  # GET => /post?postId=xxx
  .get (req, res, next) ->
    Post.getPost req.query["postId"], (err, post) ->
      if err?
        res.json error: err.message
      else
        res.json
          success: yes
          post: post

  # 获取任何地理位置附近的po
  # GET => /near?lng=126.555&lat=45.233&distance=2000&limit=150
  apiRouter.get '/near', (req, res, next) ->
    position = [+req.query["lng"], +req.query["lat"]]
    distance = +req.query["distance"]
    limit = +req.query["limit"]

    Post.nearBy
      position: position
      distance: distance
      limit: limit
    , (err, posts) ->
      if err?
        res.json error: err.message
      else
        res.json
          success: yes
          posts: posts

  # 个人地图
  # GET => /map?user=haoge
  apiRouter.route '/map'
  .get (req, res, next) ->
    if req.query["user"]
      req.userId = req.query["user"]
      next()
    else if req.session.user?
      req.userId = req.session.user.id
      next()
    else
      res.json error: "你尚未登录"
  .get (req, res, next) ->
    User.getMap req.userId, (err, user) ->
      if err?
        res.json error: err.message
      else
        res.json
          success: yes
          map: user.posts

  # 挂载到app
  app.use '/api', apiRouter
