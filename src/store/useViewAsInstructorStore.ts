import { create } from "zustand";

/**
 * Store for "View as instructor" mode.
 * When active, the app shows data scoped to the selected instructor instead of the logged-in admin.
 * No persistence - resets on app restart.
 */
interface ViewAsInstructorStore {
  viewAsInstructorAuthUid: string | null;
  viewAsInstructorName: string | null;
  startViewingAs: (params: { authUid: string; name: string }) => void;
  stopViewingAs: () => void;
}

export const useViewAsInstructorStore = create<ViewAsInstructorStore>((set) => ({
  viewAsInstructorAuthUid: null,
  viewAsInstructorName: null,
  startViewingAs: ({ authUid, name }) =>
    set({ viewAsInstructorAuthUid: authUid, viewAsInstructorName: name }),
  stopViewingAs: () =>
    set({ viewAsInstructorAuthUid: null, viewAsInstructorName: null }),
}));
