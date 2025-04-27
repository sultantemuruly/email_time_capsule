"use client";

import type React from "react";
import type { EmailContainerProps, EmailStatus } from "../lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const getStatusClasses = (status: EmailStatus) => {
  switch (status) {
    case "Pending":
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    case "Sent":
      return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white";
    case "Failed":
      return "bg-gradient-to-r from-rose-500 to-rose-600 text-white";
    default:
      return "";
  }
};

interface EmailContainerFullProps extends EmailContainerProps {
  id: string;
  onDelete: (id: string) => void;
  onEdit: (email: EmailContainerProps & { id: string }) => void;
  canEditOrDelete: boolean;
}

const EmailContainer: React.FC<EmailContainerFullProps> = ({
  id,
  recipient,
  title,
  content,
  date,
  time,
  status,
  onDelete,
  onEdit,
  canEditOrDelete,
}) => {
  const statusClasses = getStatusClasses(status);

  return (
    <div
      className="relative border border-gray-200 rounded-xl p-6 max-w-full w-full sm:max-w-md mx-auto 
                    bg-gradient-to-b from-white to-gray-50
                    shadow-[0_10px_20px_rgba(0,0,0,0.07),_0_6px_6px_rgba(0,0,0,0.03)]
                    hover:shadow-[0_14px_28px_rgba(0,0,0,0.1),_0_10px_10px_rgba(0,0,0,0.05)]
                    transition-all duration-300 ease-in-out
                    transform hover:-translate-y-1"
    >
      {/* Top-right Action Buttons */}
      {canEditOrDelete && status === "Pending" && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-blue-50 transition-colors"
            onClick={() =>
              onEdit({ id, recipient, title, content, date, time, status })
            }
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
          {/* Delete Button with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  scheduled email and it cannot be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Status Badge */}
      <div
        className={`absolute top-4 left-4 px-3 py-1 text-xs rounded-full font-medium ${statusClasses} shadow-md`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      {/* Email Icon */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 shadow-inner">
          <Mail className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      {/* Recipient */}
      <div className="text-lg font-medium mt-6 mb-2 overflow-hidden break-words">
        <span className="text-gray-700">Recipient:</span>{" "}
        <span className="text-black font-semibold">{recipient}</span>
      </div>

      {/* Title */}
      <div className="text-xl font-medium mb-3 overflow-hidden break-words">
        <span className="text-gray-700">Title:</span>{" "}
        <span className="text-black font-semibold">{title}</span>
      </div>

      {/* Content */}
      <div
        className="rounded-lg p-4 max-h-56 overflow-y-auto text-md mb-10 break-words 
                     border border-gray-200 bg-white shadow-inner
                     hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]
                     transition-all duration-300"
      >
        {content}
      </div>

      {/* Date & Time */}
      <div
        className="absolute bottom-4 right-4 px-4 py-2 rounded-lg font-medium text-black
                     bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm"
      >
        <span className="text-gray-900 text-sm">Date:</span>{" "}
        <span className="text-black text-sm font-semibold">{date}</span>{" "}
        <span className="text-gray-900 text-sm">Time:</span>{" "}
        <span className="text-black text-sm font-semibold">{time}</span>
      </div>
    </div>
  );
};

export default EmailContainer;
