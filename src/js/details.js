
import { getLaptopById } from "./api.js";
import {
    isFavorite,
    toggleFavorite,
    applyTheme,
    getTheme,
    saveTheme
} from "./storage.js";
import {
    formatPrice,
    showError
} from "./ui.js";
import {
    addToCompare
} from "./compare.js";

const detailsContainer = document.getElementById("detailsContainer");

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

function renderLaptopDetails(laptop) {
    const favorite = isFavorite(laptop.id);

    detailsContainer.innerHTML = `
        <div class="grid gap-10 md:grid-cols-2">

            <div>
                <img
                    src="${laptop.image}"
                    alt="${laptop.name}"
                    class="w-full rounded-2xl object-cover shadow-lg"
                >
            </div>

            <div>
                <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">
                    ${laptop.brand}
                </p>

                <h1 class="mb-4 text-3xl font-bold">
                    ${laptop.name}
                </h1>

                <p class="mb-5 text-2xl font-bold">
                    ${formatPrice(laptop.price)}
                </p>

                <p class="mb-6 leading-7 text-gray-600">
                    ${laptop.description}
                </p>

                <div class="mb-8 flex flex-wrap gap-3">
                    <button
                        id="favoriteButton"
                        class="btn-action"
                    >
                        ${favorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>

                    <button
                        id="compareButton"
                        class="rounded-xl border border-green-600 px-5 py-2.5 font-semibold text-green-700 hover:bg-green-50"
                    >
                        Add to Compare
                    </button>
                </div>
            </div>

        </div>

        <section class="mt-12">
            <h2 class="section-title">
                Full Specifications
            </h2>

            <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="w-full text-left">
                    <tbody>
                        <tr class="border-b">
                            <th class="p-4">Brand</th>
                            <td class="p-4">${laptop.brand}</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Category</th>
                            <td class="p-4">${laptop.category}</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Processor</th>
                            <td class="p-4">${laptop.cpu}</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">RAM</th>
                            <td class="p-4">${laptop.ramGB} GB</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Storage</th>
                            <td class="p-4">${laptop.storageGB} GB</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Battery</th>
                            <td class="p-4">${laptop.batteryHours} hours</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Weight</th>
                            <td class="p-4">${laptop.weightKg} kg</td>
                        </tr>

                        <tr class="border-b">
                            <th class="p-4">Screen</th>
                            <td class="p-4">${laptop.screenInches} inches</td>
                        </tr>

                        <tr>
                            <th class="p-4">Price</th>
                            <td class="p-4">${formatPrice(laptop.price)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;

    setupDetailsButtons(laptop);
}

function setupDetailsButtons(laptop) {
    const favoriteButton = document.getElementById("favoriteButton");
    const compareButton = document.getElementById("compareButton");

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(laptop.id);

        favoriteButton.textContent = isFavorite(laptop.id)
            ? "Remove from Favorites"
            : "Add to Favorites";
    });

    compareButton.addEventListener("click", () => {
        const result = addToCompare(laptop.id);
        alert(result.message);
    });
}

async function initializeDetailsPage() {
    setupTheme();
    setupMobileMenu();

    const laptopId = new URLSearchParams(window.location.search).get("id");

    if (!laptopId) {
        showError(detailsContainer, "No laptop ID was provided.");
        return;
    }

    try {
        const laptop = await getLaptopById(laptopId);

        if (!laptop) {
            showError(detailsContainer, "Laptop not found.");
            return;
        }

        renderLaptopDetails(laptop);

    } catch (error) {
        showError(detailsContainer, "Could not load laptop details.");
    }
}

initializeDetailsPage();
