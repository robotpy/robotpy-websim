Enabling Physics Support
========================

Config.json
-----------

To enable physics, you must create a 'sim' directory and place a ``config.json`` file there, with the following JSON information::

    {
      "websim": {
        "robot": {
          "w": 2,
          "h": 3,
          "starting_x": 2,
          "starting_y": 20,
          "starting_angle": 0
        }
      }
    }

Values without units will default to feet and degrees, but you can optionally add units to your JSON::

    {
      "websim": {
        "robot": {
          "w": ".66m",
          "h": "1m",
          "starting_x": "24in",
          "starting_y": "20ft",
          "starting_angle": "0rad"
        }
      }
    }

Physics.js
----------

.. js:autoclass:: UserPhysics 
   :members:



