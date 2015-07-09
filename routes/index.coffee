# api routes

express = requrie 'express'
app = express.Router()

# 发布新po
# 文字, 图片, 视频, 音频, 评价
app.post '/post', (req, res, next) ->
  Post = app.get 'Post'
  # TODO: 根据geopoint查询location
  req.body.time = (new Date).getTime()
  req.body.ip = req.ip
  req.body.userId = req.session.user.id
  new Post req.body
  .save()
  .then (post) ->
    res.json success: yes
  .error (err) ->
    res.json error: err

# 获取任何地理位置附近的po
app.get '/near', (req, res, next) ->
  Post = app.get 'Post'
  position = req.query["position"]
  distance = req.query["distance"]
  limit = req.query["limit"]

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
app.get '/map', (req, res, next) ->
  User = app.get 'User'
  Post = app.get 'Post'
  User.find
    req.query["user"] ? req.session.user.username
  , (err, user) ->
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

# 单个po详细信息
app.get '/post', (req, res, next) ->
  Post.getPost req.query["postId"], (err, post) ->
    if err?
      res.json error: err
    else
      res.json
        success: yes
        post: post

module.exports = app
