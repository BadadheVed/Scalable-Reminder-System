"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useReminders } from "@/hooks/useReminders";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { UpcomingBlocks } from "@/components/dashboard/UpcomingBlocks";
import { StudyBlockForm } from "@/components/forms/StudyBlockForm";
import { ReminderStats } from "@/components/dashboard/StudyStats";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { StudyBlock } from "@/types";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);

  // Reminders hook (backend uses /reminder/create and /reminder/get)
  const {
    reminders,
    loading: remindersLoading,
    createReminder,
    fetchReminders,
  } = useReminders();

  // Derive study blocks from reminders for display components
  const studyBlocks: StudyBlock[] = reminders.map((r) => {
    const startTime = new Date(r.time);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // default 60m
    const now = new Date();
    let status: StudyBlock["status"] = "upcoming";
    if (now >= startTime && now < endTime) status = "active";
    else if (now >= endTime) status = "completed";

    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      startTime,
      duration: 60,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      emailReminderSent: r.status === "SENT",
      status,
    };
  });

  const loading = remindersLoading;

  // Handlers used by forms/components
  const handleCreateBlock = async (
    data: Omit<
      StudyBlock,
      "id" | "userId" | "createdAt" | "updatedAt" | "status"
    >
  ) => {
    try {
      await createReminder({
        title: data.title,
        time: data.startTime,
        description: data.description,
      });
      setShowCreateForm(false);
      fetchReminders();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create reminder block");
    }
  };

  const handleUpdateBlock = async (
    _data: Omit<
      StudyBlock,
      "id" | "userId" | "createdAt" | "updatedAt" | "status"
    >
  ) => {
    toast.info("Updating study blocks is not supported yet");
    setEditingBlock(null);
  };

  const handleDeleteBlock = async (_id: string) => {
    toast.info("Deleting study blocks is not supported yet");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to tackle your study sessions today?
            </p>
          </div>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-sm">
                <Plus className="mr-2 h-5 w-5" />
                Add Reminder Block
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Reminder Block</DialogTitle>
              </DialogHeader>
              <StudyBlockForm onSubmit={handleCreateBlock} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Section */}
        <ReminderStats studyBlocks={studyBlocks} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <TodaySchedule
              studyBlocks={studyBlocks}
              loading={loading}
              onEdit={(block) => setEditingBlock(block)}
              onDelete={handleDeleteBlock}
            />
          </div>

          {/* Upcoming Blocks */}
          <div>
            <UpcomingBlocks
              studyBlocks={studyBlocks}
              loading={loading}
              onEdit={(block) => setEditingBlock(block)}
              onDelete={handleDeleteBlock}
            />
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingBlock}
          onOpenChange={(open) => !open && setEditingBlock(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Study Block</DialogTitle>
            </DialogHeader>
            {editingBlock && (
              <StudyBlockForm
                initialData={editingBlock}
                onSubmit={handleUpdateBlock}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
