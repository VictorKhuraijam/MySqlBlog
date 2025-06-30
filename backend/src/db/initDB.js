import { db } from './index.js'

export const createTables = async () => {
  try {
    // Create `users` table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Create `posts` table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        userId INT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    //Create like table
    await db.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      postId INT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      UNIQUE KEY unique_like (userId, postId)
    );
  `);

    console.log("Tables created successfully.");
  } catch (err) {
    console.error(" Error creating tables:", err.message);
  }
};
