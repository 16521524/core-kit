# ERP Next Core Kit

A core UI component library for ERP Next applications.

## Installation

```bash
npm install @erp-next/ui
# or
yarn add @erp-next/ui
# or
yarn add @erp-next/frappe-ui
```

## Usage

```jsx
import { Button, Input } from '@erp-next/ui';

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Input placeholder="Type here..." />
    </div>
  );
}
```

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Build the package:
```bash
npm run build
```
4. Run tests:
```bash
npm test
```

## Publishing

To publish a new version:

1. Update version in package.json
2. Build the package:
```bash
npm run build
```
3. Publish to npm:
```bash
npm publish
```

## License

MIT