'use client';

import { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import { List, Title, Anchor } from '@mantine/core';

type FeedItem = {
    title: string;
    link: string;
};

export default function NewsPage() {
    const [items, setItems] = useState<FeedItem[]>([]);

    useEffect(() => {
        const fetchFeed = async () => {
            const parser = new Parser();
            const feed = await parser.parseURL('https://moxie.foxnews.com/google-publisher/latest.xml');
            const cleanedItems: FeedItem[] = (feed.items ?? [])
                .filter((item): item is { title: string; link: string } => !!item.title && !!item.link)
                .slice(0, 5)
                .map((item) => ({
                    title: item.title,
                    link: item.link,
                }));
            setItems(cleanedItems);
        };

        fetchFeed();
    }, []);

    return (
        <>
            <Title order={1}>Latest Fox News Headlines</Title>
            <List>
                {items.map((item, idx) => (
                    <List.Item key={idx}>
                        <Anchor href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                        </Anchor>
                    </List.Item>
                ))}
            </List>
        </>
    );
}