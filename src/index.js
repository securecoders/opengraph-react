import React from 'react';

import RenderLarge from './components/large';
import RenderSmall from './components/small';

import { getResultsToUse } from './util/getResultsToUse';
import { buildRequestUrl } from './util/buildRequestUrl';
import { requestResults } from './util/requestResults';
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
    if (dontMakeCall) {
      setResult(getResultsToUse(results));
      return undefined;
    }

    const url = buildRequestUrl({
      site, appId, proxyUrl, acceptLang,
      useProxy, forceCacheUpdate, fullRender,
      usePremium, useSuperior, disableAutoProxy,
    });

    // Identical requests are shared, and a request nobody is waiting for any
    // more is aborted, so mounting the same card many times (a list, a
    // re-render, StrictMode) costs one API request instead of one per mount.
    let active = true;
    const request = requestResults(url, { skipCache: Boolean(forceCacheUpdate) });

    request.promise.then(
      (body) => {
        if (!active) return;
        if (body && body.error) {
          setError(body.error);
        } else {
          setResult(prev => ({ ...prev, ...body }));
        }
      },
      (err) => {
        if (active) setError(err);
      }
    );

    return () => {
      active = false;
      request.release();
    };
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
