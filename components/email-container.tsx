import React from "react";
import { EmailContainerProps, EmailStatus } from "../lib/types";

const getStatusClasses = (status: EmailStatus) => {
  switch (status) {
    case "Pending":
      return "bg-blue-500 text-white";
    case "Sent":
      return "bg-green-500 text-white";
    case "Failed":
      return "bg-red-500 text-white";
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
        className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold ${statusClasses}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      {/* Recipient */}
      <div className="text-lg font-semibold mb-2 ml-2">{recipient}</div>

      {/* Title */}
      <div className="text-xl font-medium mb-2 ml-2">{title}</div>

      {/* Content */}
      <div className="max-h-56 overflow-y-auto text-sm mb-6">{content}</div>

      {/* Date & Time */}
      <div className="absolute bottom-3 right-3 font-semibold text-md text-black">
        {date} {time}
      </div>
    </div>
  );
};

export default EmailContainer;
