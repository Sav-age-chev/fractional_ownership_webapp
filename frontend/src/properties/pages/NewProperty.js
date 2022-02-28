/*
 * [NewProperty] is the page where the user can add new property
 */

//import libraries
import React, { useContext } from "react";

//local imports
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

//style sheet
import "./PropertyForm.css";

//
const NewProperty = () => {
  //call the http client prior to the request as some of the values of the component are required, such as state. Object destructuring used
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //set up listener to the context
  const auth = useContext(AuthContext);

  //check if the form is valid
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //check if title/description is valid
  // const inputHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: "INPUT_CHANGE",
  //     value: value,
  //     isValid: isValid,
  //     inputId: id,
  //   });
  // }, []);

  //sending asynchronous http request to the back end via http hook with the extracted inputs
  const propertySubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:5000/api/property",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          price: formState.inputs.price.value,
          availableShares: formState.inputs.price.value,
          creator: auth.userId,
        })
      );
    } catch (err) {}
  };

  return (
    <form className="property-form" onSubmit={propertySubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description. At least 5 characters."
        onInput={inputHandler}
      />

      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />

      <Input
        id="price"
        element="input"
        label="Price"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid value."
        onInput={inputHandler}
      />

      <Button type="submit" disabled={!formState.isValid}>
        ADD PROPERTY
      </Button>
    </form>
  );
};

export default NewProperty;
