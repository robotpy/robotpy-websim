

<toggle-button>
  <button 
    type="button" 
    disabled={this.opts.disabled}
    class="btn {this.isToggled() ? 'btn-success' : 'btn-danger'} btn-circle"
    onclick={onClick}>
  </button>

  <style>
    .btn-circle {
      width: 18px;
      height: 18px;
      padding: 6px 0px;
      border-radius: 9px;
    }

    .btn-circle:focus {
      box-shadow: none;
    }

    .btn.btn-circle:not(:disabled):not(:disabled):active {
      box-shadow: none;
    }

    .btn-circle:disabled {
      background: gray;
      border-color: gray;
    }
  </style>

  <script>
    this.toggled = true;

    this.onClick = (ev) => {
      this.toggled = !this.toggled;
      this.update();
    };

    this.isToggled = () => {
      if (this.opts.toggled !== undefined) {
        return this.opts.toggled;
      }

      return this.toggled;
    }

  </script>

</toggle-button>