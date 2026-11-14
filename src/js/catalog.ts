import { createProductCard, Product } from "./card.js";

const ITEMS_PER_PAGE = 12;
let allProducts: Product[] = [];
let filteredProducts: Product[] = [];

let activeFilters = {
  size: "",
  color: "",
  category: "",
  salesStatus: false,
  searchQuery: "",
  sortBy: "default",
};

let currentPage = 1;

const grid = document.getElementById("catalog-grid") as HTMLDivElement | null;
const resultsText = document.getElementById(
  "results-count",
) as HTMLDivElement | null;
const pagination = document.getElementById(
  "pagination",
) as HTMLDivElement | null;
const sortSelect = document.getElementById(
  "sort-select",
) as HTMLSelectElement | null;
const searchInput = document.getElementById(
  "search-input",
) as HTMLInputElement | null;
const searchBtn = document.getElementById(
  "search-btn",
) as HTMLButtonElement | null;
const notFoundPopup = document.getElementById(
  "not-found-popup",
) as HTMLDivElement | null;

const clearFiltersBtn = document.getElementById(
  "clear-filters",
) as HTMLButtonElement | null;
const hideFiltersBtn = document.getElementById(
  "hide-filters",
) as HTMLButtonElement | null;
const filtersBody = document.getElementById(
  "filters-body",
) as HTMLDivElement | null;
const filterSales = document.getElementById(
  "filter-sales",
) as HTMLInputElement | null;

async function initCatalog(): Promise<void> {
  if (!grid) return;

  try {
    const res = await fetch("../assets/data.json");
    const json = await res.json();
    allProducts = json.data;

    applyFiltersAndRender();
    renderTopSets();
    setupEventListeners();
  } catch (error) {
    console.error("Ошибка загрузки данных каталога:", error);
    grid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

function applyFiltersAndRender(): void {
  if (!allProducts.length) return;

  filteredProducts = allProducts.filter((product) => {
    const productSizes = product.size.split(",").map((s) => s.trim());
    const matchSize =
      !activeFilters.size || productSizes.includes(activeFilters.size);
    const matchColor =
      !activeFilters.color || product.color === activeFilters.color;
    const matchCategory =
      !activeFilters.category || product.category === activeFilters.category;
    const matchSale =
      !activeFilters.salesStatus || product.salesStatus === true;
    const matchSearch = product.name
      .toLowerCase()
      .includes(activeFilters.searchQuery.toLowerCase());

    return matchSize && matchColor && matchCategory && matchSale && matchSearch;
  });

  switch (activeFilters.sortBy) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "popularity":
      filteredProducts.sort((a, b) => b.popularity - a.popularity);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
  }

  currentPage = 1;
  renderCatalog();
}

function renderCatalog(): void {
  if (!grid || !resultsText || !pagination) return;

  const total = filteredProducts.length;

  if (total === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center;">No products found matching your criteria.</p>';
    resultsText.textContent = "Showing 0-0 of 0 Results";
    pagination.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, total);
  const pageProducts = filteredProducts.slice(start, end);

  resultsText.textContent = `Showing ${start + 1}-${end} of ${total} Results`;

  grid.innerHTML = pageProducts
    .map((product) => createProductCard(product))
    .join("");

  renderPagination(total);
}

function renderPagination(totalItems: number): void {
  if (!pagination) return;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "< PREV";
  prevBtn.className = "pagination__btn pagination__btn_prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCatalog();
    }
  });
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i.toString();
    pageBtn.className = `pagination__page ${i === currentPage ? "active" : ""}`;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderCatalog();
    });
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "NEXT >";
  nextBtn.className = "pagination__btn pagination__btn_next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCatalog();
    }
  });
  pagination.appendChild(nextBtn);
}

function renderTopSets(): void {
  const container = document.getElementById("top-sets-container");
  if (!container) return;

  const randomProducts = allProducts.filter(
    (product) => product.category === "luggage sets",
  );

  container.innerHTML = randomProducts
    .map(
      (product) => `
    <div class="top-set-item">
      <img src="${product.imageUrl}" alt="${product.name}">
      <div class="top-set-item__info">
        <p class="top-set-item__name">${product.name}</p>
        <div class="top-set-item__rating">${"★".repeat(Math.round(product.rating))}</div>
        <p class="top-set-item__price">$${product.price}</p>
      </div>
    </div>
  `,
    )
    .join("");
}

function initCustomDropdowns(): void {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((select) => {
    const trigger = select.querySelector(
      ".custom-select__trigger",
    ) as HTMLElement;
    const optionsList = select.querySelectorAll(".custom-select__options li");
    const filterType = select.getAttribute("data-filter");

    optionsList.forEach((option) => {
      option.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const text = target.textContent || "Choose option";

        if (trigger) trigger.textContent = text;

        if (filterType === "sort") {
          const sortValue = target.getAttribute("data-sort") || "default";
          activeFilters.sortBy = sortValue;
          applyFiltersAndRender();
          return;
        }

        const value = target.getAttribute("data-value") || "";
        if (filterType === "color") activeFilters.color = value;
        if (filterType === "size") activeFilters.size = value;
        if (filterType === "category") activeFilters.category = value;

        applyFiltersAndRender();
      });
    });
  });
}

function resetFilters(): void {
  activeFilters = {
    size: "",
    color: "",
    category: "",
    salesStatus: false,
    searchQuery: "",
    sortBy: "default",
  };

  document.querySelectorAll(".custom-select__trigger").forEach((trigger) => {
    trigger.textContent = "Choose option";
  });

  if (filterSales) filterSales.checked = false;
  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "default";

  applyFiltersAndRender();
}

function setupEventListeners(): void {
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeFilters.sortBy = (e.target as HTMLSelectElement).value;
      applyFiltersAndRender();
    });
  }

  const handleSearch = () => {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query === activeFilters.searchQuery) return;

    activeFilters.searchQuery = query;

    if (query !== "") {
      const hasAnyMatch = allProducts.some((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );
      if (!hasAnyMatch) showNotFoundPopup();
    }
    applyFiltersAndRender();
  };

  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });
    searchInput.addEventListener("blur", handleSearch);
    searchInput.addEventListener("input", (e) => {
      if ((e.target as HTMLInputElement).value.trim() === "") handleSearch();
    });
  }

  if (filterSales) {
    filterSales.addEventListener("change", (e) => {
      activeFilters.salesStatus = (e.target as HTMLInputElement).checked;
      applyFiltersAndRender();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", resetFilters);
  }

  if (hideFiltersBtn && filtersBody) {
    hideFiltersBtn.addEventListener("click", () => {
      const isHidden = filtersBody.style.display === "none";
      filtersBody.style.display = isHidden ? "block" : "none";
      hideFiltersBtn.textContent = isHidden ? "HIDE FILTERS" : "SHOW FILTERS";
    });
  }

  if (notFoundPopup) {
    const closeBtn = notFoundPopup.querySelector(".popup__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () =>
        notFoundPopup.classList.remove("popup_active"),
      );
    }
    notFoundPopup.addEventListener("click", (e) => {
      if (e.target === notFoundPopup)
        notFoundPopup.classList.remove("popup_active");
    });
  }

  initCustomDropdowns();
}

function showNotFoundPopup(): void {
  if (notFoundPopup) {
    notFoundPopup.classList.add("popup_active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initCatalog();
});
