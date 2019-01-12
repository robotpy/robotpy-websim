Built in Modules
================

Analog
------

.. image:: images/analog.png

The analog module is used to display digital outputs and control the value of digital inputs with sliders.


Auto Chooser
------------

.. image:: images/auto-chooser.png

If you have multiple autonomous modes you can pick one using the auto chooser module.

CAN
---

.. image:: images/can.png

CAN devices such as the Talon SRX are simulated using the CAN module.

Mode Picker
-----------

.. image:: images/mode-picker.png

You can select the robot mode using the mode picker. For example, if you want to test your autonomous code you can select the *Auto* radio button.

Digital
-------

.. image:: images/digital.png

The digital module simulates digital devices such as PWMs, Digital I/Os, and Relays.

Encoder
-------

.. image:: images/encoder.png

Shows source channels, count, and distance traveled for simulated encoders. Encoder counts can be set in the ``MyUserPhysics`` class in the ``physics.js`` file.

Field
-----

.. image:: images/field.png
.. image:: images/field2.png

The field module is where the simulated robot physics happens. You can reset the field by opening the context menu and clicking the ``Reset`` menu item.

Game Data
---------

.. image:: images/game-data.png

The game data module is used to set the game specific message.

Gyro
----

.. image:: images/gyro.png

The gyro module is used to display the simulated gyro values. The gyro value is set using the simulated robot in the field module.

Joystick
--------

.. image:: images/joystick.png

The joystick module is used to simulate joystick values. Axes are set using sliders and buttons are set using checkboxes. Joystick axes and buttons can also be set using plugged in gamepads.

Solenoid
--------

.. image:: images/solenoid.png

The solenoid module is used to get simulated solenoid values.

Tableviewer
-----------

.. image:: images/tableviewer.png
.. image:: images/tableviewer4.png
.. image:: images/tableviewer2.png
.. image:: images/tableviewer3.png

Tableviewer is used to display and set Networktable values. Carets can be clicked to expand subtables. Values can be edited by clicked on the value column and added from modals which can be opened from the context menu.

Time
----

.. image:: images/time.png
.. image:: images/time2.png

The time module can be used to view the time spent in total and in the current mode, pause the sim, and step forward a certain amount of time in the simulation.