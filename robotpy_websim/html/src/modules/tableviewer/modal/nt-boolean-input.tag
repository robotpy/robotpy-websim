

<nt-boolean-input>
  <div class="form-group row">
    <label for="nt-value" class="col-sm-2 col-form-label">Value</label>
    <div class="col-sm-10">
      <div class="form-check">
        <input class="form-check-input" onchange={onChange} type="checkbox" checked={value} id="nt-value" value="nt-value">
        <label class="form-check-label" for="nt-value">
          {value.toString()}
        </label>
      </div>
    </div>
  </div>


  <script>
    this.value = false;

    this.onChange = (ev) => {
      this.value = ev.target.checked;
    };

    this.reset = () => {
      this.value = false;
      this.update();
    };
  </script>
</nt-boolean-input>