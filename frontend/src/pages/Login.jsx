//import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs)
      navigate("/");
    } catch (err) {
      setError(err.data);
    }
  };

  return (
    <div className='flex items-center justify-center mt-10 mb-10'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
    <div className="className='flex flex-col item justify-center gap-5">
       <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>


            <form className='flex flex-col item justify-center gap-5 mt-15'>
              <input
                className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full'
                required
                type="text"
                placeholder="username"
                name="username"
                onChange={handleChange}
              />
              <input
                className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full'
                required
                type="password"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
              <button
               className='px-4 py-2 rounded-lg bg-blue-600 text-white'
               onClick={handleSubmit}
               >Login</button>
              {err && <p>{err}</p>}

            </form>

             <p className='mt-2 text-center text-base text-black/60'>
            Don&apos;t have any account?&nbsp;

            <Link
              to="/signup"
              className='font-medium text-primary transition-all text-blue-600 duration-200 hover:underline'
            >
              Sign Up
            </Link>
        </p>
    </div>
    </div>
    </div>

  );
};

export default Login;
