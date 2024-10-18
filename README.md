# Opengraph-react

Opengraph React offers a collection of convenient React components designed to display website previews using data from https://opengraph.io.
Also view how the site will be previewed on social media platforms like Facebook, Twitter, and LinkedIn.

The components are designed to be simple to use and can be customized to fit your needs.
Explore a live demo at https://dashboard.opengraph.io/api-playground

## Table of Contents
 - [What is Opengraph.io?](#what-is-opengraphio)
 - [Installation](#installation)
 - [Usage](#usage)
 - [Props](#props)
 - [Using Custom Site Results](#using-custom-site-results)
 - [Custom Results Object](#custom-results-object)
 - [OpenGraph.io API Parameters](#opengraphio-api-parameters)
 - [Available Components](#available-components)

## What is Opengraph.io?

OpenGraph.io client library for nodejs. Given a URL, the client will make a HTTP request to OpenGraph.io which will scrape the site for OpenGraph tags. If tags exist the tags will be returned to you.

Often times the appropriate tags will not exist and this is where OpenGraph.io shines. It will infer what the OpenGraph tags probably would be an return them to you as hybridGraph.

The hybridGraph results will always default to any OpenGraph tags that were found on the page. If only some tags were found, or none were, the missing tags will be inferred from the content on the page.


## Installation

Simply install using npm:

    npm install --save opengraph-react

## Usage

### Fetching Site Information with the OpenGraph.io API
This component is built to add simplicity to your project. It will fetch the site information from the OpenGraph.io API and display it in a card.

```javascript
import OpengraphReactComponent from 'opengraph-react';

const ExampleComponent = () => {
  const website = 'https://www.opengraph.io';
  const appId = 'XXXXX'; //You're OpenGraph.io API Key goes here

  return (
    <OpengraphReactComponent
      site={website}
      appId={'Your opengraph.io api key goes here'}
    />
  );
};
```

## Props

| Name                               | Type      | Description                                                                                                                                                       |
|------------------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| site                               | string    | Website that you want to load uri encoding is done for you so no need to encode it                                                                                |
| appId                              | string    | Your ApiKey for opengraph.io (you can get one at https://dashboard.opengraph.io)                                                                                  |
| dontMakeCall                       | boolean   | Defaults to false. Setting to true will allow you set your own information to be displayed.                                                                       |
| results                            | obj       | Custom [result object](#custom-results-object) passed when not making an API call.                                                                                |
| loader                             | component | A component to display while loading (ex a spinner) won't display anything by default                                                                             |
| [component](#available-components) | enum      | Defaults to 'large'. Options                                                                                                                                      |
| onlyFetch                          | boolean   | If this prop is supplied then no card will display, but instead the results from opengraph will be passed as props to the components children                     |
| acceptLang                         | string    | accept lang header for request, defaults to "auto"                                                                                                                |
| disableAutoProxy                   | boolean   | Tells OpenGraph.io to not use the Auto Proxy. Defaults to false.                                                                                                  |
| fullRender                         | boolean   | Tell OpenGraph.io whether or not to use the Full Render feature.                                                                                                  |
| useProxy                           | boolean   | Tell OpenGraph.io whether or not to attach a proxy to the request.                                                                                                |
| usePremium                         | boolean   | Tell OpenGraph.io whether or not to use the Premium Proxy feature.                                                                                                | 
| useSuperior                        | boolean   | Tells OpenGraph.io whether or not to use the Superior Proxy feature                                                                                               |
| forceCacheUpdate                   | boolean   | If this is supplied opengraph will not reply with cached result (defaults to false)                                                                               |
| dontUseVideo                       | boolean   | Component will default to supplying a video player if it finds one in the results, pass this prop to override that behavior and just display an image like normal |
| dontUseProduct                     | boolean   | Component will not show product information.                                                                                                                      |
| debug                              | boolean   | Defaults to false. Want to see what results you're getting from the API? Just enable debug and look for 'RESULTS TO USE:' in the console.                         |

### Using Custom Site Results
If you would like, you can pass in you own information to be displayed instead of making an API call.

```javascript
import OpengraphReactComponent from 'opengraph-react';

const ExampleComponent = () => {
  const siteInformation = {
    site_name: "OpenGraph.io",
    title: "OpenGraph.io",
    favicon: "https://www.opengraph.io/favicon.ico",
    description: "OpenGraph.io is a service that allows you to fetch OpenGraph data from any website.",
    image: "https://www.opengraph.io/img/logo.png",
    url: "https://www.opengraph.io",
  };
  
  return (
    <OpenGraphReactComponent
      dontMakeCall={true}
      results={siteInformation}
    />
  );
};
```

### Custom Results Object

```javascript
{
  site_name: string;
  title: string;
  favicon: string;
  description: string;
  image: string;
  url: string;
}
```


## OpenGraph.io API Parameters
### Below is a list of parameters and their descriptions, which can be passed to the OpenGraph.io API through the opengraph-react component.

| Parameter        | Required | Example             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|------------------|----------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appId            | yes      | -                   | The API key for registered users. Create an account (no cc ever required) to receive your `appId`.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| forceCacheUpdate | no       | true                | This will force our servers to pull a fresh version of the site being requested. By default, this value is false.                                                                                                                                                                                                                                                                                                                                                                                                           |
| autoProxy        | no       | true                | OpenGraph.io keeps a list of sites that require a proxy to be accessed. This will automatically route those requests through the necessary proxy.                                                                                                                                                                                                                                                                                                                                                                           |
| fullRender       | no       | false               | This will fully render the site using a chrome browser before parsing its contents. This is especially helpful for single page applications and JS redirects. This will slow down the time it takes to get a response by around 1.5 seconds.                                                                                                                                                                                                                                                                                |
| useProxy         | no       | false               | Route your request through residential and mobile proxies to avoid bot detection. This will slow down requests 3-10 seconds and can cause requests to time out. NOTE: Proxies are a limited resource and expensive for our team maintain. Free accounts share a small pool of proxies. If you plan on using proxies often, paid accounts provide dedicated concurrent proxies for your account.                                                                                                                             |
| usePremium       | no       | false               | The Premium Proxy feature in our API allows you to leverage residential and mobile proxy pools for enhanced scraping performance.                                                                                                                                                                                                                                                                                                                                                                                           |
| useSuperior      | no       | false               | The Superior Proxy feature is designed to tackle the most demanding scraping scenarios, allowing you to overcome the challenges posed by highly restrictive websites. By leveraging our superior proxy option, you can bypass bot detection mechanisms and access data from even the toughest sources.                                                                                                                                                                                                                      |
| acceptLang       | no       | en-US,en;q=0.9 auto | This specifies the request language sent when requesting the URL. This is useful if you want to get the site for languages other than English. The default setting for this will return an English version of a page if it exists. Note: if you specify the value auto, the API will use the same language settings as your current request. For more information on what to supply for this field, please see: [Accept-Language - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) |

## Available Components
Currently, there are 6 components available for use. They are as follows:

- large
    - This will display a larger preview card. This is the default component.
- small
    - This will display a smaller preview card.
- x
  - This will display link previews in the same manner as X ( formerly known as Twitter )
- facebook
    - This will display link previews in the same manner as Facebook
- linkedin
  - This will display link previews in the same manner as LinkedIn
