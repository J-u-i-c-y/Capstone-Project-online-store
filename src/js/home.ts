import { createProductCard } from "./card.js";

interface Product {
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

interface ProductsResponse {
  data: Product[];
}

const loadProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("./assets/data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: ProductsResponse = await response.json();
    return json.data;
  } catch (error) {
    console.error("Ошибка загрузки продуктов:", error);
    return [];
  }
};

const renderBlock = (
  data: Product[],
  containerId: string,
  filterFn: (product: Product) => boolean,
): void => {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Элемент #${containerId} не найден на странице.`);
    return;
  }

  const filteredProducts = data.filter(filterFn);

  if (filteredProducts.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  container.innerHTML = filteredProducts.map(createProductCard).join("");
};

loadProducts()
  .then((products) => {
    renderBlock(products, "products-selected-grid", (product) =>
      product.blocks.includes("Selected Products"),
    );
    renderBlock(products, "products-new-grid", (product) =>
      product.blocks.includes("New Products Arrival"),
    );
  })
  .catch((error) => {
    console.error("No products found.", error);
  });
