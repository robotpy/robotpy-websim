import './toggle-button.css';

<toggle-button>
  <button 
    type="button" 
    disabled={this.opts.disabled}
    class="btn {this.isToggled() ? 'btn-success' : 'btn-danger'} btn-circle"
    onclick={onClick}>
  </button>

  <script>
    this.toggled = true;

    this.onClick = (ev) => {
      this.toggled = !this.toggled;
      this.update();
    };

    this.isToggled = () => {
      if (this.opts.setProgrammatically) {
        return this.opts.toggled;
      }

      return this.toggled;
    }

  </script>

</toggle-button>