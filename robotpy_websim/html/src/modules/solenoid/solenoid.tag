import './solenoid.css';

<solenoid>
  <div class="solenoid" each={solenoid in opts.solenoids}>
    <p class="channel">{solenoid.channel}</p>
    <toggle-button disabled={!solenoid.initialized} toggled={solenoid.value} />
  </div>

  <script>
    let solenoids = [];

    const initialize = _.once((dataOut) => {
      solenoids = dataOut.solenoid.map((solenoid, channel) => {
        return {
          channel,
          initialized: solenoid.initialized,
          value: solenoid.value
        };
      });
    });

    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;

      initialize(dataOut);

      solenoids.forEach((solenoid, channel) => {
        solenoid.value = dataOut.solenoid[channel].value;
      });

      this.update();

      return {
        solenoids
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);

  </script>

</solenoid>