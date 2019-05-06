# Opengraph-react

Opengraph react is a set of handy react components for displaying site previews with the information gathered by https://opengraph.io. Check out a live preview at https://dashboard.opengraph.io/debug.

## What is Opengraph.io?

OpenGraph.io client library for nodejs. Given a URL, the client will make a HTTP request to OpenGraph.io which will scrape the site for OpenGraph tags. If tags exist the tags will be returned to you.

Often times the appropriate tags will not exist and this is where OpenGraph.io shines. It will infer what the OpenGraph tags probably would be an return them to you as hybridGraph.

The hybridGraph results will always default to any OpenGraph tags that were found on the page. If only some tags were found, or none were, the missing tags will be inferred from the content on the page.

For most uses, the OpenGraph.io API is free. To get a free forever key, signup at OpenGraph.io.

## Installation

Simply install using npm:

    npm install --save opengraph-react

## Usage

    <OpengraphReactComponent  
      site={'site that you want to load (url encoding is done for you)'}  
      appId={Your opengraph.io api key goes here}  
      loader={A component to display while results are being fetched}  
      size={'small'}    
    />

## Props

| name|type| description
|--|--|--|
| site |string|Website that you want to load uri encoding is done for you so no need to encode it|
|appId|string|Your ApiKey for opengraph.io (you can get one at www.opengraph.io)|
|loader(optional)|component|A component to display while loading (ex a spinner) won't display anything by default|
|size|enum|Either small or large. Tells it what kind of card to display|
|onlyFetch|boolean|If this prop is supplied then no card will display, but instead the results from opengraph will be passed as props to the components children|
|acceptLang|string|accept lang header for request, defaults to "auto"|
|useProxy|boolean|Tells opengraph whether or not to use a proxy (defaults to false)|
|forceCacheUpdate|boolean|If this is supplied opengraph will not reply with cached result (defaults to false)|
|dontUseVideo|boolean|Component will default to supplying a video player if it finds one in the results, pass this prop to override that behavior and just display an image like normal|
