'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { StudyBlock } from '@/types';
import { format, addMinutes } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const studyBlockSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
});

type StudyBlockFormData = z.infer<typeof studyBlockSchema>;

interface StudyBlockFormProps {
  onSubmit: (data: Omit<StudyBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  initialData?: StudyBlock;
}

const durationOptions = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' },
];

export const StudyBlockForm = ({ onSubmit, initialData }: StudyBlockFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StudyBlockFormData>({
    resolver: zodResolver(studyBlockSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startTime: initialData 
        ? format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm")
        : format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
      duration: initialData?.duration || 60,
    },
  });

  const selectedDuration = watch('duration');

  const handleFormSubmit = async (data: StudyBlockFormData) => {
    setIsLoading(true);
    try {
      const startTime = new Date(data.startTime);
      const now = new Date();

      // Validate that the start time is at least 15 minutes from now (for new blocks)
      if (!initialData) {
        const minStartTime = addMinutes(now, 15);
        if (startTime < minStartTime) {
          toast.error('Study sessions must be scheduled at least 15 minutes in advance');
          return;
        }
      }

      await onSubmit({
        title: data.title,
        description: data.description || '',
        startTime: startTime,
        duration: data.duration,
        emailReminderSent: false,
      });
      
      toast.success(initialData ? 'Study block updated successfully!' : 'Study block created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save study block');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Subject/Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Mathematics Review, History Essay"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Start Date & Time *</Label>
        <Input
          id="startTime"
          type="datetime-local"
          {...register('startTime')}
        />
        {errors.startTime && (
          <p className="text-sm text-destructive">{errors.startTime.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration *</Label>
        <Select 
          onValueChange={(value) => setValue('duration', parseInt(value))}
          defaultValue={selectedDuration?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add notes, topics to cover, or reminders..."
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Block' : 'Create Block'
          )}
        </Button>
      </div>
    </form>
  );
};