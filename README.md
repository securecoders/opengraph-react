# Opengraph-react

Opengraph react is a set of handy react components for displaying site previews with the information gathered by https://opengraph.io. Check out a live preview at https://dashboard.opengraph.io/debug

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
|fullRender|boolean|If this is supplied then opengraph will use its full page render feature (defaults to false)|
