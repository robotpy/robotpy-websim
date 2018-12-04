
<nt-string-input>
  <div class="form-group row">
    <label for="nt-value" class="col-sm-2 col-form-label">Value</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="nt-value" placeholder="value" onchange={onChange} value={value}>
    </div>
  </div>

  <script>
    this.value = '';
    this.onChange = (ev) => {
      this.value = ev.target.value;
    };

    this.reset = () => {
      this.value = '';
      this.update();
    };
  </script>
</nt-string-input>