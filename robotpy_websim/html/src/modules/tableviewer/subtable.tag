import * as _ from 'lodash';


<subtable>
  <div class="wrapper {expanded ? 'expanded' : 'collapsed'}">
    <div class="table-row subtable-header">
      <span class="row-item key">
        <span class="level-space" each={value in _.range(level)}></span>
          <span class="caret" onclick={toggleExpand}>
            <span class="oi oi-caret-right"></span>
            <span class="oi oi-caret-bottom"></span>
          </span>
          {opts.keyLabel}
        </span>
      <span class="row-item type"></span>
      <span class="row-item value"></span>
    </div>
    <virtual each={value, key in opts.values}>
      <virtual if={_.isPlainObject(value)}>
        <subtable 
          level={level + 1} 
          nt-key={opts.ntKey + key + '/'}
          key-label={key} 
          values={value} />
      </virtual>

      <virtual if={_.isArray(value)}>
        <div class="table-row" data-nt-key={opts.ntKey + key.replace('/', '')}>
          <span class="row-item key">
            <span class="level-space" each={value in _.range(level + 1)}></span>
            {key.replace('/', '')}
          </span>
          <span class="row-item type">
            Array
          </span>
          <span class="row-item value">
            [{value.join(', ')}]
          </span>
        </div>

      </virtual>

      <virtual if={typeof value !== 'object'}>
        <div class="table-row" data-nt-key={opts.ntKey + key.replace('/', '')}>
          <span class="row-item key">
            <span class="level-space" each={value in _.range(level + 1)}></span>
            {key.replace('/', '')}
          </span>
          <span class="row-item type">{typeof value}</span>
          <span class="row-item value">
            
            <virtual if={typeof value === 'boolean'}>
              <div class="form-check">
                <input class="form-check-input" onchange={onValueChange} type="checkbox" checked={value} value={opts.ntKey + key.replace('/', '')} id={opts.ntKey + key.replace('/', '')}>
                <label class="form-check-label" for={opts.ntKey + key.replace('/', '')}>
                  {value.toString()}
                </label>
              </div>
            </virtual>

            <virtual if={typeof value === 'string'}>
              <input type="text" class="form-control" onchange={onValueChange} id={opts.ntKey + key.replace('/', '')} value={value}>
            </virtual>

            <virtual if={typeof value === 'number'}>
              <input type="number" class="form-control" onchange={onValueChange} id={opts.ntKey + key.replace('/', '')} value={value}>
            </virtual>

          </span>
        </div>
      </virtual>
    </virtual>
  </div>

  <style>
    .collapsed > .table-row:not(.subtable-header),
    .collapsed > subtable {
      display: none;
    }

    .wrapper > .subtable-header .caret .oi {
      font-size: 12px;
      display: none;
    }

    .wrapper.expanded > .subtable-header .caret .oi-caret-bottom {
      display: inline-block;
    }

    .wrapper.collapsed > .subtable-header .caret .oi-caret-right {
      display: inline-block;
    }

    input[type=text], input[type=number]  {
      border: none;
      background: transparent;
      padding: 3px 5px;
      line-height: normal;
      height: auto;
    }

    input[type=text]:focus, input[type=number]:focus {
      border: none;
      box-shadow: none;
    }
  </style>
  
  <script>
    this.level = this.opts.level || 0;
    this.expanded = false;

    this.toggleExpand = (ev) => {
      let $el = $(ev.target);
      $el.closest('.wrapper')
        .toggleClass('expanded')
        .toggleClass('collapsed');
    };

    this.onValueChange = (ev) => {
      
      const target = ev.target;
      const type = target.type;

      if (type === 'checkbox') {
        const key = target.value;
        const value = target.checked;
        NetworkTables.putValue(key, value);
      }
      else if (type === 'text') {
        const key = target.id;
        const value = target.value;
        NetworkTables.putValue(key, value);
      }
      else if (type === 'number') {
        const key = target.id;
        const value = target.value;
        NetworkTables.putValue(key, parseFloat(value));
      }
    };

  </script>

</subtable>