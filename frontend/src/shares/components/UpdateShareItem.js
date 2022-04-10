/*
 * [UpdateShareItem] component is used to store and display user share information
 */

//import libraries
import React, { useState, useContext } from "react";

//local imports
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

//style sheet
import "./ShareItem.css";

//function
const UpdateShareItem = (props) => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiate state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //sell property share methods
  const showSellWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelSellHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmSellHandler = async () => {
    setShowConfirmModal(false);
    try {
      //send http request via [http-hook] to the backend to delete the property
      await sendRequest(
        `http://localhost:5000/api/properties/${props.id}`,
        "DELETE"
      );
      console.log("PropertyItem: " + props.id); //<--------- diagnostic ------------ DELETE ME ! ---------------------
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelSellHandler}
        header="Are you sure?"
        footerClass="share-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelSellHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmSellHandler}>
              SELL
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and sell this your share of the property?</p>
      </Modal>
      <li className="share-item">
        <Card className="share-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="share-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="share-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <h4>PRICE: {props.price}</h4>
          </div>
          <div className="share-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/properties/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showSellWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

//export function
export default UpdateShareItem;
