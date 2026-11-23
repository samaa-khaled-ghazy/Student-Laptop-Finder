
const FAVORITES_KEY = "laptopFavorites";
const THEME_KEY = "laptopTheme";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

export function isFavorite(id) {
    return getFavorites().includes(Number(id));
}

export function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(Number(id))) {
        favorites = favorites.filter(item => item !== Number(id));
    } else {
        favorites.push(Number(id));
    }

    saveFavorites(favorites);

    return favorites;
}

export function clearFavorites() {
    localStorage.removeItem(FAVORITES_KEY);
}

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || "battery";
}

export function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme() {
    const theme = getTheme();

    document.body.classList.remove(
        "theme-performance",
        "theme-battery"
    );

    document.body.classList.add(
        theme === "performance"
            ? "theme-performance"
            : "theme-battery"
    );

    return theme;
}
