"use client";

import { useState } from "react";
import { format, addMinutes, isBefore, setHours, setMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { EmailSendFormProps } from "@/lib/types";

export function EmailSendForm({ onSuccess, initialData }: EmailSendFormProps) {
  const [recipient, setRecipient] = useState(initialData?.recipient || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [date, setDate] = useState<Date | null>(
    initialData?.date ? new Date(initialData.date) : null
  );
  const [time, setTime] = useState(initialData?.time || "12:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const getCombinedDateTime = (): Date | null => {
    if (!date) return null;
    const [hours, minutes] = time.split(":").map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const minTime = addMinutes(now, 2);
    const scheduled = getCombinedDateTime();

    if (!recipient || !title || !content || !scheduled) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (isBefore(scheduled, minTime)) {
      setError("Scheduled time must be at least 3 minutes in the future.");
      setLoading(false);
      return;
    }

    if (!user) {
      setError("You must be logged in to schedule an email.");
      setLoading(false);
      return;
    }

    setError(""); // Clear previous error

    try {
      const token = await user.getIdToken();

      const method = initialData ? "PUT" : "POST";
      const body = initialData
        ? {
            docId: initialData.id,
            userId: user.uid,
            recipient,
            title,
            content,
            date: format(scheduled, "yyyy-MM-dd"),
            time: format(scheduled, "HH:mm"),
            status: initialData.status,
          }
        : {
            userId: user.uid,
            recipient,
            title,
            content,
            date: format(scheduled, "yyyy-MM-dd"),
            time: format(scheduled, "HH:mm"),
            status: "Pending",
          };

      const response = await fetch("/api/emails", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          initialData
            ? "Email updated successfully!"
            : "Email scheduled successfully!"
        );
        onSuccess?.();

        setRecipient("");
        setTitle("");
        setContent("");
        setDate(null);
        setTime("12:00");

        window.location.reload();
      } else {
        const errorData = await response.json();
        const errMsg =
          errorData.error || "Failed to schedule email. Try again.";

        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto mt-10">
      <div>
        <Label className="py-2" htmlFor="recipient">
          Recipient
        </Label>
        <Input
          id="recipient"
          type="email"
          placeholder="example@example.com"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="py-2" htmlFor="title">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Email title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="py-2" htmlFor="content">
          Content
        </Label>
        <Textarea
          id="content"
          placeholder="Type your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="py-2" htmlFor="time">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-600 font-medium text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-blue-700 hover:bg-white hover:text-black"
      >
        {initialData ? "Update Email" : "Schedule Email"}
      </Button>
    </form>
  );
}
