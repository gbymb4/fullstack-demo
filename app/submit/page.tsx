'use client';

import { TextInput, Button, Title, Stack } from '@mantine/core';
import { useInputState } from '@mantine/hooks';

export default function SubmitPage() {
    const [name, setName] = useInputState('');
    const [email, setEmail] = useInputState('');

    const handleSubmit = async () => {
        await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });
        setName('');
        setEmail('');
    };

    return (
        <div>
            <Title order={2} mb="md">Submit User</Title>
            <Stack>
                <TextInput
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter name"
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter email"
                />
                <Button onClick={handleSubmit}>Submit</Button>
            </Stack>
        </div>
    );
}
