import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "@/axios/axios";
import { toast } from "sonner";

export type ReminderStatus = "PENDING" | "SENT" | "FAILED";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: Date;
  status: ReminderStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface CreateReminderData {
  title: string;
  time: Date;
  description?: string;
}

interface UseRemindersReturn {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  createReminder: (data: CreateReminderData) => Promise<void>;
  fetchReminders: () => Promise<void>;
}

export const useReminders = (): UseRemindersReturn => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeReminder = (r: any): Reminder => ({
    ...r,
    time: new Date(r.time),
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  });

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/reminder/get");
      const data = res.data;
      if (data?.success) {
        setReminders(data.reminders.map(normalizeReminder));
      } else {
        throw new Error(data?.message || "Failed to fetch reminders");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 401
          ? "Session expired. Please log in again."
          : status === 500
          ? "Server error while fetching reminders"
          : err?.message || "Failed to fetch reminders");
      setError(msg);
      if (reminders.length > 0) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [reminders.length]);

  const createReminder = useCallback(async (data: CreateReminderData) => {
    setError(null);
    try {
      console.log("Sending reminder creation request:", {
        title: data.title,
        time: data.time.toISOString(),
        description: data.description,
      });
      
      const res = await axiosInstance.post("/reminder/create", {
        title: data.title,
        time: data.time.toISOString(),
        description: data.description,
      });
      
      console.log("Reminder creation response:", res.data);
      
      const payload = res.data;
      if (payload?.success) {
        const newReminder = normalizeReminder(payload.reminder);
        console.log("Adding new reminder to state:", newReminder);
        setReminders((prev) => [...prev, newReminder]);
        console.log("Reminder added successfully");
      } else {
        throw new Error(payload?.message || "Failed to create reminder");
      }
    } catch (err: any) {
      console.error("Error in createReminder:", err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 400
          ? "Please check the reminder details (title/time)."
          : status === 401
          ? "You are not authorized. Please log in."
          : status === 500
          ? "Server error while creating reminder"
          : err?.message || "Failed to create reminder");
      console.log(msg);
      setError(msg);
      toast.error(msg);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { reminders, loading, error, createReminder, fetchReminders };
};
