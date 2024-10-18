import React from 'react';
import { getProductInfo } from '../util/getProductInfo';
import psl from 'psl';

const LinkedInComponent = ({ resultsToUse }) => {
  let results = resultsToUse;
  const isProduct = resultsToUse.products && resultsToUse.products.length > 0;
  let parsedUrl;

  if(isProduct){
    results = getProductInfo(resultsToUse);
  }

  const url = new URL(results?.url);
  let urlDomain = url?.host;
  parsedUrl = psl.parse(urlDomain);

  return (
    <div className={"linkedin-link-preview"}>
      <a target={'_blank'} href={results?.url} style={{ textDecoration: 'none'}}>
      {resultsToUse.image ? <img className={"linkedin-link-preview_image"} src={results.image} alt={'alt'}/> : null}
      <div className={"linkedin-link-preview_description"}>
        <p className={"linkedin-link-preview_title"}>{results?.title}</p>
        <p className={"linkedin-link-preview_url"}>{parsedUrl?.domain}</p>
      </div>
      </a>
    </div>
  )
}

export default LinkedInComponent;
