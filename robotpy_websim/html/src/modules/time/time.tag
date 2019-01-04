import './time.css';

<time>
  <form ref="form" onsubmit={onStep}>
    <div class="form-check-inline">
      <input 
        class="form-check-input" 
        type="radio" 
        name="pause-resume-sim" 
        id="resume-sim" 
        value="resume"
        onchange={onButtonChange}
        checked={!opts.paused} />
      <label class="form-check-label" for="resume-sim">Run</label>
    </div>
    <div class="form-check-inline">
      <input 
        class="form-check-input" 
        type="radio" 
        name="pause-resume-sim" 
        id="pause-sim" 
        value="pause" 
        onchange={onButtonChange}
        checked={opts.paused}
        />
      <label class="form-check-label" for="pause-sim">Pause</label>
    </div>
    <div class="input-group mb-3">
      <input 
        ref="stepInput" 
        type="number" 
        class="form-control step"
        required={true}
        min="0"
        step=".001" />
      <div class="input-group-append">
        <button class="btn btn-secondary" type="submit">Step</button>
      </div>
    </div>
  </form>
  <div class="time">
    <h5>Time:</h5>
    <p>
      <span>{opts.mode.toFixed(3)} <b>mode</b>,<span>
      <span>{opts.total.toFixed(3)} <b>total</b></span>
    </p>
  </div>

  <script>
    this.onButtonChange = (ev) => {
      const value = ev.target.value;
      if (value === 'pause') {
        this.pauseSim();
      }
      else {
        this.resumeSim();
      }
    }

    this.onStep = (ev) => {
      ev.preventDefault();
      if (this.refs.form.checkValidity()) {
        let value = this.refs.stepInput.value;
        this.stepTime(value);
      }
    }

    const mapStateToOpts = (state) => {
      return {
        paused: state.time.paused,
        total: state.time.total,
        mode: state.time.mode
      };
    };

    const mapDispatchToMethods = {
      pauseSim: sim.actions.pauseSim,
      resumeSim: sim.actions.resumeSim,
      stepTime: sim.actions.stepTime
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);

  </script>

</time>