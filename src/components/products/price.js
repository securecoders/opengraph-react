import React from 'react';
import currencyMappings from '../../util/currencyMappings.json';

const RenderPrice = ({ offer, resultsToUse, hidePrice }) => {
    let price = offer.price || offer.highPrice || offer.lowPrice;
    if(!offer){
      return false
    } else {
      let currencyMatch = currencyMappings[offer.currency];
      return (
        <p className={'product-information_container'}>
          { price !== -1 && price && !hidePrice && <span className={'priceText'}>{`${!!currencyMatch ? currencyMatch.symbol : ''}${price}`}</span>}
          <span className={'greyText'}> from {resultsToUse.site_name}</span>
        </p>
      )
    }
};

export default RenderPrice;
