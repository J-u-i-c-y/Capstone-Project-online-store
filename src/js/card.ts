export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
}

export const createProductCard = (product: Product): string => {
  const cleanPath = product.imageUrl.replace("/src/", "").replace(/^\//, "");
  const isInHtmlFolder = window.location.pathname.includes("/html/");
  const prefix = isInHtmlFolder ? "../" : "./";
  let imageSrc = `${prefix}${cleanPath}`;
  const linkPrefix = isInHtmlFolder ? "./" : "./html/";

  const saleBadge = product.salesStatus
    ? `<div class="product-card__badge">SALE</div>`
    : "";

  const productData = encodeURIComponent(JSON.stringify(product));

  return `
    <a href="${linkPrefix}product.html?id=${product.id}" class="product-card">
      <div class="product-card__image-wrapper">
        ${saleBadge}
        <img src="${imageSrc}" alt="${product.name}" class="product-card__image" loading="lazy">
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__price">$${product.price}</p>
        
        <button 
          class="btn bt_primary product-card__btn" 
          data-id="${product.id}"
          data-product="${productData}"
          data-id="${product.id}"
        >
          Add To Cart
        </button>
      </div>
    </a>
  `;
};

export const getImagePath = (imageUrl: string): string => {
  const cleanPath = imageUrl.replace("/src/", "").replace(/^\//, "");
  const isInHtmlFolder = window.location.pathname.includes("/html/");
  const prefix = isInHtmlFolder ? "../" : "./";

  return `${prefix}${cleanPath}`;
};
