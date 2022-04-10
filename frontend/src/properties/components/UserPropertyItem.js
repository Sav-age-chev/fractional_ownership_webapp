/*
 * [UserPropertyItem] component is used to store and display user property information
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
const UserPropertyItem = (props) => {
  //set up listener to the context
  const auth = useContext(AuthContext);

  //instantiate state
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  //check if property can be deleted
  const checkFullOwnership = () => {
    if (props.availableShares > 100) {
      return false;
    } else {
      return true;
    }
  };

  //delete property warning
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  //cancel property deletion
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  //delete property method
  const confirmDeleteHandler = async () => {
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
        onCancel={cancelDeleteHandler}
        header="Confirmation"
        footerClass="property-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button
              danger
              disabled={checkFullOwnership()}
              onClick={confirmDeleteHandler}
            >
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        {checkFullOwnership===true ? (
          <p>Do you want to proceed and delete this property?</p>
        ) : (
          <p>
            You need to be the sole owner of the property to be able to take it
            of the market.
          </p>
        )}
      </Modal>
      <li className="property-item">
        <Card className="property-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="property-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
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
            {auth.userId === props.creatorId && (
              <Button to={`/properties/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
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
export default UserPropertyItem;
