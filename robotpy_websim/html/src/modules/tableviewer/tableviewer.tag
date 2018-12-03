import './subtable.tag';
import './context-menu.tag';

<tableviewer>
  <table-context-menu show={contextMenu.show} x={contextMenu.x} y={contextMenu.y} />
  <div class="table" oncontextmenu={onContextMenu} onclick={onRightClick}>
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item type">Type</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <style>

    tableviewer {
    
    }

    .table {
      min-width: 450px;
    }

    .table-row {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #bbb;
    }

    .table-row.header > .row-item {
      font-weight: bold;
    }

    .row-item.key {
      width: 45%;
    }

    .row-item.type, .row-item.value {
      width: 25%;
    }

    .row-item {
      white-space: nowrap;
      overflow-x: scroll;
      padding: 3px 0;
      display: inline-block;
    }

    .row-item::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      height: 0px;
      background: transparent;  /* optional: just make scrollbar invisible */
    }

    .level-space {
      display: inline-block;
      width: 15px;
      height: 1px;
    }

  </style>


  <script>

    this.contextMenu = {
      x: 0,
      y: 0,
      show: false
    };

    this.onRightClick = (ev) => {
      let isLeftClick = this.isLeftClick(ev);

      if (isLeftClick) {
        this.contextMenu.show = false;
        this.update();
      }

      console.log(ev, isLeftClick);
    }



    this.onContextMenu = (ev) => {
      ev.preventDefault();

      this.contextMenu.show = true;
      this.contextMenu.x = ev.x;
      this.contextMenu.y = ev.y;

      const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');
      const isSubtable = $ntKey[0].tagName === 'SUBTABLE';
      const ntKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');


      this.update();
    };

    // https://stackoverflow.com/a/3944291
    this.isLeftClick = (ev) => {
      console.log(ev);
      if ("buttons" in ev) {
          return ev.buttons == 0;
      }
      let button = ev.which || ev.button;
      return button == 0;
    }

    const mapStateToOpts = (state) => {
      
      const values = state.networktables.values;

      return {
        values
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>


</tableviewer>