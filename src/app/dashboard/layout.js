import CanonicalPath from './CanonicalPath'
import { ToastProvider } from '@/components/Toast'

export const metadata = {}

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <CanonicalPath />
      {children}
    </ToastProvider>
  )
}
