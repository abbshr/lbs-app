# api routes

express = requrie 'express'
apiRouter = express.Router()

# models
Post = requrie '../model/post'
User = requrie '../model/user'

# 发布新po
# 文字, 图片, 视频, 音频, 评价
apiRouter.post '/post', (req, res, next) ->
  req.body.username = req.session.user.username
  Post.create req.body, (err, post) ->
    if err?
      res.json error: err
    else
      res.json success: yes

# 获取任何地理位置附近的po
apiRouter.get '/near', (req, res, next) ->
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
apiRouter.get '/map', (req, res, next) ->
  User.find
    req.query["user"] ? req.session.user.username
  , (err, user) ->
    if err?
      res.json error: err
    else
      Post.userMap user, (err, map) ->
        if err?
          res.json error: err
        else
          res.json
            success: yes
            map: map

# 单个po详细信息
apiRouter.get '/post', (req, res, next) ->
  Post.getPost req.query["postId"], (err, post) ->
    if err?
      res.json error: err
    else
      res.json
        success: yes
        post: post

module.exports = apiRouter
