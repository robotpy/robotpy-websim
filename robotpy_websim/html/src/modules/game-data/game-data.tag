import './game-data.css';

<game-data>
  <form class="game-data-form">
    <div class="form-group">
      <select ref="select" class="form-control">
        <option>RRR</option>
        <option>RLR</option>
        <option>LRL</option>
        <option>LLL</option>
      </select>
    </div>
  </form>


  <script>

    this.on('mount', () => {

      const $select = $(this.refs.select);

      $select.select2({
        tags: true,
        theme: 'bootstrap4',
        width: '100%',
        placeholder: 'Game Data',
        allowClear: Boolean($(this).data('allow-clear'))
      });

      $select.on('change', (ev) => {
        const value = ev.target.value;
        this.updateMessage(value);
      });


    });

    const mapStateToOpts = (state) => {
      const message = state.gameSpecificMessage;
      return {
        message
      };
    };

    const mapDispatchToMethods = {
      updateMessage: sim.actions.updateGameSpecificMessage
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);
  </script>

</game-data>