import './auto-chooser.css';
import * as _ from 'lodash';

<auto-chooser>
  <form class="auto-chooser-form">
    <div class="form-group">
      <select ref="select" id="auto-chooser" class="form-control">
        <option value={option} selected={opts.selected === option} each={option in opts.options}>
          {option}
        </option>
      </select>
    </div>
  </form>

  <script>

    this.on('mount', () => {
    
      const $select = $(this.refs.select);

      $select.select2({
        theme: 'bootstrap4',
        width: '100%',
        placeholder: 'Autonomous Chooser'
      });

      $select.on('change', (ev) => {
        const value = ev.target.value;
        NetworkTables.setValue('/SmartDashboard/Autonomous Mode/selected', value);
      }); 
    });

    const mapStateToOpts = (state) => {
      const table = state.networktables.rawValues;
      const options = table['/SmartDashboard/Autonomous Mode/options'] || [];
      const defaultOption = table['/SmartDashboard/Autonomous Mode/default'];
      const selected = table['/SmartDashboard/Autonomous Mode/selected'] || defaultOption || '';

      if (selected !== this.opts.selected) {
        const $select = $(this.refs.select);
        $select.val(selected).trigger('change');
      }

      return {
        options,
        selected
      };
    };

    this.reduxConnect(mapStateToOpts, null);
  </script>

</auto-chooser>