import './subtable.tag';
import './context-menu.tag';
import './tableviewer.css';
import './modal/nt-modal.tag';

<tableviewer>
  <table-context-menu onmenuclick={onContextMenuClick} show={contextMenu.show} x={contextMenu.x} y={contextMenu.y} />
  <modal ref="modal" menu-action={this.contextMenu.action} parent-key={parentKey}>
    <nt-modal modal={this} menu-action={opts.menuAction} parent-key={opts.parentKey} />
  </modal>
  <div class="table" oncontextmenu={onContextMenu} onclick={onLeftClick}>
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item type">Type</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <script>

    this.contextMenu = {
      x: 0,
      y: 0,
      show: false,
      action: null
    };

    this.parentKey = '/';

    this.onLeftClick = (ev) => {
      let isLeftClick = this.isLeftClick(ev);

      if (isLeftClick) {
        this.contextMenu.show = false;
        this.update();
      }
    }

    this.isLeftClick = (ev) => {
      // https://stackoverflow.com/a/3944291
      if ("buttons" in ev) {
          return ev.buttons == 0;
      }
      let button = ev.which || ev.button;
      return button == 0;
    }

    this.onContextMenu = (ev) => {
      ev.preventDefault();

      const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');
      const isSubtable = $ntKey[0].tagName === 'SUBTABLE';

      if (!isSubtable) {
        return;
      }

      this.contextMenu.show = true;
      this.contextMenu.x = ev.x;
      this.contextMenu.y = ev.y;

      const ntKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');
      this.parentKey = ntKey;

      this.update();
    };

    this.onContextMenuClick = (action) => {
      this.contextMenu.action = action;
      this.update();
      this.refs.modal.open();
    };

    const mapStateToOpts = (state) => {
      const values = state.networktables.values;
      return {
        values
      };
    };

    this.reduxConnect(mapStateToOpts, null);


  </script>


</tableviewer>