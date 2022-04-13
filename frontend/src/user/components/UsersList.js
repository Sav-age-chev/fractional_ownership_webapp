/*
 * [UsersList] components used to display list of users
 */

//import libraries
import React from "react";

//local imports
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

//stylesheet
import "./UsersList.css";

//function
const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          propertyCount={user.properties.length}
        />
      ))}
    </ul>
  );
};

//export function
export default UsersList;