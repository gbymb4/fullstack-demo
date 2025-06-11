# -*- coding: utf-8 -*-
'''
Created on Thu Feb 20 13:01:42 2025

@author: Gavin
'''

import os

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from config import ALLOWED_ORIGINS

load_dotenv('../.env')

REQUIRE_AUTH = os.getenv('REQUIRE_AUTH', 'False').lower() in ('true', '1', 't', 'yes', 'y')

def register_auth(app):
    if REQUIRE_AUTH: 
        origins = ALLOWED_ORIGINS
    else:
        origins = ['*']
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    