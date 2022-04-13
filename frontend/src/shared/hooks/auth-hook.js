/*
 * [auth-hook] component is used for state change events related to the user, such as login/logout
 */

//import libraries
import { useState, useCallback, useEffect } from "react";

//variable to logout user once the token expires. Need to be outside the function as should not be rerendered
let logoutTimer;

//function managing login/logout states
export const useAuth = () => {
  //instantiating states
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  //login function
  const login = useCallback((uid, token, expirationDate) => {
    //manage states
    setToken(token);    
    setUserId(uid);
    //setting token expiration time
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    //setting state
    setTokenExpirationDate(tokenExpirationDate);
    //saving the the user id and token on the local storage of the browser. This way data will not be lost upon refresh event
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  //logout function
  const logout = useCallback(() => {
    //manage states
    setToken(null);
    setUserId(null);
    //resetting state
    setTokenExpirationDate(null);
    //removing the user data from the browser's local storage upon logout event
    localStorage.removeItem("userData");
  }, []);

  //actualise the timer upon token related events
  useEffect(() => {
    if (token && tokenExpirationDate) {
      //calculate the remaining time till token expires
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //[useEffect] will run once after the initial render cycle. The purpose of the following function is to create auto login
  useEffect(() => {
    //trying to retrieve user data from the browser's local storage
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
