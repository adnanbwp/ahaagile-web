import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, CheckCircle, User, Video } from 'lucide-react'

interface ConsultationDetailProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const ConsultationDetail = ({ icon: Icon, title, description }: ConsultationDetailProps) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-accent-400/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-accent-400" />
      </div>
      <div>
        <h3 className="font-heading font-semibold text-white text-lg">{title}</h3>
        <p className="text-white/80 text-sm mt-1">{description}</p>
      </div>
    </div>
  </Card>
)

export default function BookConsultationHeroSection() {
  return (
    <section className="relative bg-gradient-hero min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-600/10 rounded-full blur-2xl"></div>
      
      <div className="relative container-brand py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-6">
            <Badge 
              variant="secondary" 
              className="bg-accent-400/20 text-accent-400 border-accent-400/30 backdrop-blur-sm px-4 py-2 text-sm font-medium"
            >
              Free Consultation Available
            </Badge>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-hero mb-6 text-white">
            Book Your Consultation
          </h1>
          
          {/* Compelling Copy */}
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-subhero text-white/90 mb-4">
              Transform your workflows with intelligent automation expertise
            </p>
            <p className="text-lg text-white/80 font-serif leading-relaxed">
              Our consultants have helped dozens of professional services firms streamline operations, 
              reduce manual work, and achieve measurable productivity gains. Get personalized guidance 
              tailored to your specific challenges and goals.
            </p>
          </div>
          
          {/* Consultation Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <ConsultationDetail
              icon={Clock}
              title="30-45 minutes"
              description="Focused discussion"
            />
            <ConsultationDetail
              icon={CheckCircle}
              title="Free consultation"
              description="No cost or commitment"
            />
            <ConsultationDetail
              icon={User}
              title="Expert guidance"
              description="Personalized insights"
            />
            <ConsultationDetail
              icon={Video}
              title="Virtual meeting"
              description="Convenient online format"
            />
          </div>
        </div>
      </div>
    </section>
  )
}