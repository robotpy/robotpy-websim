pyfrc-html-interface
====================

The contents of this repo are highly experimental, and may explode on contact.
Eventually this repo will be destroyed, and be made part of the pyfrc repo.

Usage
=====

First, install wpilib/hal-base/hal-sim the normal way.

Next, install this package:

	cd py
	pip3 install -e .
	
Run one of the robotpy samples, with the following arguments pointing at the
public directory of this repo. The public directory will be served out via
the webserver builtin to this package:

	python3 robot.py server /path/to/public

