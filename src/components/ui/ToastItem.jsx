import * as RadixToast from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const toastVariants = cva(
    "bg-white border-l-4 rounded-xl shadow-md px-6 py-4 flex items-center gap-4 min-w-[320px] max-w-md",
    {
        variants: {
        variant: {
            success: "border-green-500",
            error: "border-red-500",
            info: "border-blue-500",
            warning: "border-yellow-500",
        },
        },
        defaultVariants: {
        variant: "info",
        },
    }
);

const toastIcons = {
    success: "✔️",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
};

export default function ToastItem({
    open,
    onOpenChange,
    message,
    type = "info",
    duration = 3000,
    onClose,
}) {
    return (
        <RadixToast.Root
            open={open}
            onOpenChange={(open) => {
                onOpenChange && onOpenChange(open);
                if (!open && onClose) onClose();
            }}
            duration={duration}
            className={cn(toastVariants({ variant: type }))}
        >
            <span className="text-2xl flex-shrink-0 select-none flex items-center justify-center h-8 w-8">
                {toastIcons[type] || toastIcons.info}
            </span>

            <div className="flex-1 text-gray-800 text-base font-semibold flex items-center">
                {message}
            </div>
            
            <RadixToast.Action asChild altText="Đóng">
                <button
                    onClick={onClose}
                    className="ml-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                    aria-label="Close"
                >
                    ×
                </button>
            </RadixToast.Action>
        </RadixToast.Root>
    );
} 