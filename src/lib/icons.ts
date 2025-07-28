// Icon configuration for consistent usage patterns
// Re-export commonly used icons for the application

export {
  // Navigation and UI icons
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  
  // Content and action icons
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  
  // Social and external icons
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Link,
  Share,
  
  // Status and feedback icons
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Star,
  Heart,
  
  // Business and professional icons
  Briefcase,
  Building,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  Lightbulb,
  Zap,
  Award,
  Shield,
  
  // File and document icons
  File,
  FileText,
  Folder,
  Image,
  Download as DownloadIcon,
  
  // Common UI patterns
  Plus,
  Minus,
  Edit,
  Trash,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

// Icon size configuration
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

// Common icon props for consistency
export const defaultIconProps = {
  size: iconSizes.md,
  strokeWidth: 2,
} as const;

export type IconSize = keyof typeof iconSizes;