
import * as _ from 'lodash';

<ctre-device>
  <div class="device">
    <div class="can-value">
      <slider label={''} min="-1" max="1" val={opts.can.value} disabled={false} />
    </div>

    <div class="form-check-inline">
      <input 
        class="form-check-input" 
        onchange={onLimitSwitchChange} 
        type="checkbox" checked={opts.can.fwd} 
        id="fwd-limit-switch" 
        value="fwd-limit-switch" />
      <label class="form-check-label" for="fwd-limit-switch">F</label>
    </div>

    <div class="form-check-inline">
      <input 
        class="form-check-input" 
        onchange={onLimitSwitchChange} 
        type="checkbox" checked={opts.can.rev} 
        id="rev-limit-switch" 
        value="rev-limit-switch" />
      <label class="form-check-label" for="rev-limit-switch">R</label>
    </div>
    
    <div class="labels">
      <label class="mode">
        <b>Mode:</b> {opts.can.modeLabel}
      </label>
      <div class="values">
        <label>
          <b>E:</b> {opts.can.encValue}
        </label>
        <label>
          <b>A:</b> {opts.can.analogValue}
        </label>
        <label>
          <b>P:</b> {opts.can.pwmValue}
        </label>
      </div>
    </div>

  </div>

  <style>

    .mode {
      margin-left: 7px;
    }
    

    .values label {
      margin-right: 5px;
    }

    .can-value {
      width: 200px;
      min-width: 200px;
      display: inline-block;
      margin: 5px 10px;
    }

    .form-check-inline {
      margin-right: 10px;
    }

    .labels {
      display: flex;
      justify-content: space-between;
    }

  </style>

  <script>

    let can = {};

    const initialize = _.once((halCan) => {
      const mode = halCan.control_mode;
      can = {
        value: halCan.value,
        mode,
        modeLabel: 'Unknown',
        encValue: halCan.quad_position,
        analogValue: halCan.analog_position,
        pwmValue: halCan.pulse_width_position,
        fwd: halCan.limit_switch_closed_for,
        rev: halCan.limit_switch_closed_rev
      };
    });

    const mapStateToOpts = (state) => {

      const halCan = state.halData.out.CAN[this.opts.deviceNumber];

      initialize(halCan);

      can.mode = halCan.control_mode;
      let modeLabel = this.opts.canModeMap[can.mode];
      can.modeLabel = modeLabel || 'unknown';
      can.value = halCan.value
      can.encValue = halCan.quad_position;
      can.analogValue = halCan.analog_position;
      can.pwmValue = halCan.pulse_width_position;

      this.update();

      return {
        can
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);


  </script>


</ctre-device>