"use client";

import { useState, useEffect } from "react";

import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // to prevent scrolling when modal is open
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
      <div className="flex justify-between items-center px-20 py-5">
        <div className="text-lg md:text-2xl font-medium">
          Schedule you emails
        </div>
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
    </div>
  );
};
export default DashboardPage;
