// src/routes/__root.tsx  (rename to __root.tsx in your project)
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation, Footer } from '../components/layout/Navigation'
import { useProfile } from '../hooks'

export const Route = createRootRoute({
  component: function Root() {
    const { data: profile } = useProfile()
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation profile={profile} />
        <div className="flex-1"><Outlet /></div>
        <Footer />
      </div>
    )
  },
})
