import CalendlyWidget from '@/components/ui/CalendlyWidget'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Consultation | Aha Agile',
  description: 'Schedule a consultation with our agile transformation experts. Book directly through our calendar.',
}

export default function BookConsultationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-6">
            Book Your Consultation
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Ready to transform your workflows with intelligent automation? 
            Schedule a free consultation with our experts to discuss your specific needs and goals.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-primary-800 mb-4">
            What to Expect in Your Consultation
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-primary-700">
              <strong>• Assessment:</strong> We&apos;ll review your current workflows and identify automation opportunities
            </div>
            <div className="text-primary-700">
              <strong>• Strategy:</strong> Get a custom roadmap for your agile transformation journey
            </div>
            <div className="text-primary-700">
              <strong>• Next Steps:</strong> Clear recommendations and implementation timeline
            </div>
          </div>
        </div>

        {/* Calendly Widget */}
        <div className="max-w-4xl mx-auto">
          <CalendlyWidget className="h-fit" />
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-secondary-600">
              Use the calendar above to book your free consultation. We&apos;re here to help you understand 
              how intelligent workflow automation can transform your organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}