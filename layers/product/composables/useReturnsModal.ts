export const useReturnsModal = () => {
    const modalOverlay = useState<boolean>(
        'returns-modal-overlay',
        () => false
    )

    return { modalOverlay }
}