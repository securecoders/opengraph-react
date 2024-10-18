import React from 'react';
import { trimString } from '../util/trimString';
import { truncateDescription } from '../util/truncateDescription';
import { getProductInfo } from '../util/getProductInfo';

const XComponent = ({ resultsToUse } ) => {
  let results = resultsToUse;
  const isProduct = resultsToUse.products && resultsToUse.products.length > 0;

  if(isProduct){
    results = getProductInfo(resultsToUse);
  }

  return (
    <div className={"x-link-preview"}>
      <a target={'_blank'} style={{ textDecoration: 'none'}} href={results?.url}>
        <img src={results.image} alt={'alt'}/>
        <p className={"url-overlay"}>{trimString(results.title, 55)}</p>
      </a>
    </div>
  )

}

export default XComponent;
