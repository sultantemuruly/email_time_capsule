"use client";

import { useState, useEffect } from "react";
import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";
import EmailContainer from "@/components/email-container";
import { EmailContainerProps, EmailData } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { addMinutes, parseISO, isBefore } from "date-fns";

const canEditOrDeleteEmail = (email: EmailContainerProps & { id: string }) => {
  if (email.status !== "Pending") return false;

  const now = new Date();
  const minTime = addMinutes(now, 2); // 2 minutes from now

  const emailDateTime = parseISO(`${email.date}T${email.time}`);

  return isBefore(minTime, emailDateTime); // true if email is at least 2 minutes ahead
};

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [emails, setEmails] = useState<
    (EmailContainerProps & { id: string })[]
  >([]);
  const [editingEmail, setEditingEmail] = useState<
    (EmailContainerProps & { id: string }) | null
  >(null);
  const { user, loading } = useAuth();

  const fetchEmails = async () => {
    if (!user?.uid) return;

    setIsFetching(true);

    try {
      const response = await fetch(`/api/emails?userId=${user.uid}`);
      const data = await response.json();

      if (data?.emails && Array.isArray(data.emails)) {
        const formattedEmails: (EmailContainerProps & { id: string })[] =
          data.emails.map((email: EmailData & { id: string }) => ({
            recipient: email.recipient,
            title: email.title,
            content: email.content,
            date: email.date,
            time: email.time,
            status: email.status,
            id: email.id,
          }));
        setEmails(formattedEmails);
      }
    } catch (error) {
      console.error("Error fetching emails", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchEmails();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/emails?docId=${id}`, { method: "DELETE" });
      toast.success("Email deleted successfully");
      fetchEmails(); // Refresh emails after deletion
    } catch (error) {
      console.error("Failed to delete email", error);
      toast.error("Failed to delete email");
    }
  };

  const handleEdit = (email: EmailContainerProps & { id: string }) => {
    setEditingEmail(email);
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    setIsModalOpen(false);
    setEditingEmail(null);
    fetchEmails(); // Refresh emails after edit
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Warnings / Info Box */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-5 md:px-10 lg:px-20 py-5 rounded-md mx-5 md:mx-10 lg:mx-20 mt-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <span className="font-semibold text-lg">Important Information</span>
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
          <li>
            Emails can only be scheduled at least <strong>3 minutes</strong>{" "}
            into the future. Please ensure your scheduled time is set
            accordingly.
          </li>
          <li>
            Once a scheduled email is <strong>deleted</strong>, it cannot be
            recovered. Please double-check before deleting.
          </li>
          <li>
            You can only <strong>edit emails</strong> that are scheduled to be
            sent at least <strong>3 minutes</strong> from the current time.
          </li>
          <li>
            If the scheduled time of an email has already passed, the system
            will automatically attempt to send it as soon as possible. No need
            to reschedule manually.
          </li>
          <li>
            If an email fails to send, it usually indicates missing critical
            system information. Please try sending the email again manually.
          </li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-5 md:px-10 lg:px-20 py-5">
        <div className="text-lg md:text-2xl font-semibold">Schedule Emails</div>
        <Button
          variant="outline"
          className="bg-blue-700 text-white"
          onClick={() => {
            setEditingEmail(null);
            setIsModalOpen(true);
          }}
        >
          Send an email
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EmailSendForm
          onSuccess={handleModalSuccess}
          initialData={editingEmail}
        />
      </Modal>

      {/* Emails List */}
      {isFetching ? (
        <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
          <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 md:px-10 lg:px-20 pb-5">
          {emails.length === 0 ? (
            <div className="col-span-full text-center">No emails found</div>
          ) : (
            emails.map((email) => {
              const canEditOrDelete = canEditOrDeleteEmail(email);

              return (
                <EmailContainer
                  key={email.id}
                  id={email.id}
                  recipient={email.recipient}
                  title={email.title}
                  content={email.content}
                  date={email.date}
                  time={email.time}
                  status={email.status}
                  canEditOrDelete={canEditOrDelete}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
