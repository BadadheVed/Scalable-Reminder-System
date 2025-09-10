'use client';

import { useState, useEffect } from 'react';
import { StudyBlock } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useStudyBlocks = () => {
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch study blocks
  const fetchStudyBlocks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/study-blocks');
      setStudyBlocks(response.data.studyBlocks);
    } catch (error: any) {
      console.error('Failed to fetch study blocks:', error);
      toast.error('Failed to load study blocks');
    } finally {
      setLoading(false);
    }
  };

  // Create study block
  const createStudyBlock = async (data: Omit<StudyBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const response = await api.post('/study-blocks', data);
      const newBlock = response.data.studyBlock;
      setStudyBlocks(prev => [...prev, newBlock]);
      return newBlock;
    } catch (error: any) {
      console.error('Failed to create study block:', error);
      throw new Error(error.response?.data?.message || 'Failed to create study block');
    }
  };

  // Update study block
  const updateStudyBlock = async (
    id: string, 
    data: Omit<StudyBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    try {
      const response = await api.put(`/study-blocks/${id}`, data);
      const updatedBlock = response.data.studyBlock;
      setStudyBlocks(prev => prev.map(block => 
        block.id === id ? updatedBlock : block
      ));
      return updatedBlock;
    } catch (error: any) {
      console.error('Failed to update study block:', error);
      throw new Error(error.response?.data?.message || 'Failed to update study block');
    }
  };

  // Delete study block
  const deleteStudyBlock = async (id: string) => {
    try {
      await api.delete(`/study-blocks/${id}`);
      setStudyBlocks(prev => prev.filter(block => block.id !== id));
      toast.success('Study block deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete study block:', error);
      toast.error('Failed to delete study block');
      throw error;
    }
  };

  useEffect(() => {
    fetchStudyBlocks();
  }, []);

  return {
    studyBlocks,
    loading,
    createStudyBlock,
    updateStudyBlock,
    deleteStudyBlock,
    refetch: fetchStudyBlocks,
  };
};