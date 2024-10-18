import React from 'react';

import RenderLarge from './components/large';
import RenderSmall from './components/small';

import { getResultsToUse } from './util/getResultsToUse';
import XComponent from './components/x';
import FacebookComponent from './components/facebook';
import LinkedInComponent from './components/linkedIn';

import './App.css'

const OpenGraphReactComponent = (props) => {

  const [ result, setResult ] = React.useState(null);
  const [ error, setError ] = React.useState(null);

  const { component, customResults, debug, useProxy, fullRender, forceCacheUpdate, usePremium, useSuperior, disableAutoProxy, dontMakeCall, acceptLang, appId, site, loader, onlyFetch, dontUseVideo, dontUseProduct } = props;

  React.useEffect(() => {
    const fetchResults = async (url) => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.error) {
          setError(result.error);
        } else {
          setResult(result);
        }
      } catch (error) {
        setError(error);
      }
    }

    if (dontMakeCall) {
      setResult(customResults);
    } else {
      const encodedSite = encodeURIComponent(site);
      let url = `http://localhost:3777/api/1.1/site/${encodedSite}?accept_lang${acceptLang ? acceptLang : 'auto'}&app_id=${appId}`;

      if (useProxy) {
        url = url + '&use_proxy=true'
      }
      if (forceCacheUpdate) {
        url = url + '&cache_ok=false';
      }
      if (fullRender) {
        url = url + '&full_render=true';
      }
      if (usePremium) {
        url = url + '&use_premium=true';
      }
      if (useSuperior) {
        url = url + '&use_superior=true';
      }
      if (disableAutoProxy) {
        url = url + '&auto_proxy=false';
      }

      fetchResults(url);
    }
  }, [ ]);

    const passResultsToChildren = () => {
      if(!result){
        debug && console.log('NO RESULTS TO PASS');
        return false
      } else {
        const children = React.Children.map(props.children, child => {
          return React.cloneElement(child, { ogResults: result })
        });

        return (
          <div>
            {children}
          </div>
        )
      }
    }



  if(!result && !error){
      if(loader){
        return loader
      } else {
        return false
      }
    } else if (error){
      // maybe return an error here?
      return false
    } else {
      if(onlyFetch){
        return passResultsToChildren();
      } else {
        let resultsToUse = customResults && dontMakeCall ? customResults : getResultsToUse(result);
        debug && console.log('RESULTS TO USE', resultsToUse);

        switch (component) {
          case 'x':
            return <XComponent resultsToUse={resultsToUse} />
          case 'facebook':
            return <FacebookComponent resultsToUse={resultsToUse} />
          case 'linkedin':
            return <LinkedInComponent resultsToUse={resultsToUse} />
          case 'large':
            return <RenderLarge dontUseProduct={dontUseProduct} dontUseVideo={dontUseVideo} resultsToUse={resultsToUse} />
          case 'small':
            return <RenderSmall dontUseProduct={dontUseProduct} resultsToUse={resultsToUse} />
          default:
            return <RenderLarge dontUseProduct={dontUseProduct} dontUseVideo={dontUseVideo} resultsToUse={resultsToUse} />
        }
      }
  }
}

export default OpenGraphReactComponent;
