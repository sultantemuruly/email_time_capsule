import React from "react";
import { X } from "lucide-react";
import { Button } from "../button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]">
        <Button
          onClick={onClose}
          variant={"destructive"}
          size={"sm"}
          className="absolute top-3 right-3 bg-black"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </Button>

        {children}
      </div>
    </div>
  );
}
