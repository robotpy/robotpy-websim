


<table-context-menu>
  <div class="dropdown-menu {opts.show ? 'show' : ''}" style={getMenuPosition()} onclick={onClick}>
    <a class="dropdown-item" href="#" data-action="addString">Add string</a>
    <a class="dropdown-item" href="#" data-action="addNumber">Add number</a>
    <a class="dropdown-item" href="#" data-action="addBoolean">Add boolean</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#" data-action="addStringArray">Add string array</a>
    <a class="dropdown-item" href="#" data-action="addNumberArray">Add number array</a>
    <a class="dropdown-item" href="#" data-action="addBooleanArray">Add boolean array</a>
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

    this.onClick = (ev) => {
      const $el = $(ev.target);
      const action = $el.attr('data-action');

      if (action) {
        this.opts.onmenuclick(action);
      }
    };
  </script>

</table-context-menu>