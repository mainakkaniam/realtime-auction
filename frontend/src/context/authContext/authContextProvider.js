import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useReducer } from "react";

import { authReducer } from "./authReducer";
export const authContext = createContext();

const initialState = {
  user: "",
  isAuthReady: false,
};

function AuthContextProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const authReady = async () => {
      try {
        // Make a GET request to the server to check if the user is authenticated or logged in (at the very start when u open the application)
        const response = await fetch(`${process.env.REACT_APP_TO_BACKEND_URL}/users/login`, {
          credentials: 'include',
        });
        
        const res = await response.json();
        console.log("res=", res);
        // If the request was successful, set the authentication state to reflect the authenticated user
        if (res.status === "success") {
          dispatch({
            type: "SET_AUTH_READY",
            payload: res.data.user,
          });
          console.log("auth ready");
        }
        else
        {
                  dispatch({
          type: "SET_AUTH_READY",
          payload: null,
        });
        }
      } catch (error) {
        dispatch({
          type: "SET_AUTH_READY",
          payload: null,
        });
      }
    };
    authReady();
  }, []);

  // logout function self explanatory
  const handleLogout = async () => {
    const response = await fetch(`${process.env.REACT_APP_TO_BACKEND_URL}/users/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    const res= await response.json();

    dispatch({ type: "LOGOUT" });
  };

  return (
    <authContext.Provider value={{ ...authState, dispatch, handleLogout }}>
      {children}
    </authContext.Provider>
  );
}

export default AuthContextProvider;
