import React from 'react';
import { getProductInfo } from '../util/getProductInfo';

const FacebookComponent = ({ resultsToUse }) => {
  let results = resultsToUse;
  const isProduct = resultsToUse?.products?.length > 0;

  if(isProduct){
    results = getProductInfo(resultsToUse);
  }

  return (
    <div className={"facebook-link-preview"}>
      <a target={'_blank'} style={{ textDecoration: 'none'}} href={results?.url}>
      {results.image ? <div style={{
        border: '1px solid #dddfe2',
        background: `center no-repeat url(${results?.image})`,
        backgroundSize: 'contain',
        height: '274px',
      }}></div> : null}
      <div className={"facebook-link-preview_description"}>
        <p className={""} style={{ textTransform: 'uppercase' }}>{results?.site_name}</p>
        <p className={""} style={{ fontSize: '16px', fontWeight: 600 }}>{results?.title}</p>
        <p className={""} style={{ fontSize: '14px' }}>{results?.description}</p>
      </div>
      </a>
    </div>
  )
}

export default FacebookComponent;
