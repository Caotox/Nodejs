// ------------------------ Titouan --------------------------------

// frontend/src/components/VoteButton.jsx
import React, { useState } from 'react';
import { Button, notification } from 'antd';

const VoteButton = ({ issueId }) => {
    const [voted, setVoted] = useState(false);

    const handleVote = async () => {
        try {
            await fetch(`/api/issues/${issueId}/vote`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setVoted(true);
            notification.success({ message: 'Vote enregistré !' });
        } catch (error) {
            notification.error({ message: 'Vous avez déjà voté' });
        }
    };

    return (
        <Button onClick={handleVote} disabled={voted}>
            {voted ? '✓ Déjà voté' : '👍 Soutenir ce problème'}
        </Button>
    );
};

export default VoteButton;

// -----------------------------------------