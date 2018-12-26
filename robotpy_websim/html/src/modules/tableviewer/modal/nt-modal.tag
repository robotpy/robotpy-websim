import './nt-string-input.tag';
import './nt-number-input.tag';
import './nt-boolean-input.tag';

<nt-modal>
  <div class="modal-body">
    <form>
      <div class="form-group row">
        <label for="nt-key" class="col-sm-2 col-form-label">Key</label>
        <div class="col-sm-10">
          <input ref="keyInput" type="text" class="form-control" id="nt-key" placeholder="key">
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

    </form>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" onclick={add}>Add</button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  </div>


  <script>

    this.opts.modal.onShow(() => {
      this.refs.keyInput.value = '';
      this.refs.valueInput.reset();
    });

    this.add = (ev) => {
      const key = this.refs.keyInput.value;
      let value = this.refs.valueInput.value;

      if (opts.menuAction === 'addNumber') {
        value = parseFloat(value);
      }
      
      NetworkTables.putValue(this.opts.parentKey + key, value);
      this.opts.modal.close();
    };

  </script>

</nt-modal>