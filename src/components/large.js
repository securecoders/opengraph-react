import React from 'react';
import { trimString } from '../util/trimString';
import RenderProduct from './products';

const RenderLarge = (props) => {
  let imageClassName = props.spin ? 'responsiveImage App-logo' : 'responsiveImage';

  let feature = null;

  if(props.resultsToUse.products && !props.dontUseProduct){
    return <RenderProduct resultsToUse={props.resultsToUse} size={'large'} />
  } else if (props?.resultsToUse?.video && !props.dontUseVideo){
    feature = (
      <div className={"imgWrapperLarge"}>
        <iframe
          className={'responsiveVideo'}
          src={props?.resultsToUse?.video}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  } else {
    feature = (
      <div className={"imgWrapperLarge"}>
        <img className={imageClassName} src={props?.resultsToUse?.image} alt={'alt'}/>
      </div>
    );
  }

  return (
    <div className="wrapperLarge">
      { feature }
      <div className={"textWrapperLarge"}>
        <div className={"siteNameLinkWrapper"}>
          <a target={'_blank'} href={props?.resultsToUse?.url}>{trimString(props?.resultsToUse?.site_name, 43)}</a>
        </div>
        <div className={"titleWrapper"}>
          <p>{trimString(props?.resultsToUse?.title, 50)}</p>
        </div>
        <p>{trimString(props?.resultsToUse?.description, 260)}</p>
      </div>
    </div>
  )
};

export default RenderLarge;
