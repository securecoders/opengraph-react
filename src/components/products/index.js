import React from 'react';
import { truncateDescription } from '../../util/truncateDescription';
import RenderPrice from './price';
import RenderStarsForRating from './starsForRatings';

const RenderProduct = ({ resultsToUse, size }) => {
    let goodProduct = resultsToUse.products.find((p) => !!p.name);
    if(!goodProduct){
      return null
    }
    let goodOffers = goodProduct.offers || [];
    let goodOffer = goodOffers[0];
    let imageSrc;
    if(goodProduct.images && goodProduct.images.length > 1){
      imageSrc =goodProduct.images[0];
    } else {
      imageSrc = resultsToUse.image;
    }

    return (

      <div className={size === 'large' ? "wrapperLarge" : "outerWrapperSmall"}>
        <div style={{flex: 1}} >
          <div className={`imgWrapper${size === 'large' ? 'Large' : 'Small'}`}>
            <img className={'responsiveImage'} src={imageSrc} alt={'alt'}/>
          </div>
        </div>
        <div className={`textWrapper${size === 'large' ? 'Large' : 'Small'}`}>
          <div className={"siteNameLinkWrapper"}>
            <a href={resultsToUse.url}>{goodProduct.name}</a>
          </div>
          <div className={"titleWrapper"}>
            {goodOffer && <RenderPrice offer={goodOffer} resultsToUse={resultsToUse} hidePrice={false} />}
          </div>
          {!!goodProduct.totalRating && <RenderStarsForRating rating={goodProduct.totalRating} />}
          <p>{goodProduct.description ? truncateDescription(goodProduct.description) : truncateDescription(resultsToUse.description)}</p>
        </div>
      </div>
    )
};

export default RenderProduct;
