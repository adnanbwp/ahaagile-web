import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card Components', () => {
  it('renders Card with proper classes', () => {
    render(<Card data-testid="card">Card content</Card>);
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
  });

  it('renders CardHeader with proper layout', () => {
    render(<CardHeader data-testid="card-header">Header content</CardHeader>);
    
    const header = screen.getByTestId('card-header');
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
  });

  it('renders CardTitle as h3 element', () => {
    render(<CardTitle>Test Title</CardTitle>);
    
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Title');
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
  });

  it('renders CardDescription with muted text', () => {
    render(<CardDescription>Test description</CardDescription>);
    
    const description = screen.getByText('Test description');
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('renders CardContent with proper padding', () => {
    render(<CardContent data-testid="card-content">Content here</CardContent>);
    
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('renders CardFooter with flex layout', () => {
    render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);
    
    const footer = screen.getByTestId('card-footer');
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
  });

  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Sample Card</CardTitle>
          <CardDescription>This is a sample card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card body content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { name: /sample card/i })).toBeInTheDocument();
    expect(screen.getByText(/this is a sample card description/i)).toBeInTheDocument();
    expect(screen.getByText(/card body content goes here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('applies custom className to all components', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-desc">Description</CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title').closest('.custom-card')).toBeInTheDocument();
    expect(screen.getByText('Title').closest('.custom-header')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('custom-title');
    expect(screen.getByText('Description')).toHaveClass('custom-desc');
    expect(screen.getByText('Content')).toHaveClass('custom-content');
    expect(screen.getByText('Footer')).toHaveClass('custom-footer');
  });
});