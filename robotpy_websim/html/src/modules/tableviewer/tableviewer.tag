import './subtable.tag';
import './tableviewer.css';
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
  
  <modal ref="modal" title="Add Value" menu-action={this.contextMenu.action} parent-key={parentKey}>
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
      action: null
    };

    this.parentKey = '/';

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
        this.contextMenu.action = action;
        this.update();
        this.refs.modal.open();
      }
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