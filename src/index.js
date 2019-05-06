import React, {Component} from 'react';
import styles from './App.css';

export default class OpengraphReactComponent extends Component {
  state = {
    result: null,
    error: null,
  };


  componentDidMount() {
    if(this.props.dontMakeCall){
      this.setState({result: this.props.result});
    } else {
      const {useProxy, fullRender, forceCacheUpdate} = this.props;
      const acceptLang = this.props.acceptLang || 'auto';
      const appId = this.props.appId;
      const site = encodeURIComponent(this.props.site);
      const url = `https://opengraph.io/api/1.1/site/${site}?accept_lang${acceptLang}&app_id=${appId}`;

      if(useProxy){
        url = url + '&use_proxy=true'
      }
      if(forceCacheUpdate){
        url = url + '&cache_ok=false';
      }
      if(fullRender){
        url = url + '&full_render=true';
      }

      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if(!result.error){
            this.setState({result})
          } else {
            console.error(result)
          }
        })
    }
  }

  getResultsToUse = () => {
    let {openGraph, htmlInferred, hybridGraph } = this.state.result;
    // protect against null values
    openGraph = openGraph || {};
    htmlInferred = htmlInferred || {};
    hybridGraph = hybridGraph || {};

    const site_name = openGraph.site_name || htmlInferred.site_name || hybridGraph.site_name;
    const title = openGraph.title || htmlInferred.title || hybridGraph.title;
    const url = openGraph.url || htmlInferred.url || hybridGraph.url;
    const favicon = htmlInferred.favicon || hybridGraph.favicon;
    const description = openGraph.description || htmlInferred.description || hybridGraph.description;
    const products = hybridGraph.products || htmlInferred.products;

    let image;
    if(openGraph.image){
      image = openGraph.image.url;
    } else {
      image = htmlInferred.image || hybridGraph.image
    }

    let video;
    if(openGraph.video){
      video = openGraph.video.secure_url
    } else {
      video = hybridGraph.video || htmlInferred.video;
    }

    return {
      site_name,
      title,
      url,
      favicon,
      image,
      description,
      video,
      products
    };
  };

  renderLargeProduct = (resultsToUse, imageClassName) => {
    let goodProduct = resultsToUse.products.find((p) => !!p.name);
    let goodOffer = goodProduct.offers[0];
    return (
      <div className="wrapperLarge">
        { feature }
        <div className={"textWrapperLarge"}>
          <div className={"siteNameLinkWrapper"}>
            <a href={resultsToUse.url}>{goodProduct.name}</a>
          </div>
          <div className={"titleWrapper"}>
            <p><i>&#9733;</i>{goodProduct.description}</p>
          </div>
          <p>{resultsToUse.description}</p>
        </div>
      </div>
    )
  };

  renderLarge = (resultsToUse) => {
    let imageClassName = this.props.spin ? 'responsiveImage App-logo' : 'responsiveImage';

    let feature = null;

    if(resultsToUse.products){
      return this.renderLargeProduct(resultsToUse, imageClassName)
    } else if (resultsToUse.video && !this.props.dontUseVideo){
      feature = (
        <div className={"imgWrapperLarge"}>
          <iframe
            className={'responsiveVideo'}
            src={resultsToUse.video}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    } else {
      feature = (
        <div className={"imgWrapperLarge"}>
          <img className={imageClassName} src={resultsToUse.image} alt={'alt'}/>
        </div>
        );
    }

    return (
      <div className="wrapperLarge">
        { feature }
        <div className={"textWrapperLarge"}>
          <div className={"siteNameLinkWrapper"}>
            <a href={resultsToUse.url}>{resultsToUse.site_name}</a>
          </div>
          <div className={"titleWrapper"}>
            <p>{resultsToUse.title}</p>
          </div>
          <p>{resultsToUse.description}</p>
        </div>
      </div>
    )
  };

  renderSmall = (resultsToUse) => {
    let string = '';
    return (
      <div className="outerWrapperSmall">
        <div style={{flex: 1}} >
          <div className={"imgWrapperSmall"}>
            <img className={'responsiveImage'} src={resultsToUse.image} alt={'alt'}/>
          </div>
          {/*{resultsToUse.image &&*/}

              {/*<div className={'image'} style={{backgroundImage: `url("${resultsToUse.image}")`}}/>*/}

          {/*}*/}
        </div>
          <div className={"textWrapperSmall"}>
            <div className={"siteNameLinkWrapper"}>
              <a href={resultsToUse.url}>{resultsToUse.site_name}</a>
            </div>
            <div className={"titleWrapper"}>
              <p>{resultsToUse.title}</p>
            </div>
            <p>{resultsToUse.description}</p>
          </div>

      </div>
    )
  };

  passResultsToChildren = () => {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {ogResults: this.state.result})
    });
    return (
      <div>
        {children}
      </div>
    )
  };

  render(){
    if(!this.state.result && !this.state.error){
      if(this.props.loader){
        return this.props.loader
      } else {
        return false
      }
    } else if (this.state.error){
      // maybe return an error here?
      return false
    } else {
      if(this.props.onlyFetch){
        return this.passResultsToChildren();
      } else {
        let resultsToUse = this.getResultsToUse();
        console.log('RESULTS TO USE', resultsToUse);
        const size = this.props.size || 'large';
        if(size === 'large'){
          return this.renderLarge(resultsToUse)
        } else {
          console.log('renderingSmall');
          return this.renderSmall(resultsToUse)
        }
      }
    }
  }
}
