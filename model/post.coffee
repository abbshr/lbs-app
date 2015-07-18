{db} = require '../.config'
thinky = require('thinky') db: db
type = thinky.type
r = thinky.r

module.exports = Post = thinky.createModel "Post",
  geopoint: type.point()
  location: type.string()
  time: type.date()
  ip: type.string()
  text: type.string()
  image: type.buffer()

Post.defineStatic "nearBy", (options, callback) ->
  @getNearest r.point(options.position...),
    index: "geopoint"
    maxResults: options.limit
    maxDist: options.distance
  .without 'dist'
  .getField 'doc'
  .without 'geopoint'
  .getJoin()
  .run()
  .then (posts) ->
    callback null, posts
  .error (err) ->
    callback err

Post.defineStatic "getPost", (postId, callback) ->
  @get postId
  .getJoin()
  .run()
  .then (post) ->
    callback null, post
  .error (err) ->
    callback err
