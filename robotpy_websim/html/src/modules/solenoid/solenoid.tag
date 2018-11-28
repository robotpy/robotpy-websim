<solenoid>
  <div class="wrapper">
    <div class="solenoid" each={solenoid in opts.solenoids}>
      <p class="channel">{solenoid.channel}</p>
      <toggle-button disabled={!solenoid.initialized} toggled={solenoid.value} />
    </div>
  </div>

  <style>

    solenoid > .wrapper {
      display: flex;
      flex-wrap: wrap;
      max-width: 210px;
      padding: 10px;
    }

    .solenoid {
      display: flex;
      padding: 0 6px;
      height: 32px;
      font-variant-numeric: tabular-nums;
    }

    .solenoid .channel {
      margin-right: 6px;
    }

    .solenoid toggle-button {
      padding-top: 3px;
    }

  </style>

  <script>
    let tag = this;
    let solenoids = null;

    const initialize = _.once(() => {
      solenoids = _.range(8)
        .map(channel => {
          return {
            channel,
            initialized: false,
            value: false
          };
        });
    });

    const mapStateToOpts = (state) => {

      initialize();

      const dataOut = state.halData.out;
      const dataIn = state.halData.in;
      
      for (let i = 0; i < solenoids.length; i++) {
        solenoids[i].initialized = dataOut.solenoid[i].initialized;
        solenoids[i].value = dataOut.solenoid[i].value;
      }

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