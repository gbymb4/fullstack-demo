# -*- coding: utf-8 -*-
"""
Created on Fri Jan 31 13:55:47 2025

@author: Gavin
"""

import traceback

from fastapi.responses import JSONResponse

from config import get_logger, API_PATH
from functions import (
    time_func,
    get_rss_feeds,
    ask_question
)

from .models import RSSJSON, QAJSON

logger = get_logger()

def register_endpoints(app):
    @app.post(f'{API_PATH}/rss-feeds/')
    async def rss_feeds_endpoint(data: RSSJSON):
        try:
            result = time_func(
                get_rss_feeds, 
                data.sources
            )
            return JSONResponse(content=result)
        except Exception as e:
            logger.error(f'Error in {API_PATH}/rss-feeds/: {traceback.format_exc()}')
            return JSONResponse(
                content={'message': f'Internal Server Error: {str(e)}', 'data': None},
                status_code=500
            )



    @app.post(f'{API_PATH}/ask-question/')
    async def ask_question_endpoint(data: QAJSON):
        try:
            result = time_func(
                ask_question, 
                data.question,
                **data.params
            )
            return JSONResponse(content=result)
        except Exception as e:
            logger.error(f'Error in {API_PATH}/ask-question/: {traceback.format_exc()}')
            return JSONResponse(
                content={'message': f'Internal Server Error: {str(e)}', 'data': None},
                status_code=500
            )
        
