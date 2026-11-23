
# Student Laptop Finder

A responsive web application that helps students find, filter, save, and compare laptops based on their needs and budget.

## Features

- Responsive design for mobile, tablet, and desktop.
- Laptop catalogue loaded from a local JSON file.
- Search by laptop name or brand.
- Filter by category, maximum price, and minimum RAM.
- Sort laptops by price, battery life, and weight.
- Laptop details page with full specifications.
- Favorites saved using localStorage.
- Compare 2 to 4 favorite laptops.
- Best-value highlighting in the comparison table.
- Performance Mode and Battery Saver Mode.
- Theme preference saved using localStorage.
- Loading skeletons and error messages.
- Reusable JavaScript modules.

## Technologies

- HTML5
- Tailwind CSS 4
- JavaScript ES Modules
- JSON
- localStorage
- Fetch API

## Installation

1. Install Node.js.
2. Open the project folder in VS Code.
3. Open the terminal in the project folder.
4. Install the dependencies:

```bash
npm install
```

## Build Tailwind CSS

Run:

```bash
npm run build
```

To automatically rebuild CSS when files change:

```bash
npm run watch
```

Keep the watch terminal open while working.

## Run the Project

Open `index.html` using the Live Server extension in VS Code.

Do not open the HTML files directly from the file system because the application uses JavaScript modules and fetch.

## Project Structure

- `index.html`: Home page
- `laptops.html`: Laptop catalogue
- `details.html`: Laptop details
- `favorites.html`: Favorite laptops
- `compare.html`: Laptop comparison
- `data/laptops.json`: Laptop dataset
- `src/input.css`: Tailwind input stylesheet
- `dist/output.css`: Compiled stylesheet
- `src/js/`: JavaScript modules

## Data

The application uses a local JSON dataset containing laptop information such as price, brand, category, processor, RAM, storage, battery life, weight, and screen size.

## Author

Samaa Khaled
