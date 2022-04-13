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
        <Route path="/" exact>
          {" "}
          {/* Create exact routing. "/" is a filter */}
          <Users />
        </Route>
        <Route path="/:userId/properties" exact>
          {" "}
          {/* Create exact routing. "/" is a filter */}
          <UserProperties />
        </Route>
        <Route path="/properties/new" exact>
          {" "}
          {/* Create exact routing. "/" is a filter */}
          <NewProperty />
        </Route>
        <Route path="/properties/:propertyId">
          {" "}
          {/* /properties/:propertyId should be after /properties/new, else  */}
          <UpdateProperty />{" "}
          {/* will be interpreted as the first route. Create exact routing. "/" is a filter */}
        </Route>
        <Redirect to="/" />{" "}
        {/* If the path after the / is invalid user will be redirected back */}
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          {" "}
          {/* Create exact routing. "/" is a filter */}
          <Users />
        </Route>
        <Route path="/:userId/properties" exact>
          {" "}
          {/* Create exact routing. "/" is a filter */}
          <UserProperties />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />{" "}
        {/* If the path after the / is invalid user will be redirected back */}
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
