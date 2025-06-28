import mysql from 'mysql2'

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '62V3@bvr',
  database: 'blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// export const db = await mysql.createConnection({
//   host: "localhost",

//   user: "root",
//   password : "62V3@bvr",
//   database: 'blog'
// })


// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection failed:", err.message);
//     process.exit(1); // Stop the app if DB doesn't connect
//   } else {
//     console.log("✅ Connected to MySQL Database");
//   }
// });
