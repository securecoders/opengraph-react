import React from 'react';

import RenderLarge from './components/large';
import RenderSmall from './components/small';

import { getResultsToUse } from './util/getResultsToUse';
import { buildRequestUrl } from './util/buildRequestUrl';
import ErrorBoundary from './components/error';
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
    dontUseProduct, newResults, proxyUrl } = props;

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
      fetchResults(buildRequestUrl({
        site, appId, proxyUrl, acceptLang,
        useProxy, forceCacheUpdate, fullRender,
        usePremium, useSuperior, disableAutoProxy,
      }));
    }
  }, [ ]);

  // The fetch path only ever filled `result`, so cards got a null
  // resultsToUse and crashed (OGR-009).
  const resultsToUse = React.useMemo(
    () => getResultsToUse(dontMakeCall || (results && !result) ? results : result),
    [dontMakeCall, results, result]
  );

  const passResultsToChildren = () => {
      if(!result){
        debug && console.log('NO RESULTS TO PASS');
        return false
      } else {
        const children = React.Children.map(props.children, child => {
          return React.cloneElement(child, { ogResults: result })
        });

        return (
          <ErrorBoundary debug={debug}>
            <div>
              {children}
            </div>
          </ErrorBoundary>
        )
      }
    }



  if(!resultsToUse && !error){
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

        return <ErrorBoundary debug={debug}>{renderCard()}</ErrorBoundary>;
      }
  }

  function renderCard() {
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

export default OpenGraphReactComponent;
