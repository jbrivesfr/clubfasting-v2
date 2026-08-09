import CanonicalPath from './CanonicalPath'
import SkipLink from './SkipLink'

export const metadata = {}

export default function DashboardLayout({ children }) {
  return (
    <>
      <SkipLink />
      <CanonicalPath />
      {children}
    </>
  )
}
