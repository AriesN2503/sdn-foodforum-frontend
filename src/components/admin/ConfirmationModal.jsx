import React from "react";
import { Button } from "../ui/button";

export default function ConfirmationModal({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                {title && <h2 className="text-xl font-semibold text-red-600">{title}</h2>}
                {message && <p>{message}</p>}
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>{confirmText}</Button>
                </div>
            </div>
        </div>
    );
}
