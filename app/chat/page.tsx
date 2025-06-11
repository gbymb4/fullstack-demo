'use client';

import { Textarea, Button, Title, Group } from '@mantine/core';
import { useInputState } from '@mantine/hooks';

export default function ChatPage() {
    const [message, setMessage] = useInputState('');

    const sendMessage = async () => {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        setMessage('');
    };

    return (
        <div>
            <Title order={2} mb="md">Chat</Title>
            <Textarea
                value={message}
                onChange={setMessage}
                placeholder="Type your message..."
                autosize
                minRows={3}
                mb="sm"
            />
            <Group justify="start">
                <Button onClick={sendMessage}>Send</Button>
            </Group>
        </div>
    );
}
