

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
    this.value = 0;
    this.dragging = false;

    this.foregroundStyles = {};
    this.buttonStyles = {};  

    this.on('mount', () => {
      setTimeout(() => {
        if (this.opts.initialVal !== undefined) {
          this.setValue(this.opts.initialVal);
        }
        else {
          this.setValue(this.opts.val || 0);
        }
        this.update();
      });
    });

    this.on('update', () => {
      if (this.opts.val !== undefined && this.opts.val !== this.value) {
        this.setValue(this.opts.val);
      }
    });

    this.dragPositionToValue = (dragPosition) => {
      const widthPercent = Math.max(0, Math.min(1, dragPosition / this.getWidth()));
      return this.min + widthPercent * (this.max - this.min);
    }

    this.valueToSliderPosition = (value) => {
      return this.getWidth() * (value - this.min) / (this.max - this.min);
    }

    this.setValue = (value) => {
      this.value = Math.clamp(value || 0, this.min, this.max);
      const sliderPosition = this.valueToSliderPosition(this.value);
      this.setSliderPosition(sliderPosition);

      if (this.opts.onchange) {
        this.opts.onchange(this.value, this.opts);
      }
    };

    this.setSliderPosition = (sliderPosition) => {
      const boundries = this.getSliderBoundries(sliderPosition);
      this.foregroundStyles.left = boundries[0] + 'px';
      this.foregroundStyles.right = (this.getWidth() - boundries[1]) + 'px';
      this.buttonStyles.left = sliderPosition + 'px';

      let barColor = 'gray';

      if (this.value > 0) {
        barColor = 'green';
      }
      else if (this.value < 0) {
        barColor = 'red';
      }

      this.foregroundStyles.background = barColor;
      this.buttonStyles.background = barColor;
    };

    this.getSliderBoundries = (boundry1) => {
      let boundry2;
      
      if (this.max <= 0) {
        boundry2 = his.getWidth();
      }
      else if (this.min >= 0) {
        boundry2 = 0;
      }
      else {
        boundry2 = this.valueToSliderPosition(0);
      }

      const leftBoundry = Math.min(boundry1, boundry2);
      const rightBoundry = Math.max(boundry1, boundry2);

      return [leftBoundry, rightBoundry];
    };

    this.getWidth = () => {
      return this.refs.bar.offsetWidth;
    }

    this.roundValue = (value) => {
      return Math.round(value * 100) / 100;
    }

    this.dragStartHandler = (ev) => {
      if (!this.opts.disabled && this.opts.val === undefined) {
        this.dragging = true;
      }
    }

    this.dragHandler = (ev) => {
      if (!this.dragging) {
        return;
      }
      let rect = ev.target.getBoundingClientRect();
      let x = ev.clientX - rect.left;
      const value = this.dragPositionToValue(x);
      this.setValue(value);
    }

    this.dragEndHandler = (ev) => {
      ev.preventDefault();

      if (!this.dragging) {
        return;
      }

      this.dragging = false;
      let rect = ev.target.getBoundingClientRect();
      let x = ev.clientX - rect.left;
      const value = this.dragPositionToValue(x);
      this.setValue(value);
    }
  </script>

</slider>