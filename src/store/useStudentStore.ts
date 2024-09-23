import { create } from 'zustand';
import { GenericStudentType } from '../screens/Students/Students.interface';

interface StudentStore {
  student: GenericStudentType | null;
  setStudent: (student: GenericStudentType) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  student: null,
  setStudent: (student) => set({ student }),
}));