<relay>
  <h6 class="text-center">Relay</h6>
  <div class="relays">
    <div class="relay" if={relay.initialized} each={relay in opts.relays}>
      <p class="channel">{relay.channel}</p>
      <toggle-button disabled={!relay.fwd && !relay.rev} toggled={relay.fwd} />
    </div>
  </div>

  <style>

    relay {
      width: 150px;
    }

    .relays {
      display: flex;
      justify-content: center;
    }

    .relay {
      display: flex;
      padding: 0 6px;
      height: 32px;
      font-variant-numeric: tabular-nums;
    }

    .relay .channel {
      margin-right: 6px;
    }

    .relay toggle-button {
      padding-top: 3px;
    }

  </style>


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