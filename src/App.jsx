import { BrowserRouter } from "react-router"
import { AuthProvider } from "./context/AuthProvider"
import { ToastProvider } from './context/ToastContext'
import AppRoutes from "./routes/AppRoutes"


function App() {
  return (
     <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App