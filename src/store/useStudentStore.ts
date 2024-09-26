import { create } from 'zustand';
import { GenericStudentType, StudentClass } from '../screens/Students/Students.interface';

interface StudentStore {
  student: GenericStudentType | null;
  setStudent: (student: GenericStudentType) => void;
  updateClasses: (classes: StudentClass[]) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  student: null,
  setStudent: (student) => set({ student }),
  updateClasses: (newClasses) => set((state) => {
    if (!state.student) return state;
    return {
      student: {
        ...state.student,
        classes: [...state.student.classes || [], ...newClasses],
      },
    };
  }),
}));