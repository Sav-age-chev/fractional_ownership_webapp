/*
 * [NewProperty] is the page where the user can add new property
 */

//import libraries
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

//local imports
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  //storing history stack as const
  const history = useHistory();

  //sending asynchronous http request to the back end via http hook with the extracted inputs
  const propertySubmitHandler = async (event) => {
    console.log(
      formState.inputs.title.value,
      formState.inputs.description.value,
      formState.inputs.address.value,
      formState.inputs.price.value,
      auth.userId,
      formState.inputs.image.value
    );

    event.preventDefault();
    try {
      //[FormData] browser API used to pass data including images. Need to use form data because JSON can not process images/binary
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      console.log("hello1"); // <------ diagnostic -------- DELETE ME ! -----------

      await sendRequest(
        "http://localhost:5000/api/properties",
        "POST",
        formData
        /* headers: [FormData] automatically set the headers */
      );
      //redirect user to different page
      history.push("/");
    } catch (err) {
      console.log("error apparently"); // <------ diagnostic -------- DELETE ME ! -----------
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="property-form" onSubmit={propertySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD PROPERTY
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewProperty;
