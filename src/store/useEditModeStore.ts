import { create } from "zustand";

interface EditModeStore {
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}

export const useEditModeStore = create<EditModeStore>((set) => ({
  isEdit: false,
  setIsEdit: (isEdit) => set({ isEdit }),
}));
