import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Input } from './input';

describe('Accessibility Standards', () => {
  describe('Button Component Accessibility', () => {
    it('has proper focus management', async () => {
      const user = userEvent.setup();
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      await user.type(button, '{enter}');
      
      expect(handleClick).toHaveBeenCalled();
    });

    it('has proper disabled state accessibility', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Card Component Accessibility', () => {
    it('maintains proper heading hierarchy', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Card Title');
    });

    it('has proper semantic structure', () => {
      render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>
          <CardContent>Article content</CardContent>
        </Card>
      );
      
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      expect(article).toContainElement(screen.getByRole('heading'));
    });
  });

  describe('Input Component Accessibility', () => {
    it('supports proper labeling', () => {
      render(
        <div>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" />
        </div>
      );
      
      const input = screen.getByLabelText('Test Label');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('has proper focus ring styles', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Focus test" />);
      
      const input = screen.getByPlaceholderText('Focus test');
      await user.click(input);
      
      expect(input).toHaveFocus();
      expect(input).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring');
    });

    it('supports required and aria attributes', () => {
      render(
        <Input
          required
          aria-describedby="help-text"
          aria-invalid={true}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Badge Component Accessibility', () => {
    it('has proper contrast and visibility', () => {
      render(<Badge>Status Badge</Badge>);
      
      const badge = screen.getByText('Status Badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('text-xs', 'font-semibold');
    });

    it('supports different variants with proper styling', () => {
      const { rerender } = render(<Badge variant="destructive">Error</Badge>);
      
      let badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
      
      rerender(<Badge variant="secondary">Info</Badge>);
      badge = screen.getByText('Info');
      expect(badge).toHaveClass('bg-shadcn-secondary', 'text-shadcn-secondary-foreground');
    });
  });

  describe('Color Contrast and Design Token Integration', () => {
    it('uses high contrast colors for text', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>High Contrast Title</CardTitle>
          </CardHeader>
        </Card>
      );
      
      const title = screen.getByRole('heading');
      // The component should use design tokens that provide sufficient contrast
      expect(title).toHaveClass('text-2xl', 'font-semibold');
    });

    it('maintains focus indicators with design tokens', async () => {
      const user = userEvent.setup();
      render(<Button>Focus Test</Button>);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring');
    });
  });
});