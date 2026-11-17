/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles design-ux-architect + design-ui-designer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T01
 */

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Car,
  Bell,
  AlertTriangle,
  ShieldCheck,
  Fuel,
  Gauge,
  Camera,
  PenTool,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowLeft,
  RefreshCw,
  Printer,
  Download,
  Search,
  Eye,
  Filter,
  ChevronRight,
  Menu,
  LogOut,
  Info,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  UploadCloud,
  FileCheck
} from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

export const Icons = {
  // Navegación principal
  Tablero: (props: IconProps) => <LayoutDashboard size={props.size || 20} {...props} />,
  Contratos: (props: IconProps) => <FileText size={props.size || 20} {...props} />,
  Reservaciones: (props: IconProps) => <Calendar size={props.size || 20} {...props} />,
  Clientes: (props: IconProps) => <Users size={props.size || 20} {...props} />,
  Vehiculos: (props: IconProps) => <Car size={props.size || 20} {...props} />,
  Alertas: (props: IconProps) => <Bell size={props.size || 20} {...props} />,
  Admin: (props: IconProps) => <ShieldCheck size={props.size || 20} {...props} />,
  
  // Acciones y controles
  Plus: (props: IconProps) => <Plus size={props.size || 18} {...props} />,
  Trash: (props: IconProps) => <Trash2 size={props.size || 18} {...props} />,
  Edit: (props: IconProps) => <Edit2 size={props.size || 18} {...props} />,
  Check: (props: IconProps) => <Check size={props.size || 18} {...props} />,
  Close: (props: IconProps) => <X size={props.size || 18} {...props} />,
  Back: (props: IconProps) => <ArrowLeft size={props.size || 18} {...props} />,
  Refresh: (props: IconProps) => <RefreshCw size={props.size || 18} {...props} />,
  Print: (props: IconProps) => <Printer size={props.size || 18} {...props} />,
  Download: (props: IconProps) => <Download size={props.size || 18} {...props} />,
  Search: (props: IconProps) => <Search size={props.size || 18} {...props} />,
  Eye: (props: IconProps) => <Eye size={props.size || 18} {...props} />,
  Filter: (props: IconProps) => <Filter size={props.size || 18} {...props} />,
  Menu: (props: IconProps) => <Menu size={props.size || 22} {...props} />,
  Logout: (props: IconProps) => <LogOut size={props.size || 18} {...props} />,
  ChevronRight: (props: IconProps) => <ChevronRight size={props.size || 18} {...props} />,
  ChevronDown: (props: IconProps) => <ChevronDown size={props.size || 18} {...props} />,
  
  // Estados y alertas
  Success: (props: IconProps) => <CheckCircle2 size={props.size || 18} color="#166534" {...props} />,
  Warning: (props: IconProps) => <AlertTriangle size={props.size || 18} color="#9A3412" {...props} />,
  Danger: (props: IconProps) => <XCircle size={props.size || 18} color="#991B1B" {...props} />,
  Info: (props: IconProps) => <Info size={props.size || 18} color="#1E40AF" {...props} />,
  AlertCircle: (props: IconProps) => <AlertCircle size={props.size || 18} {...props} />,
  
  // Inspección y vehículo
  Fuel: (props: IconProps) => <Fuel size={props.size || 18} {...props} />,
  Odometer: (props: IconProps) => <Gauge size={props.size || 18} {...props} />,
  Camera: (props: IconProps) => <Camera size={props.size || 18} {...props} />,
  Signature: (props: IconProps) => <PenTool size={props.size || 18} {...props} />,
  Clock: (props: IconProps) => <Clock size={props.size || 18} {...props} />,
  CalendarDate: (props: IconProps) => <Calendar size={props.size || 18} {...props} />,
  Sparkles: (props: IconProps) => <Sparkles size={props.size || 18} {...props} />,
  
  // Datos y pagos
  Phone: (props: IconProps) => <Phone size={props.size || 16} {...props} />,
  Email: (props: IconProps) => <Mail size={props.size || 16} {...props} />,
  Location: (props: IconProps) => <MapPin size={props.size || 16} {...props} />,
  CreditCard: (props: IconProps) => <CreditCard size={props.size || 18} {...props} />,
  Cash: (props: IconProps) => <Banknote size={props.size || 18} {...props} />,
  Upload: (props: IconProps) => <UploadCloud size={props.size || 18} {...props} />,
  FileCheck: (props: IconProps) => <FileCheck size={props.size || 18} {...props} />
};
