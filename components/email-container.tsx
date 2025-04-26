import React from "react";
import { EmailContainerProps, EmailStatus } from "../lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

const getStatusClasses = (status: EmailStatus) => {
  switch (status) {
    case "Pending":
      return "bg-blue-600 text-white";
    case "Sent":
      return "bg-green-600 text-white";
    case "Failed":
      return "bg-red-600 text-white";
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
    <div className="relative border border-gray-300 rounded-lg p-6 max-w-full w-full sm:max-w-md mx-auto">
      {/* Top-right Action Buttons */}
      {canEditOrDelete && status === "Pending" && (
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onEdit({ id, recipient, title, content, date, time, status })
            }
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )}

      {/* Status Badge */}
      <div
        className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full font-medium ${statusClasses}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      {/* Recipient */}
      <div className="text-lg font-medium mt-4 mb-2 overflow-hidden break-words">
        <strong>Recipient:</strong>{" "}
        <span className="text-fit">{recipient}</span>
      </div>

      {/* Title */}
      <div className="text-xl font-medium mb-3 overflow-hidden break-words">
        <strong>Title:</strong> <span className="text-fit">{title}</span>
      </div>

      {/* Content */}
      <div className="rounded p-4 max-h-56 overflow-y-auto text-md mb-8 break-words border border-gray-300">
        {content}
      </div>

      {/* Date & Time */}
      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg font-medium text-black">
        <strong>Date:</strong> {date} <strong>Time:</strong> {time}
      </div>
    </div>
  );
};

export default EmailContainer;
