import './nt-string-input.tag';
import './nt-number-input.tag';
import './nt-boolean-input.tag';
import './nt-string-array.tag';
import './nt-number-array.tag';
import './nt-boolean-array.tag';

<nt-modal>
  <div class="modal-body">
    <form>
      <div class="form-group row">
        <label for="nt-key" class="col-sm-2 col-form-label">Key</label>
        <div class="col-sm-10">
          <input ref="keyInput" disabled={opts.editing} type="text" class="form-control" id="nt-key" placeholder="key">
        </div>
      </div>

      <virtual if={opts.menuAction === 'addString'}>
        <nt-string-input ref="valueInput" />
      </virtual>

      <virtual if={opts.menuAction === 'addNumber'}>
        <nt-number-input ref="valueInput" />
      </virtual>

      <virtual if={opts.menuAction === 'addBoolean'}>
        <nt-boolean-input ref="valueInput" />
      </virtual>

      <virtual if={opts.menuAction === 'addStringArray'}>
        <nt-string-array ref="valueInput" />
      </virtual>

      <virtual if={opts.menuAction === 'addNumberArray'}>
        <nt-number-array ref="valueInput" />
      </virtual>

      <virtual if={opts.menuAction === 'addBooleanArray'}>
        <nt-boolean-array ref="valueInput" />
      </virtual>

    </form>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" onclick={add}>
      {opts.editing ? 'Edit' : 'Add'}
    </button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  </div>


  <script>

    this.opts.modal.onShow(() => {
      if (!this.opts.editing) {
        this.refs.keyInput.value = '';
        this.refs.valueInput.reset();
      }
      else {
        this.refs.keyInput.value = this.opts.parentKey;
        const defaultValue = NetworkTables.getValue(this.opts.parentKey, []);
        this.refs.valueInput.reset(defaultValue);
      }
    });

    this.add = (ev) => {
      const key = this.refs.keyInput.value;
      let value = this.refs.valueInput.value;

      if (opts.menuAction === 'addNumber') {
        value = parseFloat(value);
      }
      else if (opts.menuAction === 'addNumberArray') {
        value = value.map(v => parseFloat(v));
      }
      
      if (!this.opts.editing) {
        NetworkTables.putValue(this.opts.parentKey + key, value);
      }
      else {
        NetworkTables.putValue(this.refs.keyInput.value, value);
      }

      this.opts.modal.close();
    };

  </script>

</nt-modal>