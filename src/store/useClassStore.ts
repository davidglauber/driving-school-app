import { create } from 'zustand';
import { StudentClass } from '../screens/Students/Students.interface';

interface ClassStore {
  classStudent: StudentClass | null;
  setClassStudent: (classStudent: StudentClass) => void;
}

export const useClassStore = create<ClassStore>((set) => ({
  classStudent: null,
  setClassStudent: (classStudent) => set({ classStudent }),
}));