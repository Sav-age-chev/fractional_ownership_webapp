/*
 * [AllProperty] is the page to display list of
 * all properties.
 */

//import libraries
import React, { useEffect, useState } from "react";

//local imports
import GeneralPropertyList from "../components/GeneralPropertyList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

//method
const AllProperties = () => {
  //instantiating state
  const [loadedProperties, setLoadedProperties] = useState();

  //object destructuring
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //fetching user properties. [useEffect] hook run the code in the {} only upon given event [], instead on each render
  useEffect(() => {
    //instantiating a fetch function within, as it is a bad practice to return promise with [useEffect]. Fetching data with asynchronous method
    const fetchProperties = async () => {
      try {
        //sending http request. [sendRequest] is a pointer to the function within the http hook and expects url and for the rest of the arguments will use default
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/properties/list"
        );
        setLoadedProperties(responseData.properties);
      } catch (err) {}
    };
    fetchProperties();
  }, [sendRequest]);

  //function triggered upon deletion that filter the property list by comparing against the id of recently deleted
  const propertyDeletedHandler = (deletedPropertyId) => {
    setLoadedProperties((prevProperty) =>
      prevProperty.filter((property) => property.id !== deletedPropertyId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProperties && (
        <GeneralPropertyList
          items={loadedProperties}
          onDeleteProperty={propertyDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

//export method
export default AllProperties;
