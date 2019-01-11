Unit Conversion
===============

pyfrc uses the `math.js <http://mathjs.org/>`_ library in some places for representing physical
quantities to allow users to specify the physical parameters of their robot
in a natural and non-ambiguous way. For example, to represent 5 feet::
    
    five_feet = math.unit(5, 'ft');

The websim defines the following custom units:

* ``cpm``: Counts per minute. Used to
  represent motor free speed
* ``Nm``: Shorthand for N-m or newton-meter. Used for motor torque.

* ``tmka``: The kA value used in the tankmodel (uses imperial units)
* ``tmkv``: The kV value used in the tankmodel (uses imperial units)

Refer to the `math.js unit documentation <http://mathjs.org/docs/datatypes/units.html>`_ for more
information.
