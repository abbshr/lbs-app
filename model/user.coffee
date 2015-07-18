{db} = require '../.config'
thinky = require('thinky') db: db
type = thinky.type
r = thinky.r

module.exports = User = thinky.createModel "User",
  password: type.string()
  username: type.string()

User.defineStatic "find", (username, callback) ->
  @filter r.row('username').eq username
  .run()
  .then (user) ->
    callback null, user[0]
  .error (err) ->
    callback err

User.defineStatic 'getMap', (userId, callback) ->
  @get userId
  .getJoin()
  .without 'id', 'password'
  .run()
  .then (user) ->
    for post in user.posts
      post.user = username: user.username
      post
  .then (map) ->
    callback null, map
  .catch (err) ->
    callback err
