"use client";

import { useState, useEffect, useCallback } from "react";
import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";
import EmailContainer from "@/components/email-container";
import { EmailContainerProps, EmailData } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { addMinutes, parseISO, isBefore } from "date-fns";

// Check if the email can still be edited/deleted
const canEditOrDeleteEmail = (email: EmailContainerProps & { id: string }) => {
  if (email.status !== "Pending") return false;

  const now = new Date();
  const minTime = addMinutes(now, 2); // 2 minutes ahead

  const emailDateTime = parseISO(`${email.date}T${email.time}`);
  return isBefore(minTime, emailDateTime); // true if at least 3 minutes in future
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [emails, setEmails] = useState<
    (EmailContainerProps & { id: string })[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<
    (EmailContainerProps & { id: string }) | null
  >(null);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch emails function wrapped with useCallback
  const fetchEmails = useCallback(async () => {
    if (!user?.uid) return;

    setIsFetching(true);

    try {
      const response = await fetch(`/api/emails?userId=${user.uid}`);
      const data = await response.json();

      if (data?.emails && Array.isArray(data.emails)) {
        const formattedEmails = data.emails.map(
          (email: EmailData & { id: string }) => ({
            recipient: email.recipient,
            title: email.title,
            content: email.content,
            date: email.date,
            time: email.time,
            status: email.status,
            id: email.id,
          })
        );
        setEmails(formattedEmails);
      }
    } catch (error) {
      console.error("Error fetching emails", error);
      toast.error("Failed to load emails");
    } finally {
      setIsFetching(false);
    }
  }, [user?.uid]);

  // Initial fetch
  useEffect(() => {
    if (user?.uid) {
      fetchEmails();
    }
  }, [user?.uid, fetchEmails]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/emails?docId=${id}`, { method: "DELETE" });
      toast.success("Email deleted successfully");
      fetchEmails();
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
    fetchEmails();
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
      {/* Warnings */}
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
            sent at least <strong>3 minutes</strong> from now.
          </li>
          <li>
            If an email&apos;s scheduled time has already passed, the system
            will attempt to send it automatically as soon as possible. No manual
            action is needed.
          </li>
          <li>
            If an email fails to send, it usually means important system
            information is missing. Please try sending the email again.
          </li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-5 md:px-10 lg:px-20 py-5">
        <div className="text-lg md:text-2xl font-semibold">Schedule Emails</div>
        <Button
          variant="outline"
          className="bg-blue-700 text-white hover:bg-white hover:text-blue-700"
          onClick={() => {
            setEditingEmail(null);
            setIsModalOpen(true);
          }}
        >
          Send an Email
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EmailSendForm
          onSuccess={handleModalSuccess}
          initialData={editingEmail}
        />
      </Modal>

      {/* Email List */}
      {isFetching ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 md:px-10 lg:px-20 pb-5">
          {emails.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 mt-10">
              No emails found.
            </div>
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
}
