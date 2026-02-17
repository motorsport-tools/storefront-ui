export const useRmaModal = () => {
    const modalOverlay = useState<boolean>('rma-modal-status', () => false);

    const open = () => {
        modalOverlay.value = true;
    };

    const close = () => {
        modalOverlay.value = false;
    };

    return {
        modalOverlay,
        open,
        close,
    };
};
