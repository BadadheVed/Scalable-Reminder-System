'use client';

import { format, isToday } from 'date-fns';
import { StudyBlock } from '@/types';
import { StudyBlockCard } from '@/components/dashboard/StudyBlockCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { StudyBlockSkeleton } from '@/components/dashboard/StudyBlockSkeleton';

interface TodayScheduleProps {
  studyBlocks: StudyBlock[];
  loading: boolean;
  onEdit: (block: StudyBlock) => void;
  onDelete: (id: string) => void;
}

export const TodaySchedule = ({ studyBlocks, loading, onEdit, onDelete }: TodayScheduleProps) => {
  const todayBlocks = studyBlocks
    .filter(block => isToday(new Date(block.startTime)))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Schedule
          <span className="text-sm text-muted-foreground ml-auto">
            {format(new Date(), 'EEEE, MMMM d')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <StudyBlockSkeleton />
            <StudyBlockSkeleton />
          </div>
        ) : todayBlocks.length > 0 ? (
          <div className="space-y-4">
            {todayBlocks.map((block) => (
              <StudyBlockCard
                key={block.id}
                block={block}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study sessions today</h3>
            <p className="text-muted-foreground">
              Click "Add Study Block" to schedule your first session
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};