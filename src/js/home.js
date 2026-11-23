
import { getLaptops } from "./api.js";
import {
    getFavorites,
    getTheme,
    saveTheme,
    applyTheme
} from "./storage.js";

const statsContainer = document.getElementById("stats-container");
const themeButton = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

function calculateStatistics(laptops) {
    const totalLaptops = laptops.length;

    const lowestPrice = laptops.reduce(
        (lowest, laptop) => Math.min(lowest, laptop.price),
        Infinity
    );

    const totalFavorites = getFavorites().length;

    return {
        totalLaptops,
        lowestPrice,
        totalFavorites
    };
}

function renderStatistics(stats) {
    statsContainer.innerHTML = `
        <article class="laptop-card">
            <p class="text-sm font-medium text-gray-500">
                Available Laptops
            </p>
            <h3 class="mt-3 text-4xl font-extrabold text-green-600">
                ${stats.totalLaptops}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
                Devices in our collection
            </p>
        </article>

        <article class="laptop-card">
            <p class="text-sm font-medium text-gray-500">
                Lowest Price
            </p>
            <h3 class="mt-3 text-3xl font-extrabold text-green-600">
                ${stats.lowestPrice.toLocaleString("en-EG")} EGP
            </h3>
            <p class="mt-2 text-sm text-gray-500">
                Starting price
            </p>
        </article>

        <article class="laptop-card">
            <p class="text-sm font-medium text-gray-500">
                Saved Favorites
            </p>
            <h3 class="mt-3 text-4xl font-extrabold text-green-600">
                ${stats.totalFavorites}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
                Your saved devices
            </p>
        </article>
    `;
}

function setupTheme() {
    let currentTheme = applyTheme();

    themeButton.textContent =
        currentTheme === "battery"
            ? "Switch to Performance"
            : "Switch to Battery Saver";

    themeButton.addEventListener("click", () => {
        currentTheme =
            getTheme() === "battery"
                ? "performance"
                : "battery";

        saveTheme(currentTheme);
        applyTheme();

        themeButton.textContent =
            currentTheme === "battery"
                ? "Switch to Performance"
                : "Switch to Battery Saver";
    });
}

function setupNavigation() {
    menuButton.addEventListener("click", () => {
        navMenu.classList.toggle("hidden");

        const expanded = menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!expanded));
    });
}

async function initializeHomePage() {
    try {
        setupTheme();
        setupNavigation();

        const laptops = await getLaptops();

        const statistics = calculateStatistics(laptops);

        renderStatistics(statistics);

    } catch (error) {
        statsContainer.innerHTML = `
            <p class="col-span-full rounded-xl bg-red-100 p-5 text-center text-red-700">
                Unable to load laptop statistics. Please try again.
            </p>
        `;
    }
}

initializeHomePage();
