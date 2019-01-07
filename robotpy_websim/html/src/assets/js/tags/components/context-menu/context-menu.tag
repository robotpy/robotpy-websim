


<context-menu>
  <div 
    ref="dropdown" 
    class="dropdown-menu {this._show ? 'show' : ''}" 
    style={_getMenuPosition()}>
    
    <yield/>
  </div>


  <style>
    .dropdown-menu {
      position: fixed;
      overflow: scroll;
    }

  </style>

  <script>

    this._show = false;

    this.show = (x, y) => {
      this._x = x;
      this._y = y;
      this._show = true;
      this.update();
    };

    this.hide = () => {
      this._show = false;
      this.update();
    };

    this.on('mount', () => {

      $(window).on('click', (ev) => {
        let isLeftClick = this._isLeftClick(ev);
        if (isLeftClick) {
          this.hide();
        }
      });

      $(window).on('contextmenu', (ev) => {
        
        const clickedOnContainer = $(ev.target).closest(this.opts.container).length > 0;
        const clickedOnContextMenu = $(ev.target).closest(this.root).length > 0;
        const clickedOnModal = $(ev.target).closest('modal').length > 0;
        if (!clickedOnContainer) {
          this.hide();
        }
        else if (!clickedOnContextMenu && !clickedOnModal) { 
          ev.preventDefault();
          this.show(ev.clientX, ev.clientY);
        }
        else if (clickedOnContextMenu) {
          ev.preventDefault();
        }
      });
    });

    this.on('update', () => {
      this.refs.dropdown.scrollTo(0, 0);
    });

    this._getMenuPosition = () => {
      
      let height = this.refs.dropdown.scrollHeight;
      let maxHeight = window.innerHeight;
      let top = this._y;
      let bottom = top + height;

      if (bottom > window.innerHeight) {
        top -= bottom - maxHeight;
      } 

      return {
        left: this._x,
        top: Math.max(0, top),
        'max-height': Math.min(maxHeight, window.innerHeight - top),
        overflow: height > maxHeight ? 'scroll' : 'hidden'
      }
    };

    this._isLeftClick = (ev) => {
      // https://stackoverflow.com/a/3944291
      if ("buttons" in ev) {
        return ev.buttons == 0;
      }
      let button = ev.which || ev.button;
      return button == 0;
    }
  </script>

</context-menu>