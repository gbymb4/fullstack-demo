# -*- coding: utf-8 -*-
"""
Created on Fri Jan 31 13:20:58 2025

@author: Gavin
"""

import time

def time_func(function, *inputs, **kwarg_inputs):
    begin = time.time()
    out = function(*inputs, **kwarg_inputs)
    end = time.time()
    
    out['exec_time'] = end - begin
    
    return out

