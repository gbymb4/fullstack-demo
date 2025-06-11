# -*- coding: utf-8 -*-
"""
Created on Tue Feb 11 14:19:30 2025

@author: Gavin
"""

import aisuite as ai

__client = ai.Client()

def get_client():
    global __client
        
    return __client

