#!/usr/bin/env coffee

r = require 'rethinkdb'
{db} = require './.config'
r.connect()
.then (conn) ->
  r.dbList()
  .run conn
  .then (dbs) ->
    # 创建数据库
    if db not in dbs
      r.dbCreate db
      .run conn
    else
      console.log "#{db}已存在"
  .then (result) ->
    conn.use db
    console.log "创建数据库#{db}"
    r.tableList()
    .run conn
  .then (tbs) ->
    if "session" not in tbs
      # 创建session表
      r.tableCreate "session"
      .run conn
      .then () ->
        console.log "创建session表"
      .catch (err) ->
        console.error err
    else
      console.log "session已存在"

    if "Post" not in tbs
      # 创建表
      r.tableCreate "Post"
      .run conn
    else
      console.log "table已存在"
  .then (result) ->
    r.table "Post"
    .indexList()
    .run conn
  .then (indexs) ->
    if "geopoint" not in indexs
      # 创建索引
      r.table "Post"
      .indexCreate "geopoint", geo: true
      .run conn
    else
      console.log "索引已存在"
  .then (result) ->
    console.log "为Post表创建地理位置数据索引"
    process.exit(0);
  .error (err) ->
    console.log err
.error (err) ->
  console.log err
