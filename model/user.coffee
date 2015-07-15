{db} = require '../.config'
thinky = require('thinky') db: db
type = thinky.type
r = thinky.r

module.exports = User = thinky.createModel "User",
  password: type.string()
  username: type.string()

User.defineStatic "find", (username, callback) ->
  @filter r.row('username').eq username
  .pluck "id", "username", "password"
  .run()
  .then (user) ->
    callback null, user[0]
  .error (err) ->
    callback err
