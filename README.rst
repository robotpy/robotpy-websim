robotpy-websim
==============

This is an web interface for controlling low fidelity FRC robot simulations.
As the control/simulation interface is created using HTML/javascript, one of
the goals of this project is to make it very simple to create your own
custom animations and extensions to help simulate your robot more effectively.

Currently, the only backend for the interface interacts with python based
FRC robots using the RobotPy library, and is a replacement for the simulator
that comes with pyfrc.

However, the HTML/Javascript portion of the code is not designed to be
specific to python, but can be reused with C++ or Java backends using a
similar simulated HAL library for those languages. Those have not been
implemented yet, but that would be awesome if someone did it.

.. note:: The simulator and its extension APIs are still very experimental
          and are expected to vary until the start of the 2016 FRC season.

Documentation
=============

For usage, detailed installation information, and other notes, please see
our documentation at http://robotpy-websim.readthedocs.org

Quick Install + Demo
====================

If you have python3 and pip installed, then do::

	pip3 install --pre robotpy-websim

Once this is done, you can run a quick demo by running::

    cd examples/simple
    python3 robot.py websim

Your default browser (or Chrome) should be launched and show the control
interface. If it does not show automatically, you can browse to 
http://localhost:8000/

Authors
=======

* Dustin Spicuzza came up with the original concept
* Amory Galili has done much of the actual work and webdesign
