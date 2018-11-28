
<dio>
  <h6 class="text-center">Digital I/O</h6>
  <div class="dios">
    <div class="dio" if={dio.initialized} each={dio in opts.dios}>
      <virtual if={dio.isInput}>
        <p class="label">{dio.channel} (input)</p>
        <toggle-button />
      </virtual>
      <virtual if={!dio.isInput}>
      <p class="label">{dio.channel} (output)</p>
        <toggle-button toggled={dio.value} />
      </virtual>
    </div>
  </div>

  <script>
    let dios = [];

    const initialize = _.once((halDios) => {
      dios = halDios.map((halDio, channel) => {
        return {
          channel,
          initialized: halDio.initialized,
          value: halDio.value,
          isInput: halDio.is_input
        };
      });
    });

    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;

      initialize(dataOut.dio);

      dataOut.dio.forEach((halDio, index) => {
        dios[index].initialized = halDio.initialized;
        dios[index].isInput = halDio.is_input;
        dios[index].value = halDio.value;
      });

      this.update();

      return {
        dios
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);

  </script>

</dio>