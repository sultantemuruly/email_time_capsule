"use client";

import { EmailSendForm } from "@/components/email-send-form";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-20 py-5">
        <div className="text-lg md:text-2xl font-medium">
          Schedule you emails
        </div>
        <Button variant={"outline"} className="bg-blue-700 text-white">
          Send an email
        </Button>
      </div>
      <div>
        <EmailSendForm />
      </div>
    </div>
  );
};
export default DashboardPage;
