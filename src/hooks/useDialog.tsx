import create from 'zustand';

interface DialogState {
    isOpen: boolean;
    onClose: () => void;
    open: () => void;
}

const useDialog = create<DialogState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false, }),
}));
  
  export default useDialog;