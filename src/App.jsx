import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from "react-router"
import { AuthProvider } from "./context/AuthContext"
import AppRoutes from "./routes/AppRoutes"


function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App