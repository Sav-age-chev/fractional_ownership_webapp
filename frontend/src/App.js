/*
 * [App.js] file is the root component and in a sense is the backbone of the app.
 * All the requests are redirected from here to the right file/component
 */

//import libraries
import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//local imports
import Auth from "./user/pages/Auth";
import Users from "./user/pages/Users";
import NewProperty from "./properties/pages/NewProperty";
import AllProperties from "./properties/pages/AllProperties";
import UpdateProperty from "./properties/pages/UpdateProperty";
import UserProperties from "./properties/pages/UserProperties";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

//styling sheet
import "./App.css";

const App = () => {
  //instantiating states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  //manage states
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  //manage states
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        {/* Create exact routing. "/" is a filter */}
        <Route path="/" exact>
          <Users />
        </Route>
        {/* Create exact routing. "/:userId/properties" is a filter */}
        <Route path="/:userId/properties" exact>
          <UserProperties />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        <Route path="/properties/new" exact>
          <NewProperty />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        {/* <Route path="/properties/list" exact>
          <AllProperties />
        </Route> */}
        {/* /properties/:propertyId should be after /properties/new, else  */}
        {/* will be interpreted as the first route. Create exact routing. "/" is a filter */}
        <Route path="/properties/:propertyId">
          <UpdateProperty />
        </Route>
        {/* If the path after the / is invalid user will be redirected back */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* Create exact routing. "/" is a filter */}
        <Route path="/" exact>
          <Users />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        {/* <Route path="/properties/list" exact>
          <AllProperties />
        </Route> */}
        {/* Create exact routing. "/" is a filter */}
        <Route path="/:userId/properties" exact>
          <UserProperties />
        </Route>
        {/* Create routing. "/auth" is a filter */}
        <Route path="/auth">
          <Auth />
        </Route>
        {/* If the path after the / is invalid user will be redirected back */}
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      {" "}
      {/* Context component have to be around all the components that will use it */}
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

//export component
export default App;
