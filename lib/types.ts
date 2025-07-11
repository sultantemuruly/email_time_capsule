import { User } from "firebase/auth";

export type EmailStatus = "Pending" | "Sent" | "Failed";

export interface EmailData {
  userId: string;
  recipient: string;
  title: string;
  content: string;
  date: string;
  time: string;
  status: EmailStatus;
}

export type EmailContainerProps = Omit<EmailData, "userId">;

export type EmailSendFormProps = {
  onSuccess?: () => void;
  initialData?: (EmailContainerProps & { id: string }) | null;
};

export interface UserData {
  uid: string;
  email: string;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
