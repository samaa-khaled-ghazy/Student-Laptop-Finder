
import { getLaptops } from "./api.js";
import {
    getFavorites,
    toggleFavorite,
    clearFavorites,
    applyTheme,
    getTheme,
    saveTheme
} from "./storage.js";
import {
    renderLaptopCard,
    renderLoadingSkeleton,
    showError,
    formatPrice
} from "./ui.js";
import {
    addToCompare
} from "./compare.js";

const favoritesContainer = document.getElementById("favoritesContainer");

function setupTheme() {
    const currentTheme = applyTheme();
    const themeButton = document.getElementById("themeToggle");

    themeButton.textContent =
        currentTheme === "performance"
            ? "Switch to Battery Saver"
            : "Switch to Performance";

    themeButton.addEventListener("click", () => {
        const newTheme =
            getTheme() === "performance"
                ? "battery"
                : "performance";

        saveTheme(newTheme);
        applyTheme();

        themeButton.textContent =
            newTheme === "performance"
                ? "Switch to Battery Saver"
                : "Switch to Performance";
    });
}

function setupMobileMenu() {
    const menuButton = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

function updateFavoriteStatistics(laptops) {
    const total = laptops.reduce(
        (sum, laptop) => sum + laptop.price,
        0
    );

    const average = laptops.length > 0
        ? total / laptops.length
        : 0;

    document.getElementById("favoriteCount").textContent =
        laptops.length;

    document.getElementById("totalPrice").textContent =
        formatPrice(total);

    document.getElementById("averagePrice").textContent =
        formatPrice(average);
}

function renderFavorites(laptops) {
    const favoriteIds = getFavorites();

    const favoriteLaptops = laptops.filter(laptop =>
        favoriteIds.includes(Number(laptop.id))
    );

    updateFavoriteStatistics(favoriteLaptops);

    if (favoriteLaptops.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="col-span-full rounded-2xl border border-dashed p-10 text-center">
                <h2 class="mb-3 text-xl font-bold">
                    No favorites yet
                </h2>

                <p class="mb-5">
                    Add laptops from the catalogue to see them here.
                </p>

                <a href="laptops.html" class="btn-action inline-block">
                    Browse Laptops
                </a>
            </div>
        `;

        return;
    }

    favoritesContainer.innerHTML = favoriteLaptops.map(laptop => `
        <div class="favorite-item">
            ${renderLaptopCard(laptop)}

            <div class="mt-3 flex flex-wrap gap-2">
                <button
                    class="btn-action"
                    data-compare-id="${laptop.id}"
                >
                    Add to Compare
                </button>
            </div>
        </div>
    `).join("");
}

async function initializeFavoritesPage() {
    setupTheme();
    setupMobileMenu();

    renderLoadingSkeleton(favoritesContainer);

    try {
        const laptops = await getLaptops();

        renderFavorites(laptops);

        favoritesContainer.addEventListener("click", event => {
            const favoriteButton = event.target.closest(
                '[data-action="favorite"]'
            );

            const compareButton = event.target.closest(
                "[data-compare-id]"
            );

            if (favoriteButton) {
                const laptopId = Number(
                    favoriteButton.dataset.id
                );

                toggleFavorite(laptopId);
                renderFavorites(laptops);
            }

            if (compareButton) {
                const laptopId = Number(
                    compareButton.dataset.compareId
                );

                const result = addToCompare(laptopId);
                alert(result.message);
            }
        });

        document.getElementById("clearFavorites")
            .addEventListener("click", () => {
                if (getFavorites().length === 0) {
                    alert("Your favorites list is already empty.");
                    return;
                }

                const confirmed = confirm(
                    "Are you sure you want to clear all favorites?"
                );

                if (confirmed) {
                    clearFavorites();
                    renderFavorites(laptops);
                }
            });

    } catch (error) {
        showError(
            favoritesContainer,
            "Could not load your favorite laptops."
        );
    }
}

initializeFavoritesPage();
