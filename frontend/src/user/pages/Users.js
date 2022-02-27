/*
 * [Users.js] component is used to display users information
 */

//import libraries
import React, { useEffect, useState } from "react";

//local imports
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  //instantiating state
  const [loadedUsers, setLoadedUsers] = useState();

  //call to the custom http hook prior to the request as provides pointers to multiple require values such as state. Object destructuring used
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //fetching users. useEffect hook allows to run certain code{} only on specific events[] instead of on each render
  useEffect(() => {
    //creating and call function inside as it is bad practice to return promise in [useEffect]
    const fetchUsers = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
