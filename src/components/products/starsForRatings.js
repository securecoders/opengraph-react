import React from 'react';

const RenderStarsForRating = (rating) => {
    let bestRating = parseInt(rating?.bestRating) || 0;
    let ratingValue = parseFloat(rating?.ratingValue) || 0;

    let starArr = [];
    for (let i = 0; i < bestRating; i++){
      if(i < ratingValue){
        starArr.push(<i  key={`star-${i}`} className={"coloredStar"}>★</i>)
      } else {
        starArr.push(<i key={`star-${i}`} >★</i>)
      }
    }

    return (
      <p>
        {starArr}
        <span className={'greyText'}>{` ${rating?.reviewCount} reviews`}</span>
      </p>
    )

};

export default RenderStarsForRating;
