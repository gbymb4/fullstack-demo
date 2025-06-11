'use client';
import { Title, Text, Card, Grid, Badge, Button, Stack } from '@mantine/core';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <Title order={1} className="text-4xl font-bold text-zinc-100">
          Welcome to the Fullstack App
        </Title>
        <Text size="lg" className="text-zinc-300 max-w-2xl mx-auto">
          A complete example of modern web development showcasing full-stack capabilities 
          with React, Next.js, and modern UI components.
        </Text>
      </div>

      <Grid gutter="xl" className="my-8">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" className="bg-zinc-800 border-zinc-700 h-full">
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Badge color="blue" variant="light">Frontend</Badge>
              </div>
              <Title order={3} className="text-zinc-100">Modern UI</Title>
              <Text size="sm" className="text-zinc-300">
                Built with React, Next.js, and Mantine components for a responsive 
                and interactive user experience.
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" className="bg-zinc-800 border-zinc-700 h-full">
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Badge color="green" variant="light">Backend</Badge>
              </div>
              <Title order={3} className="text-zinc-100">API Integration</Title>
              <Text size="sm" className="text-zinc-300">
                Demonstrates server-side rendering, API routes, and data fetching 
                patterns for full-stack applications.
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" className="bg-zinc-800 border-zinc-700 h-full">
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Badge color="purple" variant="light">Features</Badge>
              </div>
              <Title order={3} className="text-zinc-100">Rich Functionality</Title>
              <Text size="sm" className="text-zinc-300">
                Includes news aggregation, real-time chat, content submission, 
                and modern styling with dark mode support.
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" padding="xl" radius="md" className="bg-zinc-800 border-zinc-700" style={{ marginTop: '3rem' }}>
        <div className="text-center space-y-4">
          <Title order={2} className="text-zinc-100">Explore the Features</Title>
          <Text className="text-zinc-300 mb-6">
            Navigate through different sections to see various full-stack capabilities in action.
          </Text>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              component="a" 
              href="/news" 
              className="nav-button"
              variant="default"
            >
              View News Feed
            </Button>
            <Button 
              component="a" 
              href="/chat" 
              className="nav-button"
              variant="default"
            >
              Try Live Chat
            </Button>
            <Button 
              component="a" 
              href="/submit" 
              className="nav-button"
              variant="default"
            >
              Submit Content
            </Button>
          </div>
        </div>
      </Card>

      <div className="text-center text-zinc-400 text-sm space-y-2">
        <Text>Built with Next.js, React, Mantine, and Tailwind CSS</Text>
        <Text>Demonstrating modern full-stack development practices</Text>
      </div>
    </div>
  );
}