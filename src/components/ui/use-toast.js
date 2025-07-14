import { useContext } from "react"
import { ToastContext } from "../../context/ToastContext"

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        // Fallback if ToastContext is not available
        return {
            toast: ({ title, description, variant }) => {
                if (variant === "destructive") {
                    alert(`Error: ${title}\n${description}`)
                } else {
                    alert(`${title}\n${description}`)
                }
            }
        }
    }

    // Adapt the context API to match what CreatePost expects
    return {
        toast: ({ title, description, variant }) => {
            const message = title + (description ? `\n${description}` : "")
            const type = variant === "destructive" ? "error" : "success"
            context.showToast(message, { type })
        }
    }
}
