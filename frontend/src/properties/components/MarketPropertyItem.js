/*
 * [MarketPropertyItem] component is used to store and display property information
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
const MarketPropertyItem = (props) => {
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
  const showSellWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      //send http request via [http-hook] to the backend to delete the property
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/properties/${props.id}`,
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
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this property?</p>
      </Modal>
      <li className="property-item">
        <Card className="property-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="property-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
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
export default MarketPropertyItem;


// /*
//  * [MarketPropertyItem] component is used to store and display property information
//  */

// //import libraries
// import React, { useState, useContext } from "react";

// //local imports
// import Map from "../../shared/components/UIElements/Map";
// import Card from "../../shared/components/UIElements/Card";
// import Modal from "../../shared/components/UIElements/Modal";
// import Button from "../../shared/components/FormElements/Button";
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
// import { AuthContext } from "../../shared/context/auth-context";
// import { useHttpClient } from "../../shared/hooks/http-hook";

// //style sheet
// import "./MarketPropertyItem.css";

// //function
// const MarketPropertyItem = (props) => {
//   //set up listener to the context
//   const auth = useContext(AuthContext);

//   //instantiate state
//   const [showMap, setShowMap] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   //object destructuring
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();

//   const openMapHandler = () => setShowMap(true);

//   const closeMapHandler = () => setShowMap(false);

//   return (
//     <React.Fragment>
//       <ErrorModal error={error} onClear={clearError} />
//       <Modal
//         show={showMap}
//         onCancel={closeMapHandler}
//         header={props.address}
//         contentClass="property-item__modal-content"
//         footerClass="property-item__modal-actions"
//         footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
//       >
//         <div className="map-container">
//           <Map center={props.coordinates} zoom={16} />
//         </div>
//       </Modal>
//       <Modal
//         show={showConfirmModal}
//         onCancel={cancelSellHandler}
//         header="Confirmation"
//         footerClass="property-item__modal-actions"
//         footer={
//           <React.Fragment>
//             <Button inverse onClick={cancelSellHandler}>
//               CANCEL
//             </Button>
//             <Button danger onClick={confirmSellHandler}>
//               SELL
//             </Button>
//           </React.Fragment>
//         }
//       >
//         <p>Do you want to proceed and sell your share of the property?</p>
//       </Modal>
//       <li className="property-item">
//         <Card className="property-item__content">
//           {isLoading && <LoadingSpinner asOverlay />}
//           <div className="property-item__image">
//             <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
//           </div>
//           <div className="property-item__info">
//             <h2>{props.title}</h2>
//             <h3>{props.address}</h3>
//             <p>{props.description}</p>
//             <h4>Price: {props.price}</h4>
//             <h4>For Sale: {props.availableShares}%</h4>
//           </div>
//           <div className="property-item__actions">
//             <Button inverse onClick={openMapHandler}>
//               VIEW ON MAP
//             </Button>
//           </div>
//         </Card>
//       </li>
//     </React.Fragment>
//   );
// };

// //export function
// export default MarketPropertyItem;