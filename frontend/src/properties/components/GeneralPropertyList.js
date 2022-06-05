import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import GeneralPropertyItem from "./GeneralPropertyItem";

import "./PropertyList.css";

/*
 * [GeneralPropertyList] components used to display list of properties
 */

const GeneralPropertyList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="property-list center">
        <Card>
          <h2>No properties found. Post advert?</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="property-list">
      {props.items.map((property) => (
        property.approved && <GeneralPropertyItem
          key={property.id}
          id={property.id}
          image={property.image}
          title={property.title}
          description={property.description}
          address={property.address}
          price={property.price}
          creatorId={property.creator}
          coordinates={property.location}
          onDelete={props.onDeleteProperty}
        />
      ))}
    </ul>
  );
};

//export method
export default GeneralPropertyList;
