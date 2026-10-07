import { safeUrl } from './safeUrl';

const sanitizeProducts = (products) => {
  if (!Array.isArray(products)) {
    return undefined;
  }
  const cleaned = products
    .filter((product) => product && typeof product === 'object')
    .map((product) => ({
      ...product,
      images: Array.isArray(product.images) ? product.images.map(safeUrl).filter(Boolean) : [],
    }));
  return cleaned.length > 0 ? cleaned : undefined;
};

export const getResultsToUse = (result) => {
  if(!result){
    return null
  }
  let {openGraph, htmlInferred, hybridGraph } = result;
  // protect against null values
  openGraph = openGraph || {};
  htmlInferred = htmlInferred || {};
  hybridGraph = hybridGraph || {};

  const site_name = openGraph.site_name || htmlInferred.site_name || hybridGraph.site_name || result.site_name;
  const title = openGraph.title || htmlInferred.title || hybridGraph.title || result.title;
  const url = openGraph.url || htmlInferred.url || hybridGraph.url || result.url;
  const favicon = htmlInferred.favicon || hybridGraph.favicon || result.favicon;
  const description = openGraph.description || htmlInferred.description || hybridGraph.description || result.description;
  const products = hybridGraph.products || htmlInferred.products || result.products;

  let image;
  if(openGraph.image){
    image = typeof openGraph.image === 'object' ? openGraph.image.url : openGraph.image;
  } else {
    image = htmlInferred.image || hybridGraph.image || result.image;
  }

  let video;
  if(openGraph.video){
    video = typeof openGraph.video === 'object' ? (openGraph.video.secure_url || openGraph.video.url) : openGraph.video;
  } else {
    video = hybridGraph.video || htmlInferred.video || result.video;
  }

  return {
    site_name,
    title,
    url: safeUrl(url),
    favicon: safeUrl(favicon),
    image: safeUrl(image),
    description,
    video: safeUrl(video),
    products: sanitizeProducts(products)
  };
};
