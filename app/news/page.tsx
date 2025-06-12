'use client';

import { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import { Container, Title, Text, Card, Group, Badge, Loader, Center, Button, Stack } from '@mantine/core';

type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
};

export default function NewsPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    
    const parser = new Parser();
    const url = process.env.NEXT_PUBLIC_RSS_API_ENDPOINT;
    
    if (!url) {
      setError('RSS API endpoint not configured');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sources: ['fox'] }),
      });

      const result = await response.json();
      
      if (result.status !== 'ok' || !Array.isArray(result.data?.feeds)) {
        throw new Error('Invalid response structure');
      }

      const allItems: FeedItem[] = [];
      
      for (const xmlString of result.data.feeds) {
        try {
          const feed = await parser.parseString(xmlString);
          const parsedItems: FeedItem[] = (feed.items ?? [])
            .filter((item): item is { title: string; link: string; pubDate?: string; contentSnippet?: string } => 
              !!item.title && !!item.link
            )
            .map((item) => ({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              contentSnippet: item.contentSnippet,
            }));
          allItems.push(...parsedItems);
        } catch (err) {
          console.warn('Failed to parse one feed:', err);
        }
      }
      
      setItems(allItems.slice(0, 10));
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container size="lg" py={60}>
        <Center>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading latest news...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py={60}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title 
          order={1} 
          size="3rem"
          fw={300}
          c="gray.1"
          mb="md"
        >
          Latest News Headlines
        </Title>
        <Text 
          size="lg" 
          c="gray.4" 
          maw={600} 
          mx="auto"
          mb="xl"
        >
          Stay informed with the latest breaking news and updates from trusted sources.
        </Text>
        <Group justify="center">
          <Button
            onClick={fetchFeeds}
            leftSection="🔄"
            variant="light"
            disabled={loading}
          >
            Refresh News
          </Button>
        </Group>
      </div>

      {/* Error State */}
      {error && (
        <Card 
          p="xl" 
          radius="md" 
          bg="dark.6" 
          withBorder
          style={{ borderColor: 'var(--mantine-color-red-9)' }}
          mb="xl"
        >
          <Text c="red.4" ta="center" size="lg">
            {error}
          </Text>
        </Card>
      )}

      {/* News Items */}
      {items.length > 0 && (
        <Stack gap="lg">
          {items.map((item, idx) => (
            <Card
              key={idx}
              p="xl"
              radius="md"
              bg="dark.6"
              style={{
                borderLeft: '4px solid var(--mantine-color-blue-6)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}
            >
              <Group justify="space-between" align="flex-start" gap="md">
                <div style={{ flex: 1 }}>
                  <Title 
                    order={3} 
                    size="1.25rem"
                    fw={500}
                    c="gray.1"
                    mb="sm"
                    style={{ 
                      lineHeight: 1.4,
                      cursor: 'pointer',
                    }}
                  >
                    {item.title}
                  </Title>
                  
                  {item.contentSnippet && (
                    <Text 
                      c="gray.5" 
                      size="sm" 
                      mb="sm"
                      lineClamp={2}
                    >
                      {item.contentSnippet}
                    </Text>
                  )}
                  
                  <Group gap="sm" align="center">
                    <Badge variant="light" color="blue" size="sm">
                      Fox News
                    </Badge>
                    {item.pubDate && (
                      <Text c="gray.6" size="xs">
                        {formatDate(item.pubDate)}
                      </Text>
                    )}
                  </Group>
                </div>
                
                <div style={{ 
                  color: 'var(--mantine-color-gray-6)', 
                  marginTop: '4px', 
                  flexShrink: 0,
                  fontSize: '16px'
                }}>
                  ↗
                </div>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      {/* No Items State */}
      {!loading && !error && items.length === 0 && (
        <Card p="xl" radius="md" bg="dark.6" withBorder>
          <Text c="gray.4" ta="center" size="lg">
            No news items available at the moment.
          </Text>
        </Card>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Text c="gray.6" size="sm">
          News aggregated from multiple sources • Updated in real-time
        </Text>
      </div>
    </Container>
  );
}