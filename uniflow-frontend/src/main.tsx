import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AppRouter } from './routes'
import { queryClient } from './config/queryClient'
import './i18n/config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppRouter />
            <Toaster position="bottom-center" toastOptions={{ className: 'text-sm font-medium' }} />
        </QueryClientProvider>
    </React.StrictMode>,
)
