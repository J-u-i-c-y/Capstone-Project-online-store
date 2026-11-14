export const createProductCard = (product) => {
    const saleBadge = product.salesStatus
        ? `<div class="product-card__badge">SALE</div>`
        : "";
    const productData = encodeURIComponent(JSON.stringify(product));
    return `
    <a href="/src/html/product.html?id=${product.id}" class="product-card">
      <div class="product-card__image-wrapper">
        ${saleBadge}
        <img src="${product.imageUrl}" alt="${product.name}" class="product-card__image" loading="lazy">
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
