/*
 * [http-hook] is custom hook used for the all the http request from the
 * front rend to the back end to prevent code repetition
 */

//import libraries
import { useState, useCallback, useRef, useEffect } from "react";

//instantiating function to handle Http requests
export const useHttpClient = () => {
  //instantiating states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //handle requests if no longer needed e.g. after request is sent the user switch the page. The array will store data between rerendering cycles
  const activeHttpRequests = useRef([]);

  //http request. useCallback prevents infinite loop
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      //manage state
      setIsLoading(true);

      //using browser function
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method, // method = method: method
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        //remove board controller from the array when request completes
        activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
        );

        //handles error messages from the backend with 400/500 status
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        //manage state
        setIsLoading(false);

        //return the requested data
        return responseData;
      } catch (err) {
        setError(err.message);

        //manage state
        setIsLoading(false);

        //throws the error and prevent continuation 
        throw err;
      }
    },
    []
  );

  //manage state - setting error stat back to null
  const clearError = () => {
    setError(null);
  };

  //cleanup function when components unmount
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  //returns states and data
  return { isLoading, error, sendRequest, clearError }; //isLoading = isLoading: isLoading
};
