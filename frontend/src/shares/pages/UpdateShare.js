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
import Checkbox from "../../shared/components/FormElements/Checkbox";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import PropertyItem from "../../properties/components/PropertyItem";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

//style sheets
import "./UpdateShare.css";

//function
const UpdateShare = () => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiating state
  const [loadedProperty, setLoadedProperty] = useState();
  const [loadedShare, setLoadedShare] = useState();
  const [forSaleCheckbox, setForSaleCheckbox] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //extracting share id from the url
  const shareId = useParams().shareId;

  //storing history stack as const
  const history = useHistory();

  //form
  const [formState, inputHandler, setFormData] = useForm(
    {
      // share: {
      //   value: "",
      //   isValid: false,
      // },
      sellPrice: {
        value: "",
        isValid: false,
      },
      forSale: {
        value: false,
      },
    },
    false
  );

  //fetching property related to the share. [useEffect] hook run the code in the {} only upon given event [], instead on each render
  // useEffect(() => {
  //   //instantiating a fetch function within, as it is a bad practice to return promise with [useEffect]. Fetching data with asynchronous method
  //   const fetchProperties = async () => {
  //     try {
  //       //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
  //       const responseData = await sendRequest(
  //         `http://localhost:5000/api/properties/share/${shareId}`
  //       );
  //       setLoadedProperty(responseData.property);
  //     } catch (err) {}
  //   };
  //   fetchProperties();
  // }, [sendRequest]);

  //fetching share property. [useEffect] hook run the code in the {} only upon given event [], instead on each render
  useEffect(() => {
    //instantiating a fetch function within, as it is a bad practice to return promise with [useEffect]. Fetching data with asynchronous method
    const fetchShareProperty = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          `http://localhost:5000/api/properties/share/${shareId}`
        );
        setLoadedProperty(responseData.property);
      } catch (err) {}
    };
    fetchShareProperty();
  }, [sendRequest, shareId]);

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
            // share: {
            //   value: responseData.share.share,
            //   isValid: true,
            // },
            sellPrice: {
              value: responseData.share.sellPrice,
              isValid: true,
            },
            forSale: {
              value: responseData.share.forSale,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchShare();
  }, [sendRequest, shareId, setFormData]);

  //asynchronous function for submit event
  const shareUpdateSubmitHandler = async (event) => {
    //prevent the default execution of the <form>
    event.preventDefault();
    try {
      //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
      await sendRequest(
        `http://localhost:5000/api/shares/edit/${shareId}`,
        "PATCH",
        JSON.stringify({
          //share: formState.inputs.share.value,
          //owner: auth.userId,
          sellPrice: formState.inputs.sellPrice.value,
          forSale: forSaleCheckbox,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
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

  //handle forSale checkbox events
  const handleForSaleCheckboxChange = () => {
    setForSaleCheckbox(!forSaleCheckbox);
  };

  //calculate current value
  const calculateCurrentPropertyValue = () => {
    let currentPropertyValue = 0.0;
    if (loadedProperty && loadedShare) {
      currentPropertyValue = parseFloat(
        (loadedShare.share / 100) * loadedProperty.price
      ).toFixed(2);
    }
    return currentPropertyValue;
  };

  //calculate profit
  const calculateCurrentProfitLoss = () => {
    let tempProfitLoss = 0.0;
    if (loadedProperty && loadedShare) {
      tempProfitLoss = parseFloat(
        (loadedShare.share / 100) * loadedProperty.price - loadedShare.cost
      ).toFixed(2);
    }
    return tempProfitLoss;
  };

  //returns and display the response from the backend
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedProperty && (
        <div className="property-list">
          <PropertyItem
            key={loadedProperty.id}
            id={loadedProperty.id}
            image={loadedProperty.image}
            title={loadedProperty.title}
            description={loadedProperty.description}
            address={loadedProperty.address}
            price={loadedProperty.price}
            creatorId={loadedProperty.creator}
            coordinates={loadedProperty.location}
            availableShares={loadedProperty.availableShares}
          />
        </div>
      )}

      {!isLoading && loadedShare && (
        <form className="share-form" onSubmit={shareUpdateSubmitHandler}>
          <div className="">
            <h3 className="center">FRACTION OWNERSHIP:</h3>
          </div>
          <div>
            <h4>Owned percentile: {loadedShare.share}%</h4>
            <h4>Initial cost: {parseFloat(loadedShare.cost).toFixed(2)}</h4>
            <h4>Market value: {calculateCurrentPropertyValue()}</h4>
            <h4>Profit/Loss: {calculateCurrentProfitLoss()}</h4>
            <h4>For sale: {(loadedShare.forSale && "YES") || "NO"}</h4>
          </div>
          <Input
            id="sellPrice"
            element="input"
            type="number"
            label="Selling Price"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid number."
            onInput={inputHandler}
            initialValue={loadedShare.sellPrice}
            initialValid={true}
          />
          <div>
            {loadedShare.forSale && (
              <div>
                <Checkbox
                  text="Would you like you like to remove your sale post from the
                marketplace?"
                  label="forSale"
                  value={forSaleCheckbox}
                  onChange={handleForSaleCheckboxChange}
                />
              </div>
            )}
            {!loadedShare.forSale && (
              <div>
                <Checkbox
                  id="forSale"
                  text="Would you like you like to sell your share of the property?"
                  label="forSale"
                  value={forSaleCheckbox}
                  onChange={handleForSaleCheckboxChange}
                />
              </div>
            )}
          </div>
          {/* <Input
            id="share"
            element="input"
            type="number"
            label="Share"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid number."
            onInput={inputHandler}
            initialValue={loadedShare.share}
            initialValid={true}
          /> */}
          {loadedShare.forSale && (
            <div className="share-item__actions">
              <Button type="submit" disabled={!forSaleCheckbox}>
                REMOVE FROM MARKETPLACE
              </Button>
            </div>
          )}
          {!loadedShare.forSale && (
            <div className="share-item__actions">
              <Button type="submit" disabled={!forSaleCheckbox}>
                POST FOR SALE
              </Button>
            </div>
          )}
        </form>
      )}
    </React.Fragment>
  );
};

//export function
export default UpdateShare;
