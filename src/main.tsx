import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import "./global.css"
import { ApolloProvider } from '@apollo/client'
import { client } from './lib/apollo'
import { Toaster } from './components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
      <Toaster/>
    </ApolloProvider>
  </React.StrictMode>,
)
