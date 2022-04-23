/*
 * [InfoModel.js] component is used to display current page information
 */

//import libraries
import React from "react";

//local imports
import Modal from "./Modal";
import Button from "../FormElements/Button";

const InfoModal = (props) => {
  
  return (
    <Modal
      onCancel={props.onClear}
      header="Information!"
      show={props.infoState}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      {props.info}
    </Modal>
  );
};

//export component
export default InfoModal;
