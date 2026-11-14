var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createProductCard } from "./card.js";
import { initProductTabs } from "./product-tabs.js";
import { addToCart } from "./cart.js";
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
let allProducts = [];
function initProductPage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("../assets/data.json");
            const json = yield res.json();
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
        }
        catch (error) {
            console.error("Error:", error);
        }
        initProductTabs();
    });
}
function populateSelect(elementId, values, placeholder = "Choose option") {
    const select = document.getElementById(elementId);
    if (!select)
        return;
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
function renderProductDetails(product) {
    const titleEl = document.getElementById("product-title");
    const priceEl = document.getElementById("product-price");
    const imageEl = document.getElementById("main-image");
    const starsEl = document.getElementById("product-stars");
    if (titleEl)
        titleEl.textContent = product.name;
    if (priceEl)
        priceEl.textContent = `$${product.price}`;
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
function setupQuantitySelector() {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const input = document.getElementById("qty-input");
    if (!minusBtn || !plusBtn || !input)
        return;
    minusBtn.addEventListener("click", () => {
        let val = parseInt(input.value);
        if (val > 1)
            input.value = (val - 1).toString();
    });
    plusBtn.addEventListener("click", () => {
        let val = parseInt(input.value);
        input.value = (val + 1).toString();
    });
}
function setupAddToCart(product) {
    const btn = document.getElementById("add-to-cart-btn");
    const qtyInput = document.getElementById("qty-input");
    const sizeSelect = document.getElementById("product-size");
    const colorSelect = document.getElementById("product-color");
    if (!btn || !qtyInput || !sizeSelect || !colorSelect)
        return;
    btn.addEventListener("click", () => {
        const qty = parseInt(qtyInput.value);
        const selectedSize = sizeSelect.value;
        const selectedColor = colorSelect.value;
        addToCart(product, qty, selectedSize, selectedColor);
        btn.textContent = "Added!";
        setTimeout(() => (btn.textContent = "Add To Cart"), 1500);
    });
}
function renderMayAlsoLike(currentId) {
    const container = document.getElementById("may-also-like-grid");
    if (!container)
        return;
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
