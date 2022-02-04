import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";

import "./PropertyItem.css";

/*
 * [PropertyItem] component is used to store and display users information
 */

const PropertyItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showSellWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelSellHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmSellHandler = () => {
    setShowConfirmModal(false);
    console.log("SELLING...");
  };

  return (
    <React.Fragment>
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
        onCancel={cancelSellHandler}
        header="Are you sure?"
        footer="property-item__modal-actions"
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
        <p>Do you want to proceed and sell this place?</p>
      </Modal>
      <li className="property-item">
        <Card className="property-item__content">
          <div className="property-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="property-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="property-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/properties/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showSellWarningHandler}>
                SELL
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PropertyItem;
