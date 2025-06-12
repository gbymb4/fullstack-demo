# -*- coding: utf-8 -*-
"""
Created on Wed Jun 11 17:54:05 2025

@author: Gavin
"""

import httpx

from config import RSS_SOURCES

def get_rss_feeds(sources):
    def check_source(source):
        s_sources = [s['name'] for s in RSS_SOURCES]
            
        try:
            idx = s_sources.index(source)
            
            return True, RSS_SOURCES[idx]['url']
        
        except:    
            return False, None
    
    feeds = []
    
    with httpx.Client() as client:
        for source in sources:
            known_source, source_url = check_source(source)
            
            if not known_source:
                return {
                    'status': 'err',
                    'message': 'Unknown RSS source passed.',
                    'data': None
                }
            
            response = client.get(source_url)
    
            feeds.append(response.content.decode())
    
    return {
        'status': 'ok',
        'message': 'Successfully retreived all RSS feeds.',
        'data': {
            'feeds': feeds
        }
    }
    
            