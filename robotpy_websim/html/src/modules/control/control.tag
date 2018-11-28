import './control.css';

<control>
  <form class="form" action="">
    <div class="form-group">
      <div class="radio">
        <label>
          <input 
            type="radio" name="mode" value="disabled" checked={opts.mode === 'disabled'} onclick={onModeChange}>
          Disabled
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="mode" value="auto" checked={opts.mode === 'auto'} onclick={onModeChange} />
          Auto
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="mode" value="teleop" checked={opts.mode === 'teleop'} onclick={onModeChange} />
          Teleop
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="mode" value="test" checked={opts.mode === 'test'} onclick={onModeChange} />
          Test
        </label>
      </div>
    </div>
  </form>

  <div class="connection-notification {opts.connected ? 'connected' : 'disconnected'}">
    {opts.connected ? 'Connected!' : 'Disconnected!'}
  </div>

  <script>

    let tag = this;

    this.onModeChange = (ev) => {
      this.updateRobotMode(ev.target.value);
    };

    this.getMode = (control) => {
      if (control.autonomous) {
        return 'auto';
      } 
      else if (control.test) {
        return 'test';
      }
      else if (control.enabled) {
        return 'teleop';
      }
      else {
        return 'disabled';
      }
    }

    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;
      const dataIn = state.halData.in;
    
      this.update();

      return {
        connected: state.isRunning,
        mode: this.getMode(dataOut.control)
      };
    };

    const mapDispatchToMethods = {
      updateRobotMode: sim.actions.updateRobotMode
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);
    

  </script>

</control>