robotpy-websim
==============

This is an experimental HTML interface to the robotpy simulation library,
intended to be a replacement for the Tk simulator interface that comes
with pyfrc.

The primary control/simulation interface will be written in HTML/javascript,
with easy to create extension points for custom simulation actions for your
robot code. The idea is that this interface won't be specific to python, but
that the frontend can be reused with C++ or Java backends using a simulated
HAL library for those languages. Those have not been implemented yet.

Warning: The contents of this repo are highly experimental, and may explode
on contact.

Installation
============

Install this package with pip (requires python 3 to be installed)::

	pip3 install

Usage
=====

Given a python robot.py file, you should be able to execute the following::

	python3 robot.py websim
	
Once this is done, you can use a web browser (Chrome is preferred) to browse
to http://localhost:8000/ . The control interface should be there.

Custom extensions
=================

TODO

Authors
=======

Dustin Spicuzza came up with the original concept, but Amory Galili has done
much of the initial heavy lifting.
