

<joystick>
  <h6 class="text-center">Joystick {opts.index}</h6>
  <form class="form-horizontal" action="">
    <p class="axis" data-axis={axis.label} if={axis.visible} each={axis in opts.axes}>
      <slider 
        label={axis.label} 
        min="-1" 
        max="1" initial-val={axis.value}
        axis-index={axis.index} 
        onchange={onSliderUpdate} />
    </p>
    <p class="pov" data-axis={pov.label} if={pov.visible} each={pov in opts.povs}>
      <slider 
        label={pov.label}
         min="-1" 
         max="360" 
         initial-val={pov.value} 
         pov-index={pov.index}
         onchange={onPovUpdate} />
    </p>
    <div class="buttons">
      <div class="form-check form-check-inline" if={button.visible} each={button in opts.buttons}>
        <input class="form-check-input" type="checkbox" id="{opts.index}-button-{button.index}" value="{button.index}" onclick={onButtonUpdate}>
        <label class="form-check-label" for="{opts.index}-button-{button.index}">{button.index}</label>
      </div>
    </div>
  </form>

  <script>
    this.onSliderUpdate = (value, opts) => {
      this.opts.axes[opts.axisIndex].value = value;
      this.opts.onupdate('axis', opts.axisIndex, value);
      this.update();
    }

    this.onPovUpdate = (value, opts) => {
      this.opts.povs[opts.povIndex].value = value;
      this.opts.onupdate('pov', opts.povIndex, value);
      this.update();
    }

    this.onButtonUpdate = (ev) => {
      this.opts.onupdate('button', ev.target.value, ev.target.checked);
    }


  </script>

</joystick>