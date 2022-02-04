import { createContext } from "react";

/*
 * [auth-context] component stores data if the customer is logged in or not.
 * CONTEXT allows to pass date between any components in the application without
 * using PROPS
 */

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
