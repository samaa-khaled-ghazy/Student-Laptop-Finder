
const DATA_URL = "./data/laptops.json";

export async function getLaptops() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Failed to load laptop data.");
        }

        const laptops = await response.json();

        return laptops;

    } catch (error) {
        console.error("Data loading error:", error);
        throw error;
    }
}

export async function getLaptopById(id) {
    const laptops = await getLaptops();

    return laptops.find(laptop => laptop.id === Number(id));
}
