
import { isFavorite } from "./storage.js";

export function formatPrice(price) {
    return new Intl.NumberFormat("en-EG").format(price) + " EGP";
}

export function renderLaptopCard(laptop) {
    const favorite = isFavorite(laptop.id);

    return `
        <article class="laptop-card flex flex-col gap-4">

            <img
                src="${laptop.image}"
                alt="${laptop.name}"
                class="h-48 w-full rounded-xl object-cover"
            >

            <div class="flex items-center justify-between gap-2">
                <span class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    ${laptop.category}
                </span>

                <button
                    type="button"
                    data-action="favorite"
                    data-id="${laptop.id}"
                    aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
                    aria-pressed="${favorite}"
                    class="rounded-full border px-3 py-2 hover:bg-gray-100"
                >
                    ${favorite ? "♥" : "♡"}
                </button>
            </div>

            <div>
                <p class="text-sm text-gray-500">${laptop.brand}</p>

                <h3 class="text-lg font-bold">
                    ${laptop.name}
                </h3>

                <p class="mt-2 text-xl font-bold text-green-600">
                    ${formatPrice(laptop.price)}
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <p>CPU: ${laptop.cpu}</p>
                <p>RAM: ${laptop.ramGB} GB</p>
                <p>Storage: ${laptop.storageGB} GB</p>
                <p>Battery: ${laptop.batteryHours} hours</p>
            </div>

            <a
                href="details.html?id=${laptop.id}"
                class="btn-action mt-auto block text-center"
            >
                View Details
            </a>

        </article>
    `;
}

export function renderLoadingSkeleton(container, count = 6) {
    container.innerHTML = Array.from(
        { length: count },
        () => `
            <div class="animate-pulse rounded-2xl bg-gray-200 p-5">
                <div class="mb-4 h-48 rounded-xl bg-gray-300"></div>
                <div class="mb-3 h-4 w-3/4 rounded bg-gray-300"></div>
                <div class="mb-3 h-4 w-1/2 rounded bg-gray-300"></div>
                <div class="h-10 rounded-xl bg-gray-300"></div>
            </div>
        `
    ).join("");
}

export function showError(container, message) {
    container.innerHTML = `
        <p class="col-span-full rounded-xl bg-red-100 p-5 text-center text-red-700">
            ${message}
        </p>
    `;
}
