import CanonicalPath from './CanonicalPath'

export const metadata = {}

export default function DashboardLayout({ children }) {
  return (
    <>
      <CanonicalPath />
      {children}
    </>
  )
}
