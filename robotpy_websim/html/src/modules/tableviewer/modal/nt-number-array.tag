
<nt-number-array>
  <div class="form-group row">
    <label for="nt-value" class="col-sm-2 col-form-label">Value</label>
    <div class="col-sm-10">
      <ul class="list-group">
        <li class="list-group-item" each="{string in value}">
          <input 
            autocomplete="off"
            type="number" 
            class="form-control" 
            id="nt-value" 
            placeholder="value" 
            onchange={onChange} 
            onfocus={onInputFocus}
            value={string} />
        </li>
      </ul>
      <button type="button" class="btn btn-secondary add" onclick={add}>
        <span class="oi oi-plus"></span>
      </button>
      <button type="button" class="btn btn-secondary remove" onclick={remove}>
        <span class="oi oi-minus"></span>
      </button>
    </div>
  </div>

  <script>

    this.value = [];
    this.LastInputInteractedWith = -1;

    this.add = (ev) => {
      this.value = this.value.concat(0);
    };

    this.remove = (ev) => {
      if (this.LastInputInteractedWith === -1) {
        return;
      }
      this.value = [ ...this.value ];
      this.value.splice(this.LastInputInteractedWith, 1);
      this.LastInputInteractedWith = -1;
      this.update();
    };

    this.onChange = (ev) => {
      const value = ev.target.value;
      const index = $(ev.target).parent('li').index();
      this.value = [ ...this.value ];
      this.value[index] = value;
    };

    this.onInputFocus = (ev) => {
      const value = ev.target.value;
      const index = $(ev.target).parent('li').index();
      if (index > -1) {
        this.LastInputInteractedWith = index;
      }
    }

    this.reset = (defaultValue = []) => {
      this.value = defaultValue;
      this.LastInputInteractedWith = -1;
      this.update();
    };
  </script>
</nt-number-array>