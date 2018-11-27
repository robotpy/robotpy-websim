

<slider>
  <label if={opts.label !== undefined}>
    <span class="label">{opts.label}</span> 
    <span class="value">{value.toFixed(2)}</span>
  </label>
  <div draggable="false" class="wrapper {opts.disabled ? 'disabled': ''}">
    <div ref="bar" draggable="false" class="slider-bar">
      <div class="background"></div>
      <div class="forground-and-button">
        <div class="foreground" style={foregroundStyles}></div>
        <div class="button" style={buttonStyles}></div>
      </div>
    </div>
    <div class="dragger"
          ref="dragger"
          draggable="true"
          ondragstart={dragStartHandler}
          ondrag={dragHandler} 
          ondragend={dragEndHandler}>
    </div>
  </div>


  <style>
    slider, slider * {
      tap-highlight-color: transparent;
    }

    .wrapper {
      width: 100%;
      height: 15px;
      position: relative;
    }

    .slider-bar {
      position: absolute;
      width: 100%;
      top: 5px;
      height: 5px;
    }

    .dragger {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 15px;
    }

    .background {
      background: #ccc;
      height: 100%;
      width: 100%;
      position: absolute;
    }

    .disabled .forground-and-button {
      opacity: .3;
    }

    .foreground {
      background: green;
      position: absolute;
      height: 100%;
    }

    .button {
      position: absolute;
      width: 15px;
      height: 15px;
      top: -5px;
      background: gray;
      border-radius: 50%;
    }

    label {
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;
    }

  </style>

  <script type="es6">
    
    this.min = parseFloat(this.opts.min);
    this.max = parseFloat(this.opts.max);
    this.value = Math.clamp(this.opts.val || 0, this.min, this.max);
    this.dragging = false;

    this.foregroundStyles = {};
    this.buttonStyles = {};  

    this.on('mount', () => {
      setTimeout(() => {
        this.setValue(this.getPosition(this.value));
        this.update();
      });
    });

    this.getPosition = (value) => {
      return this.getWidth() * (value - this.min) / (this.max - this.min);
    };

    this.setValue = (position) => {
      const widthPercent = Math.max(0, Math.min(1, position / this.getWidth()));
      this.value = this.min + widthPercent * (this.max - this.min);

      const boundedPosition = Math.clamp(position, 0, this.getWidth());
      this.styleBar(boundedPosition);

      if (this.opts.onchange) {
        this.opts.onchange(this.value, this.opts);
      }
    }

    this.styleBar = (boundry1) => {
      const boundry2 = this.getBoundry2();
      const leftBoundry = Math.min(boundry1, boundry2);
      const rightBoundry = Math.max(boundry1, boundry2);
      this.foregroundStyles.left = leftBoundry + 'px';
      this.foregroundStyles.right = (this.getWidth() - rightBoundry) + 'px';
      this.buttonStyles.left = boundry1 + 'px';

      let barColor = 'gray';

      if (this.value > 0) {
        barColor = 'green';
      }
      else if (this.value < 0) {
        barColor = 'red';
      }

      this.foregroundStyles.background = barColor;
      this.buttonStyles.background = barColor;
    }

    this.getBoundry2 = () => {
      if (this.max <= 0) {
        return this.getWidth();
      }
      else if (this.min >= 0) {
        return 0;
      }
      else {
        return this.getPosition(0);
      }
    }

    this.getWidth = () => {
      return this.refs.bar.offsetWidth;
    }

    this.roundValue = (value) => {
      return Math.round(value * 100) / 100;
    }

    this.dragStartHandler = (ev) => {
      if (!this.opts.disabled) {
        this.dragging = true;
      }
    }

    this.dragHandler = (ev) => {
      if (!this.dragging) {
        return;
      }
      let rect = ev.target.getBoundingClientRect();
      let x = ev.clientX - rect.left;
      this.setValue(x);
    }

    this.dragEndHandler = (ev) => {
      ev.preventDefault();

      if (!this.dragging) {
        return;
      }

      this.dragging = false;
      let rect = ev.target.getBoundingClientRect();
      let x = ev.clientX - rect.left;
      this.setValue(x);
    }
  </script>

</slider>