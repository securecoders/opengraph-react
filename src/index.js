import React from 'react';

import RenderLarge from './components/large';
import RenderSmall from './components/small';

import { getResultsToUse } from './util/getResultsToUse';
import XComponent from './components/x';
import FacebookComponent from './components/facebook';
import LinkedInComponent from './components/linkedIn';

import './App.css'

const OpenGraphReactComponent = (props) => {
  const { component, results,
    debug, useProxy, fullRender,
    forceCacheUpdate, usePremium,
    useSuperior, disableAutoProxy,
    dontMakeCall, acceptLang, appId,
    site, loader, onlyFetch, dontUseVideo,
    dontUseProduct, newResults } = props;

  const [ resultsToUse, setResultsToUse ] = React.useState(null);
  const [ result, setResult ] = React.useState(null);
  const [ error, setError ] = React.useState(null);



  React.useEffect(() => {
    const fetchResults = async (url) => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.error) {
          setError(result.error);
        } else {
          setResult(prev => ({ ...prev, ...result }));
        }
      } catch (error) {
        setError(error);
      }
    }

    if (dontMakeCall) {
      setResult(getResultsToUse(results));
    } else {
      const encodedSite = encodeURIComponent(site);
      let url = `https://opengraph.io/api/1.1/site/${encodedSite}?accept_lang${acceptLang ? acceptLang : 'auto'}&app_id=${appId}`;

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

  React.useEffect(() => {
    if (results) {
      setResultsToUse(getResultsToUse(results));
    }
  }, [results]);

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
        debug && console.log('RESULTS TO USE', resultsToUse);

        switch (component) {
          case 'x':
            return <XComponent resultsToUse={resultsToUse}  updatedProperty={newResults} />
          case 'facebook':
            return <FacebookComponent resultsToUse={resultsToUse} updatedProperty={newResults} />
          case 'linkedin':
            return <LinkedInComponent resultsToUse={resultsToUse} updatedProperty={newResults} />
          case 'large':
            return <RenderLarge dontUseProduct={dontUseProduct} updatedProperty={newResults} dontUseVideo={dontUseVideo} resultsToUse={resultsToUse} />
          case 'small':
            return <RenderSmall dontUseProduct={dontUseProduct} updatedProperty={newResults} resultsToUse={resultsToUse} />
          default:
            return <RenderLarge dontUseProduct={dontUseProduct} updatedProperty={newResults} dontUseVideo={dontUseVideo} resultsToUse={resultsToUse} />
        }
      }
  }
}

export default OpenGraphReactComponent;
