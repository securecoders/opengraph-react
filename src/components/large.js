import React from 'react';
import { trimString } from '../util/trimString';
import RenderProduct from './products';
import { safeVideoEmbedUrl } from '../util/safeUrl';

const RenderLarge = (props) => {
  let imageClassName = props.spin ? 'responsiveImage App-logo' : 'responsiveImage';
  const { updatedProperty } = props;

  React.useEffect(() => {
    if(!updatedProperty){
      return
    }
    if(updatedProperty){
      props.resultsToUse[updatedProperty.key] = updatedProperty.value;
    }

  }, [updatedProperty])

  let feature = null;
  const videoSrc = safeVideoEmbedUrl(props?.resultsToUse?.video);

  if(props.resultsToUse.products && !props.dontUseProduct){
    return <RenderProduct resultsToUse={props.resultsToUse} size={'large'} />
  } else if (videoSrc && !props.dontUseVideo){
    feature = (
      <div className={"imgWrapperLarge"}>
        <iframe
          className={'responsiveVideo'}
          src={videoSrc}
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
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
          <a target={'_blank'} rel={'noopener noreferrer'} href={props?.resultsToUse?.url}>{trimString(props?.resultsToUse?.site_name, 43)}</a>
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
