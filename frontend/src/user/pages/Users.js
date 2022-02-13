import React from "react";

import UsersList from "../components/UsersList";

/*
 * [Users] component is used to store and display users information
 */

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Plamen Savchev",
      image:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260/",
      properties: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
