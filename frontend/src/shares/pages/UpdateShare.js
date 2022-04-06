/*
 * [UpdateShare] is the page where the user can buy/sell/update shares
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
import "./ShareForm.css";

//function
const UpdateShare = () => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiating state
  //const [loadedProperty, setLoadedProperty] = useState();
  const [loadedShare, setLoadedShare] = useState();

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //extracting share id from the url
  const shareId = useParams().shareId;
  //const propertyId = useParams().propertyId;   // <---------------------------------  PROBABLY NOT GONNA NEED THAT ----------------------------------

  //storing history stack as const
  const history = useHistory();

  //form
  const [formState, inputHandler, setFormData] = useForm(
    {
      share: {
        value: "",
        isValid: false,
      },
      //   forSale: {
      //     value: false,
      //     isValid: false,
      //   },
    },
    false
  );

  //fetch share. [useEffect] executes the code within {} upon event from the [], instead on each render
  useEffect(() => {
    //instantiating asynchronous fetch function within the hook, as it is a bad practice to return a promise to [useEffect]
    const fetchShare = async () => {
      try {
        //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
        const responseData = await sendRequest(
          `http://localhost:5000/api/shares/${shareId}`
        );
        //setting up state holding share data
        setLoadedShare(responseData.share);

        //setting up the form inputs to the existing values from the database
        setFormData(
          {
            share: {
              value: responseData.share.share,
              isValid: true,
            },
            // forSale: {
            //   value: responseData.share.forSale,
            //   isValid: true,
            // },
          },
          true
        );
      } catch (err) {}
    };
    fetchShare();
  }, [sendRequest, shareId, setFormData]);

  //asynchronous function for submit event
  const shareUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
      await sendRequest(
        `http://localhost:5000/api/shares/edit/${shareId}`,
        "PATCH",
        JSON.stringify({
          share: formState.inputs.share.value,
          forSale: formState.inputs.forSale.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/" + auth.userId + "/shares");
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

  //return the message if there is no share or error response from the backend
  if (!loadedShare && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find shares!</h2>
        </Card>
      </div>
    );
  }

  //returns and display the response from the backend
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedShare && (
        <form className="share-form" onSubmit={shareUpdateSubmitHandler}>

          <div className="">
            <h2>{loadedShare.share.shareProperty.title}</h2>
            <p>{loadedShare.share.shareProperty.description}</p>
            <h3>{loadedShare.share.cost}</h3>
            <h3>{loadedShare.share.share}</h3>
            <h4>BUY/SELL</h4>
          </div>

          <Input
            id="share"
            element="input"
            type="number"
            label="Share"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid number."
            onInput={inputHandler}
            initialValue={loadedShare.share}
            initialValid={true}
          />

          {/* <input
            type="checkbox"
            checked="unchecked"
            name="For Sale"
            disabled="disabled"
          >
            For Sale
          </input> */}

          {/* <Input
            id="forSale"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description. At least 5 characters."
            onInput={inputHandler}
            initialValue={loadedProperty.description}
            initialValid={true}
          /> */}

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE SHARE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

//export function
export default UpdateShare;
