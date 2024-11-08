import React from 'react';
import { getProductInfo } from '../util/getProductInfo';

const FacebookComponent = ({ resultsToUse, updatedProperty }) => {
  const [results, setResults] = React.useState(resultsToUse);


  React.useEffect(() => {
    const isProduct = resultsToUse?.products?.length > 0;
    if(isProduct){
      setResults(getProductInfo(resultsToUse));
    }
  }, [])

  React.useEffect(() => {
    if(!updatedProperty){
      return
  }
    if(updatedProperty){
      results[updatedProperty.key] = updatedProperty.value;
    }
  } , [updatedProperty])


  return (
    <div className={"facebook-link-preview"}>
      <a target={'_blank'} style={{ textDecoration: 'none'}} href={results?.url}>
      {results?.image ? <div style={{
        border: '1px solid #dddfe2',
        background: `center / contain no-repeat url(${results?.image})`,
        height: '274px',
      }}></div> : null}
        <div className="facebook-link-preview_description">
          <p style={{ textTransform: 'uppercase' }}>{results?.site_name}</p>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>{results?.title}</p>
          <p style={{ fontSize: '14px' }}>{results?.description}</p>
        </div>
      </a>
    </div>
  )
}

export default FacebookComponent;
