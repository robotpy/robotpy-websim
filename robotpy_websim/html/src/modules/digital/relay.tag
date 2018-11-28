<relay>
  <h6 class="text-center">Relay</h6>
  <div class="relays">
    <div class="relay" if={relay.initialized} each={relay in opts.relays}>
      <p class="channel">{relay.channel}</p>
      <toggle-button disabled={!relay.fwd && !relay.rev} toggled={relay.fwd} />
    </div>
  </div>

  <script>
    let relays = [];

    const initialize = _.once((halRelays) => {
      relays = halRelays.map((halRelay, channel) => {
        return {
          channel,
          initialized: halRelay.initialized,
          rev: halRelay.rev,
          fwd: halRelay.fwd
        };
      });
    });

    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;

      initialize(dataOut.relay);

      dataOut.relay.forEach((halRelay, index) => {
        relays[index].initialized = halRelay.initialized;
        relays[index].fwd = halRelay.fwd;
        relays[index].rev = halRelay.rev;
      });

      this.update();

      return {
        relays
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);

  </script>

</relay>