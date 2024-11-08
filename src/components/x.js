import React from 'react';
import { trimString } from '../util/trimString';
import { truncateDescription } from '../util/truncateDescription';
import { getProductInfo } from '../util/getProductInfo';

const XComponent = ({ resultsToUse, updatedProperty } ) => {
  let results = resultsToUse;
  const isProduct = resultsToUse.products && resultsToUse.products.length > 0;

  if(isProduct){
    results = getProductInfo(resultsToUse);
  }

  React.useEffect(() => {
    if(!updatedProperty){
      return
    }
    if(updatedProperty){
      results[updatedProperty.key] = updatedProperty.value;
    }
  } , [updatedProperty])

  return (
    <div className={"x-link-preview"} style={{
      background: `center / contain no-repeat url(${results?.image})`
    }}>
      <a target={'_blank'} style={{ textDecoration: 'none'}} href={results?.url}>
        <p className={"url-overlay"}>{trimString(results.title, 55)}</p>
      </a>
    </div>
  )

}

export default XComponent;
