import React from 'react';
import { truncateDescription } from '../util/truncateDescription';
import { trimString } from '../util/trimString';
import RenderProduct from './products';


const RenderSmall = ({resultsToUse, dontUseProduct, updatedProperty } ) => {
  React.useEffect(() => {
    if(!updatedProperty){
      return
    }
    if(updatedProperty){
      resultsToUse[updatedProperty.key] = updatedProperty.value;
    }
  }, [updatedProperty])

  if(resultsToUse.products && !dontUseProduct){
      return <RenderProduct resultsToUse={resultsToUse} size={'small'} />
    } else {
    return (
      <div className="outerWrapperSmall">
        <div style={{flex: 1}} >
          <div className={"imgWrapperSmall"}>
            <img className={'responsiveImage'} src={resultsToUse?.image} alt={'alt'}/>
          </div>
        </div>
        <div className={"textWrapperSmall"}>
          <div className={"siteNameLinkWrapper"}>
            <a target={'_blank'} href={resultsToUse?.url}>{trimString(resultsToUse?.site_name, 45)}</a>
          </div>
          <div className={"titleWrapper"}>
            <p>{trimString(resultsToUse?.title, 55)}</p>
          </div>
          <p>{truncateDescription(resultsToUse?.description, 250)}</p>
        </div>
      </div>
    )
  }
}

export default RenderSmall;
