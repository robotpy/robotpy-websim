import * as _ from 'lodash';

<joystick>
  <h6 class="text-center">Joystick {opts.index}</h6>
  <form class="form-horizontal" action="">
    <p class="axis" data-axis={axis.label} if={axis.visible} each={axis, index in opts.axes}>
      <slider 
        label={axis.label} 
        min="-1" 
        max="1" initial-val={axis.value}
        axis-index={axis.index} 
        onchange={onSliderUpdate}
        set-programmatically={opts.gamepad.connected} 
        val={opts.gamepad.axes ? opts.gamepad.axes[index] : 0}
        />
    </p>
    <p class="pov" data-axis={pov.label} if={pov.visible} each={pov in opts.povs}>
      <slider 
        label={pov.label}
         min="-1" 
         max="360" 
         initial-val={pov.value} 
         pov-index={pov.index}
         onchange={onPovUpdate} 
         get-value-label={getValueLabel} 
         drag-position-to-value={dragPositionToValue} />
    </p>
    <div class="buttons">
      <div class="form-check form-check-inline" if={button.visible} each={button in opts.buttons}>
        <virtual if={opts.gamepad.connected}>
          <input 
            class="form-check-input" type="checkbox" 
            id="{opts.index}-button-{button.index}" 
            value="{button.index}" onchange={onButtonUpdate}
            checked={opts.gamepad.buttons[button.index - 1]}
            disabled={true}
            />
        </virtual>
        <virtual if={!opts.gamepad.connected}>
          <input class="form-check-input" type="checkbox" id="{opts.index}-button-{button.index}" value="{button.index}" onchange={onButtonUpdate}>
        </virtual>
        <label class="form-check-label" for="{opts.index}-button-{button.index}">{button.index}</label>
      </div>
    </div>
  </form>

  <script>

    this.onupdate = _.throttle((type, index, value) => {
      this.opts.onupdate(type, index, value);
    }, 1);

    this.onSliderUpdate = (value, opts) => {
      this.opts.axes[opts.axisIndex].value = value;

      this.onupdate('axis', opts.axisIndex, value);
      //this.update();
    }

    this.onPovUpdate = (value, opts) => {
      this.opts.povs[opts.povIndex].value = value;
      this.onupdate('pov', opts.povIndex, value);
      //this.update();
    }

    this.onButtonUpdate = (ev) => {
      this.opts.onupdate('button', ev.target.value, ev.target.checked);
    }

    this.getValueLabel = (value) => {
      return value.toFixed(0);
    };

    this.dragPositionToValue = (dragPosition) => {
      const values = [-1, 0, 45, 90, 135, 180, 225, 270, 315, 360];
      return getClosest(dragPosition * 361 - 1, values);
    };

    const getClosest = (value, values) => {
      if (values.length === 0) {
        return null;
      }

      return values.reduce((closest, next) => {
        if (Math.abs(next - value) < Math.abs(closest - value)) {
          return next;
        }
        else {
          return closest;
        }
      });
    };

  </script>

</joystick>