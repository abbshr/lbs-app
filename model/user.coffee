{db} = require '../.config'
thinky = require('thinky') db: db
type = thinky.type

module.exports = User = thinky.createModel "User",
  password: type.string()
  username: type.string()

User.defineStatic "find", (username, callback) ->
  @filter username: username
  .pluck "id", "username", "password"
  .run()
  .then (user) ->
    callback null, user
  .error (err) ->
    callback err
