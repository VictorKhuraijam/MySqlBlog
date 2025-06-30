import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { backendUrl } from "./const";

export const AuthContext = createContext();


export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        `${backendUrl}/auth/login`,
         inputs,
        { withCredentials: true,}
      );
      setCurrentUser(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  const logout = async () => {
    await axios.post(`${backendUrl}/auth/logout`);
    setCurrentUser(null);
    localStorage.removeItem('user')
  };

  useEffect(() => {
     if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
    // localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
