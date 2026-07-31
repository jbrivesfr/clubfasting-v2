import { redirect } from 'next/navigation'

export default function NewsfeedPage() {
  // Currently the newsfeed is embedded in the dashboard.
  redirect('/dashboard')
}
