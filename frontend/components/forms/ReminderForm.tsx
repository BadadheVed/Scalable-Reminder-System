"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { addMinutes, format } from "date-fns";
import { toast } from "sonner";

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  time: z.string().min(1, "Time is required"),
  description: z.string().max(500, "Max 500 characters").optional(),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  onSubmit: (data: { title: string; time: Date; description?: string }) => Promise<void>;
}

export const ReminderForm = ({ onSubmit }: ReminderFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      time: format(addMinutes(new Date(), 15), "yyyy-MM-dd'T'HH:mm"),
      description: "",
    },
  });

  const onFormSubmit = async (data: ReminderFormData) => {
    setIsLoading(true);
    try {
      const time = new Date(data.time);
      const minTime = addMinutes(new Date(), 15);
      if (time < minTime) {
        toast.error("Reminders must be at least 15 minutes from now");
        return;
      }
      await onSubmit({ title: data.title, time, description: data.description });
      toast.success("Reminder created successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create reminder";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="e.g., Send project update" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Date & Time *</Label>
        <Input id="time" type="datetime-local" {...register("time")} />
        {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" rows={3} placeholder="Notes..." {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Reminder"
        )}
      </Button>
    </form>
  );
};


