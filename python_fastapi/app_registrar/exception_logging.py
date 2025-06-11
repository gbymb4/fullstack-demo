# -*- coding: utf-8 -*-
"""
Created on Fri Jan 31 14:02:32 2025

@author: Gavin
"""

import traceback

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

from config import get_logger

logger = get_logger()

def register_exception_logging(app):
    @app.middleware('http')
    async def log_request(request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            logger.error(f'Passing exception to global_exception_handler: {str(e)}')
            raise e



    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        if isinstance(exc, HTTPException):
            logger.error(f'HTTPException occurred: {str(exc)}')
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    'status_code': exc.status_code,
                    'content': {
                        'message': exc.detail or 'HTTP Error',
                        'details': str(exc)
                    }
                }
            )


        logger.error(f'Unhandled error: {traceback.format_exc()}')

        return JSONResponse(
            status_code=500,
            content={
                'status_code': 500,
                'content': {
                    'message': 'Internal Server Error',
                    'details': str(exc)
                }
            }
        )

