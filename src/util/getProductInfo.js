
export const getProductInfo = (result) => {
  let newResult;
  let goodProduct = result.products.find((p) => !!p.name);
  if(!goodProduct){
    return null
  }
  let goodOffers = goodProduct.offers || [];
  let goodOffer = goodOffers[0];
  let imageSrc;
  if(goodProduct.images && goodProduct.images.length > 1){
    imageSrc =goodProduct.images[0];
  } else {
    imageSrc = result.image;
  }


  const url = new URL(result.url);

  newResult = {
    site_name: result.site_name,
    title: goodProduct.name,
    url: url,
    favicon: result.favicon,
    image: imageSrc,
    description: goodProduct.description ? goodProduct.description : result.description,
    video: result.video,
    products: result.products
  };

  return newResult;
}
