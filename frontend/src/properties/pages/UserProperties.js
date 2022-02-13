import React from "react";
import { useParams } from "react-router-dom";

import PropertyList from "../components/PropertyList";

/*
 * [UserProperty] is the page to display list of
 * properties that belong to certain user.
 */

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

const UserProperties = () => {
  const userId = useParams().userId;
  const loadedProperties = DUMMY_PROPERTIES.filter(
    (property) => property.creator === userId
  );
  return <PropertyList items={loadedProperties} />;
};

export default UserProperties;
