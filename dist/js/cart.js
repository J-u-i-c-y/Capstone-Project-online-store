export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
};
export const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartCount();
    renderCartPage();
};
export const updateHeaderCartCount = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterEl = document.querySelector(".header__cart-count");
    if (counterEl) {
        counterEl.textContent = totalItems.toString();
        counterEl.style.display = totalItems > 0 ? "flex" : "none";
    }
};
export const addToCart = (product, quantity = 1, size = "", color = product.color) => {
    let defaultSize = product.size;
    if (product.size && product.size.includes(",")) {
        defaultSize = product.size.split(",")[0].trim();
    }
    const finalSize = size || defaultSize;
    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) => item.id === product.id &&
        item.selectedSize === finalSize &&
        item.selectedColor === color);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    }
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            selectedSize: finalSize,
            selectedColor: color,
            quantity: quantity,
        });
    }
    saveCart(cart);
};
export const initGlobalCartListeners = () => {
    document.body.addEventListener("click", (e) => {
        const target = e.target;
        const btn = target.closest(".product-card__btn");
        if (btn) {
            e.preventDefault();
            const productDataStr = btn.getAttribute("data-product");
            if (!productDataStr)
                return;
            try {
                const product = JSON.parse(decodeURIComponent(productDataStr));
                addToCart(product);
            }
            catch (error) {
                console.error("Ошибка парсинга данных:", error);
            }
        }
    });
};
const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_PERCENT = 0.1;
export const renderCartPage = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer)
        return;
    const cart = getCart();
    const emptyMessage = document.getElementById("cart-empty-message");
    const cartContent = document.getElementById("cart-content");
    const cartSummary = document.getElementById("cart-summary");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryDiscount = document.getElementById("summary-discount");
    const summaryTotal = document.getElementById("summary-total");
    const discountRow = document.getElementById("discount-row");
    if (cart.length === 0) {
        if (emptyMessage)
            emptyMessage.style.display = "block";
        if (cartContent)
            cartContent.style.display = "none";
        if (cartSummary)
            cartSummary.style.display = "none";
        return;
    }
    if (emptyMessage)
        emptyMessage.style.display = "none";
    if (cartContent)
        cartContent.style.display = "block";
    if (cartSummary)
        cartSummary.style.display = "inline-block";
    cartItemsContainer.innerHTML = cart
        .map((item, index) => {
        const rowTotal = item.price * item.quantity;
        return `
      <div class="cart-row" data-index="${index}">
        <div class="cart-row__image"><img src="${item.imageUrl}" alt="${item.name}"></div>
        <div class="cart-row__name">
          ${item.name}
          ${item.selectedSize ? `<span class="cart-row__meta">Size: ${item.selectedSize}</span>` : ""}
          ${item.selectedColor ? `<span class="cart-row__meta">Color: ${item.selectedColor}</span>` : ""}
        </div>
        <div class="cart-row__price">$${item.price}</div>
        <div class="cart-row__quantity">
          <button class="qty-btn minus" data-index="${index}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
        <div class="cart-row__total">$${rowTotal}</div>
        <div class="cart-row__delete">
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </div>
      </div>
    `;
    })
        .join("");
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let finalTotal = subtotal + SHIPPING_COST;
    if (subtotal > DISCOUNT_THRESHOLD) {
        discount = subtotal * DISCOUNT_PERCENT;
        finalTotal = subtotal + SHIPPING_COST - discount;
        if (discountRow)
            discountRow.style.display = "flex";
        if (summaryDiscount)
            summaryDiscount.textContent = `-$${discount.toFixed(2)}`;
    }
    else {
        if (discountRow)
            discountRow.style.display = "none";
    }
    if (summarySubtotal)
        summarySubtotal.textContent = `$${subtotal}`;
    if (summaryTotal)
        summaryTotal.textContent = `$${finalTotal.toFixed(2)}`;
};
export const initCartPageListeners = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer)
        return;
    cartItemsContainer.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest(".plus")) {
            const index = parseInt(target.closest(".plus").getAttribute("data-index") || "0");
            const cart = getCart();
            cart[index].quantity += 1;
            saveCart(cart);
            return;
        }
        if (target.closest(".minus")) {
            const index = parseInt(target.closest(".minus").getAttribute("data-index") || "0");
            const cart = getCart();
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart(cart);
            return;
        }
        if (target.closest(".delete-btn")) {
            const index = parseInt(target.closest(".delete-btn").getAttribute("data-index") || "0");
            const cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            return;
        }
    });
    const clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your cart?")) {
                saveCart([]);
            }
        });
    }
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            saveCart([]);
            const emptyMessage = document.getElementById("cart-empty-message");
            const cartContent = document.getElementById("cart-content");
            const cartSummary = document.getElementById("cart-summary");
            if (cartContent)
                cartContent.style.display = "none";
            if (cartSummary)
                cartSummary.style.display = "none";
            if (emptyMessage) {
                emptyMessage.style.display = "block";
                emptyMessage.innerHTML = `
          <h2 style="color: #2ecc71; margin-bottom: 20px;">Thank you for your purchase!</h2>
          <p>Your order has been successfully placed.</p>
          <a href="catalog.html" class="btn btn_primary" style="display: inline-block; margin-top: 20px;">Return to Catalog</a>
        `;
            }
        });
    }
};
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCartCount();
    initGlobalCartListeners();
    renderCartPage();
    initCartPageListeners();
});
