/*
 * [ShareMarket] is the page where the user can buy/sell/update shares
 */

//import libraries
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

//local imports
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import PropertyItem from "../../properties/components/PropertyItem";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ShareMarketList from "../components/ShareMarketList";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

//style sheets
import "./ShareMarket.css";

//function
const ShareMarket = () => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiating state
  const [loadedProperty, setLoadedProperty] = useState();
  const [loadedShares, setLoadedShares] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //extracting property id from the url
  const propertyId = useParams().propertyId;

  //storing history stack as const
  const history = useHistory();

  //form
  const [formState, inputHandler, setFormData] = useForm(
    {
      availableShares: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //fetching property. [useEffect] hook run the code in the {} only upon given event [], instead on each render
  useEffect(() => {
    //instantiating a fetch function within, as it is a bad practice to return promise with [useEffect]. Fetching data with asynchronous method
    const fetchProperty = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          `http://localhost:5000/api/properties/${propertyId}`
        );
        setLoadedProperty(responseData.property);

        console.log(responseData.property);
        //setting up the form inputs to the existing values from the database
        setFormData(
          {
            availableShares: {
              value: "",
              isValid: false,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProperty();
  }, [sendRequest, propertyId, setFormData]);

  console.log("PROPERTY: HI " + loadedProperty); //<--------- diagnostic ------------ DELETE ME ! ---------------------

  //fetching shares. [useEffect] hook allows to run certain code{} only on specific events[] instead of on each render
  useEffect(() => {
    //creating and call function inside as it is bad practice to return promise in [useEffect]
    const fetchShares = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          `http://localhost:5000/api/shares/property/${propertyId}`
        );

        setLoadedShares(responseData.shares);
      } catch (err) {}
    };
    fetchShares();
  }, [sendRequest, propertyId]);

  console.log("SHARES: " + loadedShares); //<--------- diagnostic ------------ DELETE ME ! ---------------------

  //   //fetch share. [useEffect] executes the code within {} upon event from the [], instead on each render
  //   useEffect(() => {
  //     //instantiating asynchronous fetch function within the hook, as it is a bad practice to return a promise to [useEffect]
  //     const fetchShare = async () => {
  //       try {
  //         //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
  //         const responseData = await sendRequest(
  //           `http://localhost:5000/api/shares/${shareId}`
  //         );
  //         //setting up state holding share data
  //         setLoadedShare(responseData.share);

  //         //setting up the form inputs to the existing values from the database
  //         setFormData(
  //           {
  //             // share: {
  //             //   value: responseData.share.share,
  //             //   isValid: true,
  //             // },
  //             sellPrice: {
  //               value: responseData.share.sellPrice,
  //               isValid: true,
  //             },
  //             forSale: {
  //               value: responseData.share.forSale,
  //             },
  //           },
  //           true
  //         );
  //       } catch (err) {}
  //     };
  //     fetchShare();
  //   }, [sendRequest, shareId, setFormData]);

  //   //asynchronous function for submit event
  //   const propertyUpdateSubmitHandler = async (event) => {
  //     event.preventDefault();
  //     try {
  //       //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
  //       await sendRequest(
  //         `http://localhost:5000/api/properties/${propertyId}`,
  //         "PATCH",
  //         JSON.stringify({
  //           availableShares: formState.inputs.availableShares.value,
  //         }),
  //         {
  //           "Content-Type": "application/json",
  //         }
  //       );
  //       history.push("/" + auth.userId + "/properties");
  //     } catch (err) {}
  //   };

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
  //   if (!loadedShares && !error) {
  //     return (
  //       <div className="center">
  //         <Card>
  //           <h2>Could not find shares!</h2>
  //         </Card>
  //       </div>
  //     );
  //   }

  //buy warning
  const showBuyWarningHandler = (event) => {
    //prevent the default submission of the form
    event.preventDefault();
    setShowConfirmModal(true);
  };

  //cancel the purchase
  const cancelBuyHandler = () => {
    setShowConfirmModal(false);
  };

  //once confirmed, request is send to buy property from initial sale
  const confirmBuyHandler = async () => {
    setShowConfirmModal(false);
    try {
      //send http request via [http-hook] to the backend to buy fraction of the property
      await sendRequest(
        `http://localhost:5000/api/shares/buy/${propertyId}`,
        "POST",
        JSON.stringify({
          //owner: auth.userId,
          shareProperty: propertyId,
          propertyTitle: loadedProperty.title,
          cost: "35300",
          share: formState.inputs.share.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/shares");
    } catch (err) {}
  };

  //calculate current value
  const calculateShareCost = () => {
    let shareCost = 0.0;
    if (loadedProperty) {
      shareCost = parseFloat(
        // (formState.inputs.share.value / 100) * loadedProperty.price
        (20 / 100) * loadedProperty.price
      ).toFixed(2);
    }
    return shareCost;
  };

  //function triggered upon sell that filter the share list by comparing against the id of recently deleted
  const soldShareHandler = (soldShareId) => {
    setLoadedShares((prevShare) =>
      prevShare.filter((share) => share.id !== soldShareId)
    );
  };

  //returns and display the response from the backend
  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}

      <Modal
        show={showConfirmModal}
        onCancel={cancelBuyHandler}
        header="Confirmation"
        footerClass="share-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelBuyHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmBuyHandler}>
              BUY
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and buy fraction of this property?</p>
      </Modal>

      {loadedProperty && (
        <div className="marketplace">
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

      {loadedProperty.availableShares > 0 && (
        <form
          className="share-form"
          // onSubmit={showBuyWarningHandler}
        >
          <h3 className="center">INITIAL SALE: </h3>
          <h4>What fraction of the property would you like to buy?</h4>
          <Input
            id="share"
            element="input"
            type="number"
            label="Percentile %"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid number."
            onInput={inputHandler}
            initialValue={loadedProperty.availableShares}
            initialValid={true}
          />
          <h4>Cost: {calculateShareCost()}</h4>
          <div className="share-item__actions">
            <Button type="submit" onClick={showBuyWarningHandler}>
              BUY
            </Button>
          </div>
        </form>
      )}

      <div className="marketplace">
        <h3 className="center">MARKETPLACE: </h3>
        <ShareMarketList
          items={loadedShares}
          history={history}
          onSoldShare={soldShareHandler}
        />
      </div>

      {/* <div className="marketplace">
        <h2>MARKETPLACE: </h2>
        <ShareMarketList items={loadedShares} onSoldShare={soldShareHandler} />
      </div> */}
      {/* {loadedShare.forSale && (
        <form className="share-form" onSubmit={shareUpdateSubmitHandler}>
          <div className="">
            <h3 className="center">FRACTION OWNERSHIP:</h3>
          </div>
          <div>
            <h4>Share of the property: {loadedShare.share}%</h4>
            <h4>Market value: {calculateCurrentPropertyValue()}</h4>
            <h4>Asking price: {loadedShare.sellPrice}</h4>
          </div>
          <Button type="submit"onClick={showBuyWarningHandler}>
            BUY
          </Button>
        </form>
      )} */}
    </React.Fragment>
  );
};

//export function
export default ShareMarket;
