import { BrowserRouter } from "react-router"
import { AuthProvider } from "./context/AuthContext"
import AppRoutes from "./routes/AppRoutes"
import { ToastProvider } from "./context/ToastContext"



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
