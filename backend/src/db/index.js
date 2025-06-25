import mysql from 'mysql'

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password : "62V3@bvr",
  database: 'blog'
})
