r = require 'rethinkdb'

class Post

  @db: "lbsapp"

  @create: (schema, callback) ->
    r.connect
      db: @db
    , (err, conn) ->
      if err?
        callback err
      else
        r
        .table "posts"
        .insert schema
        .run conn, (err) ->
          if err?
            callback err
          else
            callback null

  @nearBy: (options, callback) ->
    r.connect
      db: @db
    , (err, conn) ->
      if err?
        callback err
      else
        r
        .table "post"
        .getNearest r.point(options.position),
          index: "geopoint"
          maxResults: options.limit
          maxDist: options.distance
        .run conn, (err) ->
          if err?
            callback err
          else
            callback null, posts

    callback err, posts

  @userMap: (user, callback) ->
    callback err, map

  @getPost: (postId, callback) ->
    callback err, post

module.exports = Post
