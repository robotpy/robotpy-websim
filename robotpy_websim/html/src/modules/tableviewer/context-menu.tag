


<table-context-menu>
  <div ref="dropdown" class="dropdown-menu {opts.show ? 'show' : ''}" style={getMenuPosition()} onclick={onClick}>
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
      overflow: scroll;
    }

  </style>

  <script>

    this.on('update', () => {
      this.refs.dropdown.scrollTo(0, 0);
    });

    this.getMenuPosition = () => {
      
      let height = this.refs.dropdown.scrollHeight;
      let maxHeight = window.innerHeight;
      let top = this.opts.y;
      let bottom = top + height;

      if (bottom > window.innerHeight) {
        top -= bottom - maxHeight;
      } 

      return {
        left: this.opts.x,
        top: Math.max(0, top),
        'max-height': Math.min(maxHeight, window.innerHeight - top),
        overflow: height > maxHeight ? 'scroll' : 'hidden'
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