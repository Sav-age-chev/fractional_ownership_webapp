import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./PropertyForm.css";

const DUMMY_PROPERTIES = [
  {
    id: "p1",
    title: "1604 The Heart",
    description:
      "The development towers 24 floors and offers stunning views across Salford Quays.Designed to be shaped like a heart, some apartments have unique curved shapes and some offer balconies with some great water views. The Heart also has an onsite concierge and is only a 5 minute walk from MediaCity UK Metrolink stop providing 15-minute links to the city centre. Shops and restaurants are only 250m away, whilst Old Trafford, the home of Manchester United FC is only a 20 minute walk away. Book a viewing.",
    //imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building,jpg/640px-NYC_Empire_State_Building.jpg',
    imageUrl:
      "https://c7.alamy.com/comp/CCCC9M/media-city-footbridge-and-studios-at-mediacityuk-at-night-salford-CCCC9M.jpg",
    address: "Blue Media City, Salford, United Kingdom M50 2TH",
    location: {
      lat: 53.4721254,
      lng: -2.3026691,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description:
      'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan in New York City, United States. It was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York.',
    //imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building,jpg/640px-NYC_Empire_State_Building.jpg',
    imageUrl:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260/",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creator: "u2",
  },
];

/*
 * [UpdateProperty] is the page where the user can update existing property
 */

const UpdateProperty = () => {
  const [isLoading, setIsLoading] = useState(true);

  const propertyId = useParams().propertyId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const identifiedProperty = DUMMY_PROPERTIES.find((p) => p.id === propertyId);

  useEffect(() => {
    if (identifiedProperty) {
      setFormData(
        {
          title: {
            value: identifiedProperty.title,
            //isValid: identifiedProperty.isValid
            isValid: true,
          },
          description: {
            value: identifiedProperty.description,
            //isValid: identifiedProperty.isValid
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedProperty]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedProperty) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find property!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="property-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description. At least 5 characters."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.title.isValid}
      />

      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PROPERTY
      </Button>
    </form>
  );
};

export default UpdateProperty;
