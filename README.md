# **Real Estate Core UI**

A modern React component library built with  **TailwindCSS** ,  **TypeScript** , and  **Radix UI** .

Optimized for building fast, scalable web applications—especially dashboards and real estate projects.

[]()

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

---

## **Key Features**

* **TailwindCSS** – Utility-first CSS framework for rapid customization.
* **TypeScript** – Full type safety and IntelliSense support.
* **Radix UI** – Accessible, headless components for flexible customization.
* **React 18/19 Ready** – Works seamlessly with modern React projects.
* **Optimized Build** – Pre-configured for tree-shaking and minified output.

---

## **Installation**

### 1. Install the package

```
yarn add real-estate-core-ui
# or
npm install real-estate-core-ui

```

### 2. Install required peer dependencies

Make sure your project already includes:

```
yarn add react react-dom tailwindcss

```

---

## **TailwindCSS Configuration**

Add the library to your Tailwind content paths so its styles are detected:

**`tailwind.config.js`**

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/real-estate-core-ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

**`index.css` or `src/App.css`**

Ensure Tailwind’s base layers are included:

```
@tailwind base;
@tailwind components;
@tailwind utilities;

```

**In your `index.tsx` or main entry file:**

```
import './index.css';

```

---

## **Development**

### Run the project locally

```
git clone https://github.com/16521524/real-estate-core-ui.git
cd real-estate-core-ui
yarn install
yarn next dev

```

### Build the library

```
yarn next build

```

The compiled files will be output to the `dist/` directory (ESM, CJS, and `.d.ts` files included).

---

## **License & Author**

* **License:** [MIT](LICENSE)
* **Author:** [warjamma](https://warjamma.com) – [5lgold141@gmail.com]()
* **GitHub Repository:** [real-estate-core-ui](https://github.com/16521524/real-estate-core-ui)
