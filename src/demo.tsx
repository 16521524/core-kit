
import { createRoot } from 'react-dom/client'
import { Button } from './components/Button'
import './styles/global.css'

function App() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">React Kit US ABC - Button Component</h1>
      
      {/* Variants */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => alert('Primary clicked!')}>
            Primary
          </Button>
          <Button variant="secondary">
            Secondary
          </Button>
          <Button variant="success">
            Success
          </Button>
          <Button variant="danger">
            Danger
          </Button>
          <Button variant="warning">
            Warning
          </Button>
          <Button variant="outline">
            Outline
          </Button>
        </div>
      </section>

      {/* Sizes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* States */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Button States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      {/* Custom Styling */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-purple-500 hover:bg-purple-600">
            Custom Purple
          </Button>
          <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500">
            Custom Outline
          </Button>
          <Button size="lg" className="rounded-full">
            Rounded Full
          </Button>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Real-world Examples</h2>
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex gap-2">
            <Button variant="primary" size="sm">Save</Button>
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button variant="danger" size="sm">Delete</Button>
          </div>
          
          {/* Form Buttons */}
          <div className="flex gap-4">
            <Button variant="success" className="flex-1">Submit Form</Button>
            <Button variant="outline" className="flex-1">Reset</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
