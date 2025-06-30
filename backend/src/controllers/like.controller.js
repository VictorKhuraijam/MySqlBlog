import { db } from "../db/index.js";
import jwt from "jsonwebtoken";



export const likePost = (req, res) => {
  const { postId } = req.params;
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const q = "INSERT INTO likes(userId, postId) VALUES (?, ?)";
    db.query(q, [userInfo.id, postId], (err, data) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json("Post already liked");
        }
        return res.status(500).json(err);
      }
      return res.status(200).json("Post liked successfully", data);
    });
  });
};


export const unlikePost = (req, res) => {
  const { postId } = req.params;
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";
    db.query(q, [userInfo.id, postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post unliked successfully");
    });
  });
};


export const getLikesCount = (req, res) => {
  const { postId } = req.params;

  const q = `
    SELECT COUNT(*) as likes
    FROM likes
    WHERE postId = ?;
  `;

  const q2 = `
    SELECT userId
    FROM likes
    WHERE postId = ?;
  `;

  db.query(q, [postId], (err, countData) => {
    if (err) return res.status(500).json(err);

  db.query(q2, [postId], (err, usersData) => {
      if (err) return res.status(500).json(err);

      const userIds = usersData.map((row) => row.userId);

      return res.status(200).json({
        likes: countData[0].likes,
        userIds: userIds
      });
    });
  });
};
