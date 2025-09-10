'use client';

import { format, isAfter, addDays, isSameDay } from 'date-fns';
import { StudyBlock } from '@/types';
import { StudyBlockCard } from '@/components/dashboard/StudyBlockCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { StudyBlockSkeleton } from '@/components/dashboard/StudyBlockSkeleton';

interface UpcomingBlocksProps {
  studyBlocks: StudyBlock[];
  loading: boolean;
  onEdit: (block: StudyBlock) => void;
  onDelete: (id: string) => void;
}

export const UpcomingBlocks = ({ studyBlocks, loading, onEdit, onDelete }: UpcomingBlocksProps) => {
  const tomorrow = addDays(new Date(), 1);
  const nextWeek = addDays(new Date(), 7);

  const upcomingBlocks = studyBlocks
    .filter(block => {
      const blockDate = new Date(block.startTime);
      return isAfter(blockDate, tomorrow) && isAfter(nextWeek, blockDate);
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5); // Show only next 5 blocks

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Upcoming (Next 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <StudyBlockSkeleton />
            <StudyBlockSkeleton />
          </div>
        ) : upcomingBlocks.length > 0 ? (
          <div className="space-y-4">
            {upcomingBlocks.map((block) => (
              <StudyBlockCard
                key={block.id}
                block={block}
                onEdit={onEdit}
                onDelete={onDelete}
                showDate
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No upcoming study sessions scheduled
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};