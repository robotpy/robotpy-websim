#!/usr/bin/env python3

from setuptools import setup

setup(
    name='pyfrc-html-interface',
    version='0.1',
    #package_dir={'': '.'},
    py_modules=['pyfrc_server'],
    entry_points={'robotpy': [ 'server = pyfrc_server:Main' ]}
)
