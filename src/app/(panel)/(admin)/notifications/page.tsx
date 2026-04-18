import Notifications from '@/components/notifications'
import AuthGuard from '@/components/common/AuthGuard'
import React from 'react'

export default function Page() {
  return (
    <AuthGuard>
      <div>
        <Notifications />
      </div>
    </AuthGuard>
  )
}
