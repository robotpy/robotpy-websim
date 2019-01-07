
<nt-boolean-array>
  <div class="form-group row">
    <label for="nt-value" class="col-sm-2 col-form-label">Value</label>
    <div class="col-sm-10">
      <ul class="list-group">
        <li class="list-group-item" onfocus={onLiFocus} tabindex="1" each="{bool, index in value}">
            <div class="form-check">
              <input 
                class="form-check-input" 
                onchange={onChange} 
                onfocus={onInputFocus} 
                type="checkbox" 
                checked={bool} 
                id="nt-value-{index}" 
                value="nt-value" />
              <label class="form-check-label" for="nt-value-{index}">
                {bool.toString()}
              </label>
            </div>
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
      this.value = this.value.concat(false);
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
      const value = ev.target.checked;
      const index = $(ev.target).parents('li').index();
      this.value = [ ...this.value ];
      this.value[index] = value;
    };

    this.onLiFocus = (ev) => {
      const value = ev.target.value;
      const index = $(ev.target).index();
      if (index > -1) {
        this.LastInputInteractedWith = index;
      }
    }

    this.onInputFocus = (ev) => {
      const value = ev.target.value;
      const $li = $(ev.target).parents('li');
      if ($li.length > 0) {
        $li[0].focus();
      }
    }

    this.reset = (defaultValue = []) => {
      this.value = defaultValue;
      this.LastInputInteractedWith = -1;
      this.update();
    };
  </script>
</nt-boolean-array>