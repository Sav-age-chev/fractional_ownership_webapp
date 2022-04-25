/*
 * [PropertyShare] is the page where the user can buy or sale his property shares
 */

//import libraries
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

//local imports
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

//style sheets
import "./PropertyForm.css";

//function
const UpdateProperty = () => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiating state
  const [loadedProperty, setLoadedProperty] = useState();

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //extracting property id from the url
  const propertyId = useParams().propertyId;

  //storing history stack as const
  const history = useHistory();

  //form
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //fetch property. [useEffect] executes the code within {} upon event from the [], instead on each render
  useEffect(() => {
    //instantiating asynchronous fetch function within the hook, as it is a bad practice to return a promise to [useEffect]
    const fetchProperty = async () => {
      try {
        //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/properties/${propertyId}`
        );
        //setting up state holding property data
        setLoadedProperty(responseData.property);

        console.log(loadedProperty);
        //setting up the form inputs to the existing values from the database
        setFormData(
          {
            title: {
              value: responseData.property.title,
              isValid: true,
            },
            description: {
              value: responseData.property.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProperty();
  }, [sendRequest, propertyId, setFormData]);

  //asynchronous function for submit event
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/properties/${propertyId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push('/' + auth.userId + '/properties');
    } catch (err) {}
  };

  //return spinner while [isLoading] is true
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  //return the message if there is no property or error response from the backend
  if (!loadedProperty && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find property!</h2>
        </Card>
      </div>
    );
  }

  //returns and display the response from the backend
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProperty && (
        <form className="property-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedProperty.title}
            initialValid={true}
          />

          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description. At least 5 characters."
            onInput={inputHandler}
            initialValue={loadedProperty.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROPERTY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

//export function
export default UpdateProperty;