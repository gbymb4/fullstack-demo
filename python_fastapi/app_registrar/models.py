# -*- coding: utf-8 -*-
"""
Created on Fri Jan 31 13:58:35 2025

@author: Gavin
"""

from typing import List, Dict, Optional, Any

from pydantic import BaseModel

class RSSJSON(BaseModel):
    sources: List[str]
    


class QAJSON(BaseModel):
    question: str
    params: Optional[Dict[str, Any]] = { 
        'temperature': 0.7
    }
    
