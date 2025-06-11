# -*- coding: utf-8 -*-
"""
Created on Thu Feb 13 11:59:29 2025

@author: Gavin
"""

import os

from dotenv import load_dotenv

from config import (
    get_logger,
    load_system_prompt
)

from ._client import get_client

load_dotenv('../.env')

client = get_client()
logger = get_logger()

def chat_completion(messages, temperature=0.7, **kwargs):
    model = f'{os.environ["LLM_PROVIDER"]}:{os.environ["LLM_MODEL"]}'
    
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        **kwargs
    )
    
    text = response.choices[0].message.content
    
    logger.info(f'LLM message received: {text}')
    
    return text



def ask_question(question, **kwargs):
    messages = [
        {
            'role': 'system',
            'content': load_system_prompt('default')
        },
        {
            'role': 'user',
            'content': question
        }
    ]
    
    try:
        answer = chat_completion(messages, **kwargs)
    except Exception as e:
        return {
            'status': 'err',
            'message': f'Failed to answer question with error: {str(e)}',
            'data': None
        }
    
    return {
        'status': 'ok',
        'message': 'Successfully answered question!',
        'data': {
            'answer': answer
        }
    }

