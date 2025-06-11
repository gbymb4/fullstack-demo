# -*- coding: utf-8 -*-
'''
Created on Tue Jan 28 16:01:49 2025

@author: Gavin
'''

import argparse
import uvicorn

from fastapi import FastAPI

from app_registrar import (
    register_auth,
    register_endpoints,
    register_exception_logging
)

from config import (
    TEST_HOST, 
    TEST_PORT
)

app = FastAPI()

register_auth(app)

register_endpoints(app)
register_exception_logging(app)
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    
    parser.add_argument(
        '-t', '--test', 
        action='store_true',  
        help='Whether to test local functions.'
    )
    parser.add_argument(
        '-H', '--host', 
        action='store_true',  
        help='Whether to host application via Uvicorn.'
    )
    
    args = parser.parse_args()
    
    if args.test:
        ...
    
    if args.host:
        uvicorn.run(app, host=TEST_HOST, port=TEST_PORT)
        
            