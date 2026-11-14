import { createProductCard, Product } from "./card.js";

import { initProductTabs } from "./product-tabs.js";
import { addToCart } from "./cart.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

let allProducts: Product[] = [];

async function initProductPage(): Promise<void> {
  try {
    const res = await fetch("../assets/data.json");
    const json = await res.json();
    allProducts = json.data;

    if (!productId) {
      document.body.innerHTML = "<h1>Product not found</h1>";
      return;
    }

    const product = allProducts.find((p) => p.id === productId);
    if (!product) {
      document.body.innerHTML = "<h1>Product not found</h1>";
      return;
    }

    renderProductDetails(product);

    renderMayAlsoLike(productId);

    setupQuantitySelector();
    setupAddToCart(product);
  } catch (error) {
    console.error("Error:", error);
  }
  initProductTabs();
}

function populateSelect(
  elementId: string,
  values: string[],
  placeholder = "Choose option",
): void {
  const select = document.getElementById(elementId) as HTMLSelectElement | null;
  if (!select) return;

  select.innerHTML = "";

  if (placeholder) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholder;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
  }

  values.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;

    if (index === 0) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

function renderProductDetails(product: Product): void {
  const titleEl = document.getElementById("product-title");
  const priceEl = document.getElementById("product-price");
  const imageEl = document.getElementById("main-image") as HTMLImageElement;
  const starsEl = document.getElementById("product-stars");

  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `$${product.price}`;

  if (imageEl) {
    imageEl.src = product.imageUrl;
  }

  if (starsEl) {
    const rating = Math.round(product.rating);
    starsEl.innerHTML = "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  const sizes = product.size.split(",").map((s) => s.trim());
  const colors = product.color.split(",").map((c) => c.trim());
  const categories = product.category.split(",").map((c) => c.trim());

  populateSelect("product-size", sizes);
  populateSelect("product-color", colors);
  populateSelect("product-category", categories);
}

function setupQuantitySelector(): void {
  const minusBtn = document.getElementById("qty-minus");
  const plusBtn = document.getElementById("qty-plus");
  const input = document.getElementById("qty-input") as HTMLInputElement;

  if (!minusBtn || !plusBtn || !input) return;

  minusBtn.addEventListener("click", () => {
    const val = parseInt(input.value);
    if (val > 1) input.value = (val - 1).toString();
  });

  plusBtn.addEventListener("click", () => {
    const val = parseInt(input.value);
    input.value = (val + 1).toString();
  });
}

function setupAddToCart(product: Product): void {
  const btn = document.getElementById("add-to-cart-btn");
  const qtyInput = document.getElementById("qty-input") as HTMLInputElement;

  const sizeSelect = document.getElementById(
    "product-size",
  ) as HTMLSelectElement;
  const colorSelect = document.getElementById(
    "product-color",
  ) as HTMLSelectElement;

  if (!btn || !qtyInput || !sizeSelect || !colorSelect) return;

  btn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    const selectedSize = sizeSelect.value;
    const selectedColor = colorSelect.value;

    addToCart(product, qty, selectedSize, selectedColor);

    btn.textContent = "Added!";
    setTimeout(() => (btn.textContent = "Add To Cart"), 1500);
  });
}

function renderMayAlsoLike(currentId: string): void {
  const container = document.getElementById("may-also-like-grid");
  if (!container) return;

  const randomProducts = allProducts
    .filter((p) => p.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  container.innerHTML = randomProducts
    .map((p) => createProductCard(p))
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initProductPage();
});
