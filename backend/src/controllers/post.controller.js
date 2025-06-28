import { db } from "../db/index.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Retrieves posts from a database
export const getPosts = (req, res) => {
 try {
   // Select all posts from the posts table, ordered by date (newest first)
   const q = "SELECT * FROM posts ORDER BY date DESC";

   // Use the database object to query the database
   db.query(q, (err, data) => {
     // If there's an error, send a 500 status code and the error message
     if (err) return res.status(500).send(err);

     // Otherwise, send a 200 status code and the data as JSON
     return res.status(200).json(data);
   });
 } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve posts", details: err.message });

 }
};

// Retrieves a single post from the database
export const getPost = (req, res) => {
 try {
   // Select post by ID
   const q = "SELECT * FROM posts WHERE id = ?";

   // Use the database object to query the database for the post with the given ID
   db.query(q, [req.params.id], (err, data) => {
     // If there's an error, send a 500 status code and the error message
     if (err) return res.status(500).json(err);

     // If no post found, return 404
     if (data.length === 0) return res.status(404).json("Post not found");

     // Otherwise, send a 200 status code and the first item in the data array as JSON
     return res.status(200).json(data[0]);
   });
 } catch (error) {
  console.error("Unexpected error in getPost :", error);
  return res.status(500).json("Server error: ", + error.message)
 }
};

// Adds a new post to the database
export const addPost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid!");

    try {
      let imageUrl = null;

      // If there's an image file, upload it to Cloudinary
      console.log("image file path:", req.file.path)
      if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

           console.log("Cloudinary upload result:", cloudinaryResponse)
        if (cloudinaryResponse) {
          imageUrl = cloudinaryResponse.secure_url;
        } else {
          return res.status(500).json("Failed to upload image");
        }
      }

      // Otherwise, construct the SQL query to insert a new post into the database
      // Note: date field will be automatically set to CURRENT_TIMESTAMP by MySQL
      const q = "INSERT INTO posts(`title`, `description`, `image`, `userId`) VALUES (?, ?, ?, ?)";

      // Define an array of values to be inserted into the database
      const values = [
        req.body.title,
        req.body.description,
        imageUrl,
        userInfo.id,
      ];

      // Use the database object to execute the SQL query with the values array
      db.query(q, values, (err, data) => {
        // If there's an error, return a 500 status code and the error message
        if (err) return res.status(500).json(err);

        // Otherwise, return a 200 status code and a success message
        return res.json("Post has been created.");
      });
    } catch (error) {
      return res.status(500).json("Error creating post: " + error.message);
    }
  });
};

// Deletes a post from the database
export const deletePost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid");

    try {
      // Get the ID of the post to be deleted from the request parameters
      const postId = req.params.id;

      // First, get the post to check ownership and get image URL for deletion
      const getPostQuery = "SELECT * FROM posts WHERE id = ? AND userId = ?";

      db.query(getPostQuery, [postId, userInfo.id], async (err, data) => {
        if (err) return res.status(500).json("Database error");

        if (data.length === 0) {
          return res.status(403).json("You can delete only your post");
        }

        const post = data[0];

        // Delete image from Cloudinary if it exists
        if (post.image) {
          try {
            await deleteFromCloudinary(post.image);
          } catch (cloudinaryError) {
            console.error("Error deleting image from Cloudinary:", cloudinaryError);
            // Continue with post deletion even if image deletion fails
          }
        }

        // Delete the post from database
        const deleteQuery = "DELETE FROM posts WHERE id = ? AND userId = ?";

        db.query(deleteQuery, [postId, userInfo.id], (err, result) => {
          if (err) return res.status(500).json("Error deleting post");

          return res.json("Post has been deleted");
        });
      });
    } catch (error) {
      return res.status(500).json("Error deleting post: " + error.message);
    }
  });
};

// Update a post
export const updatePost = (req, res) => {
  // Get the access token from the request cookies.
  const token = req.cookies.access_token;

  // Check if the token exists, if not, return an error response.
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the token using the "jwtkey" secret key. If the token is not valid, return an error response.
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      // Get the post ID from the request parameters.
      const postId = req.params.id;

      // First, get the current post to check ownership and get current image URL
      const getCurrentPostQuery = "SELECT * FROM posts WHERE id = ? AND userId = ?";

      db.query(getCurrentPostQuery, [postId, userInfo.id], async (err, data) => {
        if (err) return res.status(500).json("Database error");

        if (data.length === 0) {
          return res.status(403).json("You can update only your post");
        }

        const currentPost = data[0];
        let imageUrl = currentPost.image; // Keep current image by default

        // If there's a new image file, upload it to Cloudinary
        if (req.file) {
          const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
          if (cloudinaryResponse) {
            // Delete old image from Cloudinary if it exists
            if (currentPost.image) {
              try {
                await deleteFromCloudinary(currentPost.image);
              } catch (cloudinaryError) {
                console.error("Error deleting old image from Cloudinary:", cloudinaryError);
                // Continue with update even if old image deletion fails
              }
            }
            imageUrl = cloudinaryResponse.secure_url;
          } else {
            return res.status(500).json("Failed to upload new image");
          }
        }

        // SQL query to update the post with new values.
        const q = "UPDATE posts SET `title`=?, `description`=?, `image`=? WHERE `id` = ? AND `userId` = ?";

        // An array containing the new values for the post.
        const values = [
          req.body.title || currentPost.title,
          req.body.description || currentPost.description,
          imageUrl
        ];

        // Execute the query using the values and post ID.
        db.query(q, [...values, postId, userInfo.id], (err, result) => {
          if (err) return res.status(500).json(err);
          return res.json("Post has been updated.");
        });
      });
    } catch (error) {
      return res.status(500).json("Error updating post: " + error.message);
    }
  });
};
