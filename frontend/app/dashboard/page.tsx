'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudyBlocks } from '@/hooks/useStudyBlocks';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { UpcomingBlocks } from '@/components/dashboard/UpcomingBlocks';
import { StudyBlockForm } from '@/components/forms/StudyBlockForm';
import { StudyStats } from '@/components/dashboard/StudyStats';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { StudyBlock } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { studyBlocks, loading, createStudyBlock, updateStudyBlock, deleteStudyBlock } = useStudyBlocks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);

  const handleCreateBlock = async (data: Omit<StudyBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      await createStudyBlock(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create study block:', error);
    }
  };

  const handleUpdateBlock = async (data: Omit<StudyBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!editingBlock) return;
    
    try {
      await updateStudyBlock(editingBlock.id, data);
      setEditingBlock(null);
    } catch (error) {
      console.error('Failed to update study block:', error);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await deleteStudyBlock(id);
    } catch (error) {
      console.error('Failed to delete study block:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to tackle your study sessions today?
            </p>
          </div>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-sm">
                <Plus className="mr-2 h-5 w-5" />
                Add Study Block
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Study Block</DialogTitle>
              </DialogHeader>
              <StudyBlockForm onSubmit={handleCreateBlock} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Section */}
        <StudyStats studyBlocks={studyBlocks} />

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
        <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
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