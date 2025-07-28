import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star, Users, Zap } from "@/lib/icons";

export function ComponentShowcase() {
  return (
    <div className="container-brand section-spacing">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-hero">Component Library Showcase</h2>
          <p className="text-subhero">
            Demonstrating shadcn/ui components integrated with Loveable design tokens
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Component Example */}
          <Card className="hover:shadow-brand transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-accent-500" size={24} />
                  Intelligent Automation
                </CardTitle>
                <Badge variant="default">Featured</Badge>
              </div>
              <CardDescription>
                Transform your workflow with cutting-edge automation solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Users size={16} />
                  <span>Trusted by 500+ companies</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Star size={16} className="text-accent-500" />
                  <span>4.9/5 customer rating</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-brand-navy">Key Features:</h4>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Process optimization and analysis</li>
                    <li>• Custom workflow automation</li>
                    <li>• Real-time performance monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="default">
                Get Started
                <ArrowRight className="ml-2" size={16} />
              </Button>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>

          {/* Interactive Form Example */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Contact</CardTitle>
              <CardDescription>
                See how our components work with forms and user input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-brand-navy">
                  Full Name
                </label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  className="focus-brand"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-brand-navy">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@company.com" 
                  className="focus-brand"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Web Development</Badge>
                <Badge variant="outline">Automation</Badge>
                <Badge variant="secondary">Consulting</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary">
                Send Message
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Button Variants Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Button Component Variants</CardTitle>
            <CardDescription>
              All button styles using the Loveable design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}