import { useEffect, useState } from "react";
import Container from "../components/Container";
import axios from "axios";
import PostCard from "../components/PostCard";
import { backendUrl } from "../context/const";

const Home = () => {
  const [posts, setPosts] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/post`);
        console.log("post response :", res)
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);


  // const posts = [
  //   {
  //     id: 1,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 2,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 3,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 4,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  // ];


  

//  if(loading) return <div>Loading . . .</div>

  // if(error) return <div>Error: {error} </div>

  if(posts.length === 0 || !posts) return <div
  className="py-11 text-4xl text-black-100 font-sans text-center"
  >No posts available</div>

  return (
    <div className="w-full py-8">
      <Container>

          <div className="flex flex-wrap">
              {posts.slice() // Make a shallow copy of the posts array
                    .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()) // Sort by date
                    .map((post) => (
                <div
                    key={post.id}
                    className="p-2 w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                    <PostCard post={post}/>
                </div>

              ))}
            </div>
      </Container>
    </div>
  )
};

export default Home;
