
import { getLaptops } from "./api.js";
import {
    getFavorites,
    applyTheme,
    getTheme,
    saveTheme
} from "./storage.js";
import {
    showError,
    formatPrice
} from "./ui.js";
import {
    getCompareList,
    addToCompare,
    removeFromCompare,
    getBestValue
} from "./compare.js";

const choicesContainer = document.getElementById("compareChoices");
const tableContainer = document.getElementById("comparisonTable");
const messageElement = document.getElementById("compareMessage");

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

function renderCompareChoices(laptops) {
    const favoriteIds = getFavorites();

    const favoriteLaptops = laptops.filter(laptop =>
        favoriteIds.includes(Number(laptop.id))
    );

    if (favoriteLaptops.length === 0) {
        choicesContainer.innerHTML = `
            <div class="col-span-full rounded-2xl border border-dashed p-8 text-center">
                <p class="mb-4">You have no favorite laptops yet.</p>
                <a href="favorites.html" class="btn-action inline-block">
                    Go to Favorites
                </a>
            </div>
        `;
        return;
    }

    const selectedIds = getCompareList();

    choicesContainer.innerHTML = favoriteLaptops.map(laptop => {
        const selected = selectedIds.includes(Number(laptop.id));

        return `
            <div class="rounded-2xl border bg-white p-4">
                <label class="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        class="compare-checkbox mt-1"
                        data-laptop-id="${laptop.id}"
                        ${selected ? "checked" : ""}
                    >

                    <span>
                        <span class="block font-semibold">
                            ${laptop.name}
                        </span>

                        <span class="mt-1 block text-sm text-gray-500">
                            ${laptop.brand}
                        </span>
                    </span>
                </label>
            </div>
        `;
    }).join("");
}

function renderComparisonTable(laptops) {
    const selectedIds = getCompareList();

    const selectedLaptops = laptops.filter(laptop =>
        selectedIds.includes(Number(laptop.id))
    );

    messageElement.textContent =
        `Selected: ${selectedLaptops.length} / 4`;

    if (selectedLaptops.length < 2) {
        tableContainer.innerHTML = `
            <div class="rounded-xl border border-dashed p-8 text-center">
                Select at least 2 laptops to compare.
            </div>
        `;
        return;
    }

    const specifications = [
        { label: "Price", key: "price", type: "min", format: value => formatPrice(value) },
        { label: "RAM", key: "ramGB", type: "max", format: value => `${value} GB` },
        { label: "Storage", key: "storageGB", type: "max", format: value => `${value} GB` },
        { label: "Battery", key: "batteryHours", type: "max", format: value => `${value} hours` },
        { label: "Weight", key: "weightKg", type: "min", format: value => `${value} kg` },
        { label: "Screen", key: "screenInches", type: "max", format: value => `${value} inches` }
    ];

    tableContainer.innerHTML = `
        <table class="w-full min-w-[650px] border-collapse text-left">
            <thead>
                <tr class="border-b">
                    <th class="p-4">Specification</th>

                    ${selectedLaptops.map(laptop => `
                        <th class="p-4">
                            ${laptop.name}
                        </th>
                    `).join("")}
                </tr>
            </thead>

            <tbody>
                ${specifications.map(specification => {
                    const bestLaptop = getBestValue(
                        selectedLaptops,
                        specification.key,
                        specification.type
                    );

                    return `
                        <tr class="border-b">
                            <th class="p-4">
                                ${specification.label}
                            </th>

                            ${selectedLaptops.map(laptop => `
                                <td class="p-4 ${
                                    bestLaptop &&
                                    Number(laptop[specification.key]) ===
                                    Number(bestLaptop[specification.key])
                                        ? "bg-green-100 font-bold text-green-800"
                                        : ""
                                }">
                                    ${specification.format(
                                        laptop[specification.key]
                                    )}
                                </td>
                            `).join("")}
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>

        <p class="mt-4 text-sm text-green-700">
            Green cells indicate the best value for that specification.
        </p>
    `;
}

async function initializeComparePage() {
    setupTheme();
    setupMobileMenu();

    try {
        const laptops = await getLaptops();

        renderCompareChoices(laptops);
        renderComparisonTable(laptops);

        choicesContainer.addEventListener("change", event => {
            const checkbox = event.target.closest(
                ".compare-checkbox"
            );

            if (!checkbox) {
                return;
            }

            const laptopId = Number(checkbox.dataset.laptopId);

            if (checkbox.checked) {
                const result = addToCompare(laptopId);

                if (!result.success) {
                    checkbox.checked = false;
                    alert(result.message);
                }
            } else {
                removeFromCompare(laptopId);
            }

            renderCompareChoices(laptops);
            renderComparisonTable(laptops);
        });

    } catch (error) {
        showError(
            choicesContainer,
            "Could not load laptops for comparison."
        );
    }
}

initializeComparePage();
