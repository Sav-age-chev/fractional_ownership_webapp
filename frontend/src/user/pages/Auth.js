/*
 * [Auth.js] file is responsible for the user authentication
 */

//import libraries
import React, { useState, useContext } from "react";

//local imports
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

//styling sheet
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  //instantiating state
  const [isLoginMode, setIsLoginMode] = useState(true);

  //call to the custom http hook prior to the request as some of the values of the component are required, such as state. Object destructuring used
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //login mode
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //adding name field for signup mode
  const switchModeHandler = (event) => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //sending login/signup request with asynchronous method
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs); //<------ diagnostic ----------- DELETE ME ! ----------------

    if (isLoginMode) {
      //LOGIN

      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url, method, body & headers as arguments
        const responseData = await sendRequest(
          /* URL */
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          /* METHOD */
          "POST",
          /* body: the data. Converts JavaScript to JSON data */
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          /* headers: type of data */ {
            "Content-Type": "application/json",
          }
        );

        //login user
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      //SIGNUP

      try {
        //[FormData] browser API used to pass data including images. Need to use form data because JSON can not process images/binary
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url, method, body & headers as arguments
        const responseData = await sendRequest(
          /* URL */
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          /* METHOD */
          "POST",
          /* body: the data. passing the [FormData] object */
          formData
          /* headers: [FormData] automatically set the headers */
        );

        //login user
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name."
              onInput={inputHandler}
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />

          <Input
            element="input"
            id="password"
            type="password"
            label="password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password."
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

//export component
export default Auth;
