'use client';

import { Textarea, Button, Title, Text, Container, Stack, Group, Loader, Box } from '@mantine/core';
import { useInputState, useListState, useToggle } from '@mantine/hooks';

type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [message, setMessage] = useInputState('');
  const [messages, messagesHandlers] = useListState<ChatMessage>([]);
  const [loading, toggleLoading] = useToggle();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    
    // Clear previous messages and add new user message
    messagesHandlers.setState([{ type: 'user', content: userMessage }]);
    setMessage('');
    toggleLoading();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LLM_API_ENDPOINT!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const result = await response.json();
      
      if (result.status === 'ok' && result.data?.answer) {
        messagesHandlers.setState([
          { type: 'user', content: userMessage },
          { type: 'assistant', content: result.data.answer }
        ]);
      } else {
        messagesHandlers.setState([
          { type: 'user', content: userMessage },
          { type: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      messagesHandlers.setState([
        { type: 'user', content: userMessage },
        { type: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      toggleLoading();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container size="lg" h="100vh" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <Title 
          order={1} 
          size="3rem"
          fw={300}
          c="gray.1"
          mb="md"
        >
          AI Assistant Chat
        </Title>
        <Text 
          size="lg" 
          c="gray.4" 
          maw={600} 
          mx="auto"
        >
          Ask me anything and I'll do my best to help you. Each conversation is independent.
        </Text>
      </div>

      {/* Chat Area */}
      <Box
        flex={1}
        style={{
          border: '2px solid var(--mantine-color-dark-4)',
          borderRadius: '12px',
          background: 'var(--mantine-color-dark-8)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '300px',
        }}
      >
        {messages.length === 0 && !loading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center'
          }}>
            <Text c="gray.5" size="lg">
              👋 Hello! Send me a message to get started.
            </Text>
          </div>
        ) : (
          <Stack gap="lg" style={{ flex: 1 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: msg.type === 'user' 
                      ? 'var(--mantine-color-blue-6)' 
                      : 'var(--mantine-color-dark-6)',
                    color: msg.type === 'user' 
                      ? 'white' 
                      : 'var(--mantine-color-gray-1)',
                  }}
                >
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, textAlign: 'left' }}>
                    {msg.content}
                  </Text>
                </Box>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Loader size="sm" />
                  <Text c="gray.4" size="sm">
                    Thinking...
                  </Text>
                </Box>
              </div>
            )}
          </Stack>
        )}
      </Box>

      {/* Input Area */}
      <Box
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--mantine-color-dark-6)',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        <Stack gap="md">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            autosize
            minRows={2}
            maxRows={6}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-7)',
                border: '1px solid var(--mantine-color-dark-4)',
                color: 'var(--mantine-color-gray-1)',
                '&:focus': {
                  borderColor: 'var(--mantine-color-blue-6)',
                },
              },
            }}
          />
          <Group justify="space-between" align="center">
            <Text size="xs" c="gray.6">
              {messages.length > 0 ? 'Sending a new message will start a fresh conversation' : 'Ready to chat'}
            </Text>
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              size="md"
              style={{ minWidth: '100px' }}
            >
              {loading ? <Loader size="sm" /> : 'Send'}
            </Button>
          </Group>
        </Stack>
      </Box>
    </Container>
  );
}