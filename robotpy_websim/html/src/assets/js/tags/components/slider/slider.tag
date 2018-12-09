import './slider.css';

<slider>
  <label if={opts.label !== undefined}>
    <span class="label">{opts.label}</span> 
    <span class="value">
      {this.opts.getValueLabel ?
        this.opts.getValueLabel(value) :
        this.getValueLabel(value)}
      </span>
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

  <script>
    
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
      //return;
      if (this.opts.setProgrammatically && this.opts.val !== undefined && this.opts.val !== this.value) {
        this.setValue(this.opts.val);
      }
    });

    this.dragPositionToValue = (dragPosition) => {
      return this.min + dragPosition * (this.max - this.min);
    };

    this.valueToSliderPosition = (value) => {
      return this.getWidth() * (value - this.min) / (this.max - this.min);
    };

    this.getValueLabel = (value) => {
      return value.toFixed(2);
    };

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
      // Button is 15px wide so subtract 8 from position to center it
      this.buttonStyles.left = (sliderPosition - 8) + 'px';

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
      if (!this.opts.disabled && !this.opts.setProgrammatically) {
        this.dragging = true;
      }
    }

    this.dragHandler = (ev) => {
      if (!this.dragging) {
        return;
      }

      // When user releases, clientX, screenX, x, etc. are always 0, which
      // causes the dragger to jump. If both screenX and screenY are 0, 
      // likely the user just released. https://stackoverflow.com/a/47241403
      if (!ev.screenX && !ev.screenY) {
        return;
      }

      const rect = ev.target.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const dragPosition = Math.clamp(x / this.getWidth(), 0, 1);
      const dragPositionToValue = this.opts.dragPositionToValue || this.dragPositionToValue;
      const value = dragPositionToValue(dragPosition);
      this.setValue(value);
    }

    this.dragEndHandler = (ev) => {
      ev.preventDefault();

      if (!this.dragging) {
        return;
      }

      this.dragging = false;
      const rect = ev.target.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const dragPosition = Math.clamp(x / this.getWidth(), 0, 1);
      const dragPositionToValue = this.opts.dragPositionToValue || this.dragPositionToValue;
      const value = dragPositionToValue(dragPosition);
      this.setValue(value);
    }
  </script>

</slider>