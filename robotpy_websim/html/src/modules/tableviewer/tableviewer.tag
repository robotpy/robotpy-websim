import './subtable.tag';

<tableviewer>
  <div class="table">
    <div class="table-row header">
      <span class="row-item key">Key</span>
      <span class="row-item type">Type</span>
      <span class="row-item value">Value</span>
    </div>
    <subtable nt-key="/" key-label="root" values={opts.values} />
  </table>


  <style>

    .table {
      min-width: 450px;
    }

    .table-row {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #bbb;
    }

    .table-row.header > .row-item {
      font-weight: bold;
    }

    .row-item.key {
      width: 45%;
    }

    .row-item.type, .row-item.value {
      width: 25%;
    }

    .row-item {
      white-space: nowrap;
      overflow-x: scroll;
      padding: 3px 0;
      display: inline-block;
    }

    .row-item::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      height: 0px;
      background: transparent;  /* optional: just make scrollbar invisible */
    }

    .level-space {
      display: inline-block;
      width: 15px;
      height: 1px;
    }

  </style>


  <script>
    const mapStateToOpts = (state) => {
      
      const values = state.networktables.values;

      return {
        values
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>


</tableviewer>