import React, { createContext, useContext, useState, useCallback } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import ToastItem from "../components/ui/ToastItem";

// Context để quản lý toast
export const ToastContext = createContext();

// Custom hook để sử dụng toast
export function useToast() {
    return useContext(ToastContext);
}

// Provider để cung cấp toast cho các component con
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, { type = "info", duration = 2000 } = {}) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [
            ...prev,
            { id, message, type, duration, open: true },
        ]);
        return id;
    }, []);

    const closeToast = useCallback((id) => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, open: false } : t));
    }, []);

    // Remove toast from DOM after animation
    const handleOpenChange = (id, open) => {
        if (!open) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 200);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <RadixToast.Provider swipeDirection="right">
                <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            open={toast.open}
                            onOpenChange={(open) => {
                                if (!open) closeToast(toast.id);
                                handleOpenChange(toast.id, open);
                            }}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => closeToast(toast.id)}
                        />
                    ))}
                    <RadixToast.Viewport className="fixed bottom-6 right-6 flex flex-col gap-2 z-50" />
                </div>
            </RadixToast.Provider>
        </ToastContext.Provider>
    );
} 