"use client";

import { useState, useEffect } from "react";
import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";
import EmailContainer from "@/components/email-container";
import { EmailContainerProps, EmailData } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [emails, setEmails] = useState<EmailContainerProps[]>([]);
  const { user, loading } = useAuth();

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      if (user?.uid) {
        setIsFetching(true); // Start fetching

        try {
          const response = await fetch(`/api/emails?userId=${user.uid}`);
          const data = await response.json();

          if (data?.emails && Array.isArray(data.emails)) {
            const formattedEmails: EmailContainerProps[] = data.emails.map(
              (email: EmailData) => {
                const { ...props } = email;
                return props;
              }
            );
            setEmails(formattedEmails); // Set fetched emails
          } else {
            console.error(
              "Failed to fetch emails or emails are not in the expected format."
            );
          }
        } catch (error) {
          console.error("Error fetching emails", error);
        } finally {
          setIsFetching(false); // Stop fetching after completion
        }
      }
    };

    if (user?.uid) {
      fetchEmails();
    }
  }, [user]);

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

  // Show loader when fetching, otherwise show emails
  return loading ? (
    <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
      <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
    </div>
  ) : (
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

      {/* Show loader while fetching emails */}
      {isFetching ? (
        <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
          <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 md:px-10 lg:px-20 pb-5">
          {emails.length === 0 ? (
            <div className="col-span-full text-center">No emails found</div>
          ) : (
            emails.map((email, index) => (
              <EmailContainer
                key={index}
                recipient={email.recipient}
                title={email.title}
                content={email.content}
                date={email.date}
                time={email.time}
                status={email.status}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
