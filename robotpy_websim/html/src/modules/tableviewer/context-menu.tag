


<table-context-menu>
  <div class="dropdown-menu {opts.show ? 'show' : ''}" style={getMenuPosition()}>
    <a class="dropdown-item" href="#">Add string</a>
    <a class="dropdown-item" href="#">Add number</a>
    <a class="dropdown-item" href="#">Add boolean</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Add string array</a>
    <a class="dropdown-item" href="#">Add number array</a>
    <a class="dropdown-item" href="#">Add boolean array</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Add raw bytes</a>
  </div>


  <style>
    table-context-menu .dropdown-menu {
      position: fixed;
    }

  </style>

  <script>

    this.getMenuPosition = () => {
      return {
        left: this.opts.x,
        top: this.opts.y
      }
    };
  </script>

</table-context-menu>