/*
 * [Shares.js] component is used to display shares information
 */

//import libraries
import React, { useEffect, useState, useContext } from "react";

//local imports
import SharesList from "../components/SharesList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Shares = () => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiating state
  const [loadedShares, setLoadedShares] = useState();

  //call to the custom http hook prior to the request as provides pointers to multiple require values such as state. Object destructuring used
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //fetching shares. [useEffect] hook allows to run certain code{} only on specific events[] instead of on each render
  useEffect(() => {
    //creating and call function inside as it is bad practice to return promise in [useEffect]
    const fetchShares = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          `http://localhost:5000/api/shares/user/${auth.userId}`
        );

        setLoadedShares(responseData.shares);

        console.log(responseData.shares); // <----------- diagnostic ------------- PLEASE DELETE ME ! -------------------
      } catch (err) {}
    };
    fetchShares();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && <SharesList items={loadedShares} />}
    </React.Fragment>
  );
};

//export method
export default Shares;
