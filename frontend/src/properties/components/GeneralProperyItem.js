/*
 * [GeneralPropertyItem] component is used to store and display general property information
 */

//import libraries
import React, { useState, useContext } from "react";

//local imports
import Map from "../../shared/components/UIElements/Map";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

//style sheet
import "./PropertyItem.css";

//function
const GeneralPropertyItem = (props) => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiate state
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  //delete property methods
  const showSellShareWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelSellShareHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmSellShareHandler = async () => {
    setShowConfirmModal(false);
     
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="property-item__modal-content"
        footerClass="property-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelSellShareHandler}
        header="Are you sure?"
        footerClass="property-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelSellShareHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmSellShareHandler}>
              SELL
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and sell the property shares?</p>
      </Modal>
      <li className="property-item">
        <Card className="property-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="property-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="property-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <h4>PRICE: {props.price}</h4>
          </div>
          <div className="property-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/properties/${props.id}`}>BUY SHARE</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showSellShareWarningHandler}>
                SELL SHARE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

//export function
export default GeneralPropertyItem;