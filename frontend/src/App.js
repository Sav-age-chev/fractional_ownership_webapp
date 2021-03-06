/*
 * [App.js] file is the root component and in a sense is the backbone of the app.
 * All the requests are redirected from here to the right file/component
 */

//import libraries
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//local imports
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { useAuth } from "./shared/hooks/auth-hook";
import { AuthContext } from "./shared/context/auth-context";

//styling sheet
import "./App.css";

//code splitting - rendering the imports dynamically
const Auth = React.lazy(() => import("./user/pages/Auth"));
const Users = React.lazy(() => import("./user/pages/Users"));
const Shares = React.lazy(() => import("./shares/pages/Shares"));
const ShareMarket = React.lazy(() => import("./shares/pages/ShareMarket"));
const UpdateShare = React.lazy(() => import("./shares/pages/UpdateShare"));
const NewProperty = React.lazy(() => import("./properties/pages/NewProperty"));
const AllProperties = React.lazy(() =>
  import("./properties/pages/AllProperties")
);
const UpdateProperty = React.lazy(() =>
  import("./properties/pages/UpdateProperty")
);
const UserProperties = React.lazy(() =>
  import("./properties/pages/UserProperties")
);

const App = () => {
  //object destructuring
  const { token, login, logout, userId } = useAuth();

  //instantiating local variable with the scope of the method
  let routes;

  // if (admin) {
  //   <Switch>
  //     {/* Create exact routing. "/" is a filter */}
  //     <Route path="/" exact>
  //       <AllProperties />
  //     </Route>
  //     {/* Create exact routing. "/" is a filter */}
  //     <Route path="/users" exact>
  //       <Users />
  //     </Route>
  //     {/* Create routing. "/auth" is a filter */}
  //     <Route path="/auth">
  //       <Auth />
  //     </Route>
  //     {/* If the path after the / is invalid user will be redirected back */}
  //     <Redirect to="/auth" />
  //   </Switch>;
  if (token) {
    routes = (
      <Switch>
        {/* Create exact routing. "/" is a filter */}
        <Route path="/" exact>
          <AllProperties />
        </Route>
        {/* Create exact routing. "/" is a filter */}
        <Route path="/users" exact>
          <Users />
        </Route>
        {/* Create exact routing. "/:userId/shares" is a filter */}
        <Route path="/:userId/shares" exact>
          <Shares />
        </Route>
        {/* Create exact routing. "/:userId/properties" is a filter */}
        <Route path="/:userId/properties" exact>
          <UserProperties />
        </Route>
        {/* Create exact routing. "/user/:userId/shareId" is a filter
        <Route path="/shares/:propertyId" exact>
          <AllProperties />
        </Route> */}
        {/* Create exact routing. "/properties/new" is a filter */}
        <Route path="/properties/new" exact>
          <NewProperty />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        <Route path="/properties/list" exact>
          <AllProperties />
        </Route>
        {/* /properties/:propertyId should be after /properties/new, else  */}
        {/* will be interpreted as the first route. Create exact routing. "/" is a filter */}
        <Route path="/properties/:propertyId">
          <UpdateProperty />
        </Route>
        {/* Create exact routing. "/shares/property/:shareId" is a filter */}
        <Route path="/shares/property/:propertyId">
          <ShareMarket />
        </Route>
        {/* Create exact routing. "/shares/:shareId" is a filter */}
        <Route path="/shares/:shareId">
          <UpdateShare />
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
          <AllProperties />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        <Route path="/properties/list" exact>
          <AllProperties />
        </Route>
        {/* Create exact routing. "/properties/new" is a filter */}
        <Route path="/properties/list" exact>
          <AllProperties />
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
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      {" "}
      {/* Context component have to be around all the components that will use it */}
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

//export component
export default App;
