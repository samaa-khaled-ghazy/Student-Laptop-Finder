
const COMPARE_KEY = "laptopCompare";

export function getCompareList() {
    return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
}

export function addToCompare(id) {
    const compareList = getCompareList();

    if (compareList.includes(Number(id))) {
        return {
            success: false,
            message: "This laptop is already in comparison."
        };
    }

    if (compareList.length >= 4) {
        return {
            success: false,
            message: "You can compare up to 4 laptops only."
        };
    }

    compareList.push(Number(id));

    localStorage.setItem(
        COMPARE_KEY,
        JSON.stringify(compareList)
    );

    return {
        success: true,
        message: "Laptop added to comparison."
    };
}

export function removeFromCompare(id) {
    const updatedList = getCompareList().filter(
        item => item !== Number(id)
    );

    localStorage.setItem(
        COMPARE_KEY,
        JSON.stringify(updatedList)
    );

    return updatedList;
}

export function getBestValue(laptops, property, type = "max") {
    if (!laptops.length) return null;

    return laptops.reduce((best, laptop) => {
        if (type === "min") {
            return laptop[property] < best[property] ? laptop : best;
        }

        return laptop[property] > best[property] ? laptop : best;
    });
}
