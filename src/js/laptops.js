
import { getLaptops } from "./api.js";

import {
    getFavorites,
    toggleFavorite,
    getTheme,
    saveTheme,
    applyTheme
} from "./storage.js";

import {
    renderLaptopCard,
    renderLoadingSkeleton,
    showError
} from "./ui.js";

const laptopsContainer = document.getElementById("laptops-container");
const resultCount = document.getElementById("result-count");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const maxPriceInput = document.getElementById("max-price");
const minRamFilter = document.getElementById("min-ram");
const sortSelect = document.getElementById("sort-select");
const resetButton = document.getElementById("reset-filters");

const themeButton = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

let allLaptops = [];

function filterLaptops() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const maxPrice = Number(maxPriceInput.value);
    const minRam = Number(minRamFilter.value);

    return allLaptops.filter(laptop => {
        const matchesSearch =
            laptop.name.toLowerCase().includes(searchValue) ||
            laptop.brand.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            laptop.category === selectedCategory;

        const matchesPrice =
            maxPriceInput.value === "" ||
            laptop.price <= maxPrice;

        const matchesRam =
            laptop.ramGB >= minRam;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesRam
        );
    });
}

function sortLaptops(laptops) {
    const sortValue = sortSelect.value;

    const sortedLaptops = [...laptops];

    switch (sortValue) {
        case "price-asc":
            return sortedLaptops.sort((a, b) => a.price - b.price);

        case "price-desc":
            return sortedLaptops.sort((a, b) => b.price - a.price);

        case "battery-asc":
            return sortedLaptops.sort(
                (a, b) => a.batteryHours - b.batteryHours
            );

        case "battery-desc":
            return sortedLaptops.sort(
                (a, b) => b.batteryHours - a.batteryHours
            );

        case "weight-asc":
            return sortedLaptops.sort((a, b) => a.weightKg - b.weightKg);

        case "weight-desc":
            return sortedLaptops.sort((a, b) => b.weightKg - a.weightKg);

        default:
            return sortedLaptops;
    }
}

function renderLaptops(laptops) {
    resultCount.textContent = `${laptops.length} laptops found`;

    if (laptops.length === 0) {
        laptopsContainer.innerHTML = `
            <p class="col-span-full rounded-xl bg-gray-100 p-8 text-center text-gray-600">
                No laptops match your search or filters.
            </p>
        `;

        return;
    }

    laptopsContainer.innerHTML = laptops
        .map(laptop => renderLaptopCard(laptop))
        .join("");
}

function updateCatalogue() {
    const filteredLaptops = filterLaptops();
    const sortedLaptops = sortLaptops(filteredLaptops);

    renderLaptops(sortedLaptops);
}

function setupFavorites() {
    laptopsContainer.addEventListener("click", event => {
        const button = event.target.closest(
            '[data-action="favorite"]'
        );

        if (!button) return;

        const laptopId = Number(button.dataset.id);

        toggleFavorite(laptopId);

        updateCatalogue();
    });
}

function setupTheme() {
    const currentTheme = applyTheme();

    themeButton.textContent =
        currentTheme === "battery"
            ? "Switch to Performance"
            : "Switch to Battery Saver";

    themeButton.addEventListener("click", () => {
        const newTheme =
            getTheme() === "battery"
                ? "performance"
                : "battery";

        saveTheme(newTheme);
        applyTheme();

        themeButton.textContent =
            newTheme === "battery"
                ? "Switch to Performance"
                : "Switch to Battery Saver";
    });
}

function setupNavigation() {
    menuButton.addEventListener("click", () => {
        navMenu.classList.toggle("hidden");

        const expanded =
            menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!expanded));
    });
}

function setupFilters() {
    searchInput.addEventListener("input", updateCatalogue);
    categoryFilter.addEventListener("change", updateCatalogue);
    maxPriceInput.addEventListener("input", updateCatalogue);
    minRamFilter.addEventListener("change", updateCatalogue);
    sortSelect.addEventListener("change", updateCatalogue);

    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        categoryFilter.value = "all";
        maxPriceInput.value = "";
        minRamFilter.value = "0";
        sortSelect.value = "default";

        updateCatalogue();
    });
}

async function initializeCatalogue() {
    renderLoadingSkeleton(laptopsContainer, 6);

    try {
        allLaptops = await getLaptops();

        setupFavorites();
        setupTheme();
        setupNavigation();
        setupFilters();

        updateCatalogue();

    } catch (error) {
        resultCount.textContent = "Unable to load laptops";

        showError(
            laptopsContainer,
            "Could not load laptop data. Please refresh the page."
        );
    }
}

initializeCatalogue();
