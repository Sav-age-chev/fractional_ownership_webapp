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
        `http://localhost:5000/api/shares/sell/${props.id}`,
        "PATCH",
        JSON.stringify({
          owner: auth.userId,
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
              image="http://localhost:5000/uploads/images/marketShare.png"
              alt={props.propertyTitle}
            />
          </div>
          <div className="share-market-item__info">
            <h4>Share of the property: {props.share}%</h4>
            <h4>Asking price: {props.sellPrice}</h4>
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

    // {/* <li className="share-item">
    //   {loadedShare.forSale && (
    //     <form className="share-form" onSubmit={shareUpdateSubmitHandler}>
    //       <div className="">
    //         <h3 className="center">FRACTION OWNERSHIP:</h3>
    //       </div>
    //       <div>
    //         <h4>Share of the property: {loadedShare.share}%</h4>
    //         <h4>Market value: {calculateCurrentPropertyValue()}</h4>
    //         <h4>Asking price: {loadedShare.sellPrice}</h4>
    //       </div>
    //       <Button type="submit" onClick={showBuyWarningHandler}>
    //         BUY
    //       </Button>
    //     </form>
    //   )}
    //   <Card className="share-item__content">
    //     <Link to={`/shares/${props.id}`}>
    //       <div className="share-item__image">
    //         <Avatar
    //           image="http://localhost:5000/uploads/images/marketShare.png"
    //           alt={props.propertyTitle}
    //         />
    //       </div>
    //       <div className="share-item__info">
    //         <h2>{props.propertyTitle}</h2>
    //         <h3>Cost: {props.cost}</h3>
    //         <h3>
    //           {" "}
    //           Own: {props.shares} {props.shares === 1 ? "Percent" : "Percents"}
    //         </h3>
    //       </div>
    //     </Link>
    //   </Card>
    // </li> */}
  );
};

//export function
export default ShareMarketItem;

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// /*
//  * [UserPropertyItem] component is used to store and display user property information
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
// import "./PropertyItem.css";

// //function
// const UserPropertyItem = (props) => {
//   //set up listener to the context
//   const auth = useContext(AuthContext);

//   //instantiate state
//   const [showMap, setShowMap] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   //object destructuring
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();

//   const openMapHandler = () => setShowMap(true);

//   const closeMapHandler = () => setShowMap(false);

//   //delete property methods
//   const showDeleteWarningHandler = () => {
//     setShowConfirmModal(true);
//   };

//   const cancelDeleteHandler = () => {
//     setShowConfirmModal(false);
//   };

//   const confirmDeleteHandler = async () => {
//     setShowConfirmModal(false);
//     try {
//       //send http request via [http-hook] to the backend to delete the property
//       await sendRequest(
//         `http://localhost:5000/api/properties/${props.id}`,
//         "DELETE"
//       );
//       console.log("PropertyItem: " + props.id); //<--------- diagnostic ------------ DELETE ME ! ---------------------
//       props.onDelete(props.id);
//     } catch (err) {}
//   };

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
//         onCancel={cancelDeleteHandler}
//         header="Confirmation"
//         footerClass="property-item__modal-actions"
//         footer={
//           <React.Fragment>
//             <Button inverse onClick={cancelDeleteHandler}>
//               CANCEL
//             </Button>
//             <Button danger onClick={confirmDeleteHandler}>
//               DELETE
//             </Button>
//           </React.Fragment>
//         }
//       >
//         <p>Do you want to proceed and delete this property?</p>
//       </Modal>
//       <li className="property-item">
//         <Card className="property-item__content">
//           {isLoading && <LoadingSpinner asOverlay />}
//           <div className="property-item__image">
//             <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
//           </div>
//           <div className="property-item__info">
//             <h2>{props.title}</h2>
//             <h3>{props.address}</h3>
//             <p>{props.description}</p>
//             <h4>PRICE: {props.price}</h4>
//           </div>
//           <div className="property-item__actions">
//             <Button inverse onClick={openMapHandler}>
//               VIEW ON MAP
//             </Button>
//             {auth.userId === props.creatorId && (
//               <Button to={`/properties/${props.id}`}>EDIT</Button>
//             )}
//             {auth.userId === props.creatorId && (
//               <Button danger onClick={showDeleteWarningHandler}>
//                 DELETE
//               </Button>
//             )}
//           </div>
//         </Card>
//       </li>
//     </React.Fragment>
//   );
// };

// //export function
// export default UserPropertyItem;
