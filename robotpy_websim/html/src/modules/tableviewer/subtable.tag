import * as _ from 'lodash';


<subtable>
  <div class="wrapper {expanded ? 'expanded' : 'collapsed'}">
    <div class="table-row subtable-header">
      <span class="row-item key">
        <span class="level-space" each={value in _.range(level)}></span>
          <span class="caret" onclick={toggleExpand}></span>
          {opts.key}
        </span>
      <span class="row-item type"></span>
      <span class="row-item value"></span>
    </div>
    <virtual each={value, key in opts.values}>
      <virtual if={typeof value === 'object'}>
        <subtable level={level + 1} key={key} values={value} />
      </virtual>

      <virtual if={typeof value !== 'object'}>
        <div class="table-row">
          <span class="row-item key">
          <span class="level-space" each={value in _.range(level + 1)}></span>
            {key.replace('/', '')}
          </span>
          <span class="row-item type">{typeof value}</span>
          <span class="row-item value">{value}</span>
        </div>
      </virtual>
    </virtual>
  </div>

  <style>
    .collapsed > .table-row:not(.subtable-header),
    .collapsed > subtable {
      display: none;
    }

    .wrapper > .subtable-header .caret:after {
      font-size: 30px;
      line-height: 7px;
    }

    .wrapper.expanded > .subtable-header .caret:after {
      content: "▾";
    }

    .wrapper.collapsed > .subtable-header .caret:after {
      content: "▸";
    }
  </style>
  
  <script>
    this.level = this.opts.level || 0;
    this.expanded = false;

    this.toggleExpand = (ev) => {
      //console.log('dsffdfd', ev);
      let $el = $(ev.target);
      $el.closest('.wrapper')
        .toggleClass('expanded')
        .toggleClass('collapsed');
    };

  </script>

</subtable>