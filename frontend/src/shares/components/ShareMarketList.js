/*
 * [SharesMarketList] components used to display list of shares
 */

//import libraries
import React from "react";

//local imports
import Card from "../../shared/components/UIElements/Card";
import ShareMarketItem from "./ShareMarketItem";

//stylesheet
import "./ShareMarketList.css";

//function
const ShareMarketList = (props) => {
  //   if (props.items?.length === 0) {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h3>There aren't any sale post for this property. </h3>
        </Card>
      </div>
    );
  }

  console.log(props.history);

  return (
    <ul className="shares-list">
      {props.items.map((share) => (
        <ShareMarketItem
          key={share.id}
          id={share.id}
          owner={share.owner}
          image={share.image}
          propertyTitle={share.propertyTitle}
          cost={share.cost}
          share={share.share}
          sellPrice={share.sellPrice}
          forSale={share.ForSale}
          onSell={props.onSoldShare}
          history={props.history}
        />
      ))}
    </ul>
  );
};

//export function
export default ShareMarketList;
