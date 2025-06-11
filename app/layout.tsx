'use client';

import { MantineProvider, ColorSchemeScript, Container } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className="min-h-screen bg-zinc-900 text-zinc-100">
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
        >
          <header className="border-b border-zinc-700 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex justify-center gap-4 text-lg font-medium">
                <a href="/" className="nav-button nav-home">Home</a>
                <a href="/news" className="nav-button nav-news">News</a>
                <a href="/chat" className="nav-button nav-chat">Chat</a>
                <a href="/submit" className="nav-button nav-submit">Submit</a>
              </nav>
            </div>
          </header>
          <main className="py-12 px-4">
            <Container size="md" className="text-center">
              {children}
            </Container>
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}