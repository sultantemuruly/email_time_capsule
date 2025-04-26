"use client";

import { useState, useEffect } from "react";
import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/custom/modal";
import EmailContainer from "@/components/email-container";
import { EmailContainerProps, EmailData } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    <div>
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
            emails.map((email) => (
              <EmailContainer
                key={email.id}
                id={email.id}
                recipient={email.recipient}
                title={email.title}
                content={email.content}
                date={email.date}
                time={email.time}
                status={email.status}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
