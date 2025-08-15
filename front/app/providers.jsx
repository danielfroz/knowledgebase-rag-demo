'use client'

import ReduxProvider from '@/lib/redux/provider'

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  )
}