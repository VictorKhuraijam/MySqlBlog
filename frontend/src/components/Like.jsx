import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { backendUrl } from "../context/const";
import likeIcon from "../assets/like.svg";
import likedIcon from "../assets/Liked.png";

export default function LikeButton({ postId }) {
  const { currentUser } = useContext(AuthContext);
  const [likedusers, setLikedUsers] = useState([]);
  const [currentUserLike, setCurrentUserLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch like status and count
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/like/count/${postId}`,
          {
            withCredentials: true,
        });
        console.log("like data :", res);

        setLikeCount(res.data.likes);
        setLikedUsers(res.data.userIds);


        if (currentUser && res.data.userIds.includes(currentUser.id)) {
          setCurrentUserLike(true);
          console.log("Current user has liked this post");
        } else {
          setCurrentUserLike(false);
          console.log("Current user has not liked this post");
        }

        console.log("Liked Users:", res.data.userIds);
      } catch (err) {
        console.error("Failed to fetch like status", err);
      }
    };

    if (postId && currentUser) {
      fetchLikes();
    }
  }, [postId, currentUser]);

  // Handle like toggle
  const toggleLike = async () => {
    if (!currentUser) return alert("Please log in to like posts.");

    try {
      if (currentUserLike) {
        await axios.delete(
          `${backendUrl}/like/unlike/${postId}`,
        {
          withCredentials: true,
        });
        setCurrentUserLike(false);
        setLikeCount((prev) => prev - 1);
        // Update the liked users array
        setLikedUsers((prev) => prev.filter(id => id !== currentUser.id));
        console.log("Post unliked");
      } else {
        await axios.post(
          `${backendUrl}/like/${postId}`,
          {},
        {
          withCredentials: true,
        });
        setCurrentUserLike(true);
        setLikeCount((prev) => prev + 1);
        // Update the liked users array
        setLikedUsers((prev) => [...prev, currentUser.id]);
        console.log("Post liked");
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <img
        src={currentUserLike ? likedIcon : likeIcon}
        alt="like"
        width={25}
        height={25}
        onClick={toggleLike}
        className={`cursor-pointer ${!currentUser ? "opacity-50" : ""}`}
      />
      <span className="text-sm">{likeCount > 0 && likeCount}</span>
    </div>
  );
}
