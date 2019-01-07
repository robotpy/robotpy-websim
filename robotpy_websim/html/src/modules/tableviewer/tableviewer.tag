import './subtable.tag';
import './tableviewer.scss';
import './modal/nt-modal.tag';

<tableviewer>  
  <context-menu onclick={onContextMenuClick} container={root}>
    <a class="dropdown-item" href="#" data-action="addString">Add string</a>
    <a class="dropdown-item" href="#" data-action="addNumber">Add number</a>
    <a class="dropdown-item" href="#" data-action="addBoolean">Add boolean</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#" data-action="addStringArray">Add string array</a>
    <a class="dropdown-item" href="#" data-action="addNumberArray">Add number array</a>
    <a class="dropdown-item" href="#" data-action="addBooleanArray">Add boolean array</a>
  </context-menu>
  
  <modal ref="modal" title="Add Value" menu-action={this.contextMenu.action} parent-key={parentKey} editing={editing}>
    <nt-modal modal={this} menu-action={opts.menuAction} parent-key={opts.parentKey} editing={opts.editing} />
  </modal>
  <div class="table" oncontextmenu={onContextMenu} onclick={onClick}>
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item type">Type</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <script>

    this.contextMenu = {
      action: null
    };

    this.parentKey = '/';
    this.editing = false;

    this.onContextMenu = (ev) => {
      ev.preventDefault();

      const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');
      const isSubtable = $ntKey[0].tagName === 'SUBTABLE';

      if (!isSubtable) {
        return;
      }

      const ntKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');
      this.parentKey = ntKey;

      this.update();
    };

    this.onContextMenuClick = (ev) => {
      const $el = $(ev.target);
      const action = $el.attr('data-action');
      if (action) {
        this.editing = false;
        this.contextMenu.action = action;
        this.update();
        this.refs.modal.open();
      }
    };

    this.onClick = (ev) => {
      const isArray = $(ev.target).closest('.value.array').length > 0;
      const $ntKey = $(ev.target).closest('[data-nt-key], [nt-key]');

      if (!isArray) {
        return;
      }


      this.editing = true;
      this.parentKey = $ntKey.attr('data-nt-key') || $ntKey.attr('nt-key');
      let value = NetworkTables.getValue(this.parentKey);

      if (value.length === 0 || typeof value[0] === 'string') {
        this.contextMenu.action = 'addStringArray';
      }
      else if (typeof value[0] === 'number') {
        this.contextMenu.action = 'addNumberArray';
      }
      else if (typeof value[0] === 'boolean') {
        this.contextMenu.action = 'addBooleanArray';
      }
      
      this.update();
      this.refs.modal.open();
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