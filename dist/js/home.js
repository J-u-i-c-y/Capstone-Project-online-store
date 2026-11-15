var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { createProductCard } from "./card.js";
const loadProducts = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield fetch("../s./assets/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = yield response.json();
      return json.data;
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
      return [];
    }
  });
const renderBlock = (data, containerId, filterFn) => {
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
