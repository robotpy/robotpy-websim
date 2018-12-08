# Code to simulate time
from pyfrc import sim
from pyfrc.test_support import pyfrc_fake_hooks

import hal_impl

fake_time = sim.FakeRealTime()
hal_impl.functions.hooks = pyfrc_fake_hooks.PyFrcFakeHooks(fake_time)
hal_impl.functions.reset_hal()