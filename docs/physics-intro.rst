Introduction
============

The websim supports 2D rigid body physics for simulation and testing support using `Matter.js <http://brm.io/matter-js/>`_. It can be as simple or complex as you want to make it. We will continue to add helper functions (such as the ``Field``, ``Robot``, and ``Models`` modules) to make this a lot easier to do. By default the websim supports an overhead view of the robot, but you can also create a side profile of your robot as well to better simulate how end effectors interact with game pieces.

The idea is you provide a ``MyUserPhysics`` object that interacts with
the simulated HAL, and modifies motors/sensors accordingly depending on the
state of the simulation. An example of this would be measuring a motor
moving for a set period of time, and then changing a limit switch to turn
on after that period of time. This can help you do more complex simulations
of your robot code without too much extra effort.

By default, the websim doesn't modify any of your inputs/outputs without being
told to do so by your code or the simulation GUI.