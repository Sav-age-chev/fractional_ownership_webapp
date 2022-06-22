/*
 * [ShareMarketItem.js] component is used to display the information of a share
 */

//import libraries
import React, { useState, useContext } from "react";
import { Link, Redirect, useHistory } from "react-router-dom"; //Raps and renders anchor tag and block navigation logic

//local imports
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Avatar from "../../shared/components/UIElements/Avatar";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

//stylesheet
import "./ShareMarketItem.css";

//function
const ShareMarketItem = (props) => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiate state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //instantiating method to re-render the page
  //const [, updateState] = React.useState();
  //const forceUpdate = React.useCallback(() => updateState({}), []);

  //storing history stack as const
  //const historyone = useHistory(props.history);

  //buy property methods
  const showBuyWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelBuyHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmBuyHandler = async () => {
    setShowConfirmModal(false);
    try {
      //sending http request via the [http-hook]. [sendRequest] is a pointer and take arguments for url, method, body && headers
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/shares/sell/${props.id}`,
        "PATCH",
        JSON.stringify({
          //owner: auth.userId,
          sellPrice: props.sellPrice,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.history.push("/properties/list");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelBuyHandler}
        header="Confirmation"
        footerClass="share-market-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelBuyHandler}>
              › CANCEL
            </Button>
            <Button danger onClick={confirmBuyHandler}>
              BUY
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and buy this share of the property?</p>
      </Modal>

      <li className="share-market-item">
        <Card className="share-market-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="share-market-item__image">
            <Avatar
              image={process.env.REACT_APP_ASSET_URL + "/uploads/images/marketShare.png"}
              alt={props.propertyTitle}
            />
          </div>
          <div className="share-market-item__info">
            <h4>Share of the property: {props.share}%</h4>
            <h4>Asking price: £{props.sellPrice}</h4>
          </div>
          <div className="share-market-item__actions">
            <Button
              danger
              disabled={auth.userId === props.owner}
              onClick={showBuyWarningHandler}
            >
              BUY
            </Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

//export function
export default ShareMarketItem;

