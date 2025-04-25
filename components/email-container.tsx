import React from "react";
import { EmailContainerProps, EmailStatus } from "../lib/types";

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

const EmailContainer: React.FC<EmailContainerProps> = ({
  recipient,
  title,
  content,
  date,
  time,
  status,
}) => {
  const statusClasses = getStatusClasses(status);

  return (
    <div className="relative border border-gray-300 rounded-lg p-6 max-w-full w-full sm:max-w-md mx-auto">
      {/* Status Badge */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-medium ${statusClasses}`}
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
