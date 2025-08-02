import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Test - Aha Agile',
  description: 'Test page for theme and mode switching functionality',
}

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground p-6">
        <h1 className="text-3xl font-bold mb-2">Theme Test Page</h1>
        <p className="text-lg opacity-90">Testing light/dark mode and theme switching</p>
      </div>

      <div className="container mx-auto p-8 space-y-8">
        {/* Background Test Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Background & Text Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Primary Background</h3>
              <p className="text-foreground">Main background with foreground text</p>
              <p className="text-muted-foreground mt-2">Muted foreground text</p>
            </div>
            <div className="bg-card text-card-foreground border border-border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Card Background</h3>
              <p>Card background with card foreground text</p>
            </div>
            <div className="bg-muted text-muted-foreground p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Muted Background</h3>
              <p>Muted background with muted foreground</p>
            </div>
          </div>
        </section>

        {/* Button Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Interactive Elements</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Secondary Button
            </button>
            <button className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Accent Button
            </button>
            <button className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Destructive Button
            </button>
          </div>
        </section>

        {/* Card Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Feature Card</h3>
              <p className="text-card-foreground mb-4">This card should change from light to dark background when switching modes.</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Learn More</button>
            </div>
            <div className="bg-popover text-popover-foreground p-6 rounded-xl border border-border shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Popover Style</h3>
              <p className="text-popover-foreground mb-4">Using popover background and foreground colors.</p>
              <button className="bg-accent text-accent-foreground px-4 py-2 rounded">Action</button>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-xl border border-border">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Muted Card</h3>
              <p className="mb-4">This uses muted background with regular foreground for title.</p>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded">Secondary</button>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Form Elements</h2>
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Input Field</label>
              <input 
                type="text" 
                placeholder="Enter text here..." 
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Dropdown</label>
              <select className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Textarea</label>
              <textarea 
                placeholder="Enter your message..." 
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Brand Colors Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Brand Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: 'hsl(var(--brand-primary))' }}>
              <h3 className="text-xl font-semibold text-white mb-2">Brand Primary</h3>
              <p className="text-white opacity-90">This should change based on selected theme (Ocean/Sunset/Forest)</p>
            </div>
            <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: 'hsl(var(--brand-secondary))' }}>
              <h3 className="text-xl font-semibold text-white mb-2">Brand Secondary</h3>
              <p className="text-white opacity-90">Secondary brand color</p>
            </div>
            <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: 'hsl(var(--brand-accent))' }}>
              <h3 className="text-xl font-semibold text-white mb-2">Brand Accent</h3>
              <p className="text-white opacity-90">Accent brand color</p>
            </div>
          </div>
        </section>

        {/* Visual Indicators */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Visual Mode Indicators</h2>
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-background border border-border rounded">
                <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-foreground">Primary Color</p>
              </div>
              <div className="p-4 bg-background border border-border rounded">
                <div className="w-8 h-8 bg-secondary rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-foreground">Secondary Color</p>
              </div>
              <div className="p-4 bg-background border border-border rounded">
                <div className="w-8 h-8 bg-accent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-foreground">Accent Color</p>
              </div>
              <div className="p-4 bg-background border border-border rounded">
                <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-foreground">Muted Color</p>
              </div>
            </div>
          </div>
        </section>

        {/* Expected Behavior Documentation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Expected Light/Dark Mode Behavior</h2>
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">🌞 Light Mode Expected:</h3>
              <ul className="text-card-foreground space-y-1 list-disc list-inside">
                <li>Light backgrounds (white/off-white)</li>
                <li>Dark text for good contrast</li>
                <li>Subtle borders and shadows</li>
                <li>Bright, vibrant accent colors</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">🌙 Dark Mode Expected:</h3>
              <ul className="text-card-foreground space-y-1 list-disc list-inside">
                <li>Dark backgrounds (dark gray/black)</li>
                <li>Light text for readability</li>
                <li>Darker borders and subtle shadows</li>
                <li>Adjusted accent colors for dark backgrounds</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}