r = require 'rethinkdb'

class User

  @db: "lbsapp"

  @find: (username, callback) ->
    r.connect
      db: @db
    , (err, conn) ->
      if err?
        callback err
      else
        r
        .table "users"
        .filter username: username
        .run conn, (err) ->
          if err?
            callback err
          else
            callback null, user

  @create: (schema, callback) ->
    r.connect
      db: @db
    , (err, conn) ->
      if err?
        callback err
      else
        r
        .table "users"
        .insert schema
        .run conn, (err) ->
          if err?
            callback err
          else
            callback null

module.exports = User
