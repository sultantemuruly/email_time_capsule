"use client";

import { useState, useEffect } from "react";

import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";
import EmailContainer from "@/components/email-container";
import { EmailContainerProps } from "@/lib/types";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const test_data: EmailContainerProps[] = [
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content:
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM. " +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM. " +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM." +
        "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      recipient: "Jane Smith",
      title: "Project Deadline",
      content: "Hi Jane, the project deadline is coming up next week.",
      date: "2025-04-30",
      time: "12:00 PM",
      status: "Failed",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      recipient: "John Doe",
      title: "Meeting Reminder",
      content: "Hi John, this is a reminder for our meeting tomorrow at 10 AM.",
      date: "2025-04-25",
      time: "10:00 AM",
      status: "Sent",
    },
  ];

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <div>
      <div className="flex justify-between items-center px-5 md:px-10 lg:px-20 py-5">
        <div className="text-lg md:text-2xl font-semibold">Schedule Emails</div>
        <Button
          variant={"outline"}
          className="bg-blue-700 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Send an email
        </Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EmailSendForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 md:px-10 lg:px-20 pb-5">
        {test_data.map((email, index) => (
          <EmailContainer
            key={index}
            recipient={email.recipient}
            title={email.title}
            content={email.content}
            date={email.date}
            time={email.time}
            status={email.status}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
