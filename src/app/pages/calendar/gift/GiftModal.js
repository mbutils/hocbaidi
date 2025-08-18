import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import confetti from "canvas-confetti";

const GiftModal = (props) => {
    const { isModalOpen, handleCancel } = props;
    const [imageUrl, setImageUrl] = useState('');

    const getRandomImage = () => {
        const totalImages = 11;
        const randomIndex = Math.floor(Math.random() * totalImages) + 1;
        setImageUrl(`/imgs/${randomIndex}.png`);
    };

    useEffect(() => {
        if (isModalOpen) {
            getRandomImage();

            // Firework effect
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } else {
            setImageUrl('');
        }
    }, [isModalOpen]);
    
    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <img
                src={imageUrl}
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
        </Modal>
    )
}

export default GiftModal;