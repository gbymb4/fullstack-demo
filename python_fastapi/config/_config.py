# -*- coding: utf-8 -*-
"""
Created on Tue Jan 28 12:46:03 2025

@author: Gavin
"""

import os
import sys
import yaml
import logging

from dotenv import load_dotenv

load_dotenv()

def __load_config():    
    with open(os.getenv('CONFIG_FILE'), 'r') as f:
        return yaml.safe_load(f.read())


    
__config = __load_config()



logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
__logger = logging.getLogger(__name__)

for k, v in __config.items():
    sys.modules[__name__].__dict__[k] = v
    
    
    
API_PATH = os.getenv('API_PATH')
    


def get_logger():
    return __logger



def load_system_prompt(system):
    def prompt_path_helper(fname):
        return os.path.join(
            sys.modules[__name__].__dict__['SYSTEM_PROMPTS_PATH'], 
            fname
        )
    
    if system == 'default':
        fname = prompt_path_helper('default.txt')
    else:
        raise ValueError(f'Invalid system type \'{system}\'')
    
    with open(fname) as f:
        return f.read()

