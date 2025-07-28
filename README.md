# React Kit US ABC 🚀

A modern, lightweight React UI components library built with **TailwindCSS** and **TypeScript**. Designed for rapid development with beautiful, consistent, and accessible components.

[![npm version](https://badge.fury.io/js/react-kit-us-abc.svg)](https://badge.fury.io/js/react-kit-us-abc)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## ✨ Features

- 🎨 **TailwindCSS** - Utility-first CSS framework for styling
- 🔒 **TypeScript** - Full type safety and IntelliSense support
- ⚡ **Lightweight** - Minimal bundle size with tree-shaking support
- 🎯 **Accessible** - Built with accessibility best practices
- 🔧 **Customizable** - Easy to override styles and behavior
- 📱 **Responsive** - Mobile-first design approach

## 📦 Installation

```bash
npm install react-kit-us-abc
```

### Peer Dependencies

Make sure you have React installed:

```bash
npm install react react-dom
```

## 🚀 Quick Start

```jsx
import { Button } from "react-kit-us-abc";

function App() {
  return (
    <div className="space-y-4">
      {/* Basic button */}
      <Button onClick={() => alert("Hello World!")}>Click me</Button>

      {/* Button with variant and size */}
      <Button variant="success" size="lg">
        Success Button
      </Button>

      {/* Loading button */}
      <Button loading variant="primary">
        Processing...
      </Button>
    </div>
  );
}
```

## 📚 Components

### Button

A versatile button component with multiple variants, sizes, and states built with TailwindCSS.

#### Basic Usage

```jsx
import { Button } from "react-kit-us-abc";

function MyComponent() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return <Button onClick={handleClick}>Default Button</Button>;
}
```

#### Button Variants

```jsx
// Primary (default)
<Button variant="primary">Primary</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Success
<Button variant="success">Success</Button>

// Danger
<Button variant="danger">Danger</Button>

// Warning
<Button variant="warning">Warning</Button>

// Outline
<Button variant="outline">Outline</Button>
```

#### Button Sizes

```jsx
// Small
<Button size="sm">Small Button</Button>

// Medium (default)
<Button size="md">Medium Button</Button>

// Large
<Button size="lg">Large Button</Button>
```

#### Button States

```jsx
// Loading state with spinner
<Button loading>Loading...</Button>

// Disabled state
<Button disabled>Disabled Button</Button>

// Combining states
<Button variant="success" size="lg" disabled>
  Large Disabled Success Button
</Button>
```

#### Custom Styling

```jsx
// Override background color
<Button className="bg-red-500 hover:bg-red-600">
  Custom Red Button
</Button>

// Full width button
<Button className="w-full" variant="primary">
  Full Width Button
</Button>

// Custom outline button
<Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500">
  Custom Pink Outline
</Button>

// Rounded button
<Button className="rounded-full" size="lg">
  Rounded Button
</Button>
```

#### Props

| Prop        | Type                                                                          | Default     | Description                             |
| ----------- | ----------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| `children`  | `ReactNode`                                                                   | -           | Button content                          |
| `variant`   | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'outline'` | `'primary'` | Button style variant                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                        | `'md'`      | Button size                             |
| `loading`   | `boolean`                                                                     | `false`     | Show loading spinner and disable button |
| `className` | `string`                                                                      | `""`        | Additional CSS classes                  |
| `onClick`   | `function`                                                                    | -           | Click handler                           |
| `disabled`  | `boolean`                                                                     | `false`     | Disable the button                      |
| `type`      | `"button" \| "submit" \| "reset"`                                             | `"button"`  | Button type                             |
| `...props`  | `ButtonHTMLAttributes`                                                        | -           | All standard button attributes          |

#### Real-world Examples

```jsx
// Login form
function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // API call...
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <Button
        variant="primary"
        size="lg"
        loading={loading}
        onClick={handleLogin}
        className="w-full"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </div>
  );
}

// Action buttons
function ActionBar() {
  return (
    <div className="flex gap-2">
      <Button variant="success" size="sm">
        Save
      </Button>
      <Button variant="secondary" size="sm">
        Cancel
      </Button>
      <Button variant="danger" size="sm">
        Delete
      </Button>
    </div>
  );
}
```

## 🎨 Styling with TailwindCSS

This library is built with TailwindCSS. For best results, make sure your project has TailwindCSS configured:

### 1. Install TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Sửa file tailwind.config.js:
/** @type {import('tailwindcss').Config} \*/
module.exports = {
content: [
"./src/**/_.{js,jsx,ts,tsx}",
"./node_modules/react-kit-us-abc/\*\*/_.{js,jsx,ts,tsx}"
],
theme: {
extend: {},
},
plugins: [],
}

Trong file index.css hoặc src/App.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

Trong index.tsx:
import './index.css';

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/nguyenbao2004Ts/ui-kit-react.git
cd ui-kit-react

# Install dependencies
npm install

# Start development server with demo
npm run demo

# Build the library
npm run build
```

### Project Structure

```
src/
├── components/
│   └── Button.tsx
├── styles/
│   └── global.css
├── index.ts
└── demo.tsx
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nguyen Bao** - [giabao2004ts@gmail.com](mailto:giabao2004ts@gmail.com)

- GitHub: [@nguyenbao2004Ts](https://github.com/nguyenbao2004Ts)

## 🙏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) - For the amazing utility-first CSS framework
- [React](https://reactjs.org/) - For the incredible UI library
- [Vite](https://vitejs.dev/) - For the lightning-fast build tool

---

Made with ❤️ by [Nguyen Bao](https://github.com/nguyenbao2004Ts)
