#!/usr/bin/env python3

from setuptools import setup

setup(
    name='pyfrc-html-interface',
    version='0.1',
    py_modules=['pyfrc_server'],
    entry_points={'robotpy': [ 'server = pyfrc_server:Main' ]},
    install_requires=[
        'wpilib>=2015.0.1',
        'robotpy-hal-sim>=2015.0.1'
    ]
)
