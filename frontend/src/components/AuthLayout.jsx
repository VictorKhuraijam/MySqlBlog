import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import  {AuthContext}  from '../context/authContext'


export default function Protected({children, authentication = true}) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const {currentUser} = useContext(AuthContext)

  const authStatus = currentUser ? true : false
  // const authStatus = !!currentUser

  useEffect(() => {

    // if(authStatus === true){
    //   navigate("/")
    // } else if(authStatus === false){
    //   navigate("/login")
    // }
    const checkAuth = () => {

       if (authentication && !authStatus) {
          navigate("/login");
        } else if (!authentication && authStatus) {
          navigate("/");
        }
      setLoading(false); //set loading outside of rehydration to prevent from setting loading to true if user is not authenticated
    };

    checkAuth();
  }, [authStatus, navigate, authentication])



  return loading ? <h1>loading...</h1> : <> {children} </>
}
