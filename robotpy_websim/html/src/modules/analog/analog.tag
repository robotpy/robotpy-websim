import * as _ from 'lodash';
import * as actions from 'assets/js/actions/main.js';

<analog>
  <div class="wrapper">
    <p class="analog-slider" if="{analog.initialized}" each="{analog in opts.analogs}">
      <slider label={analog.label} min="-1" max="1" val="{analog.value}" disabled={analog.type === 'output'} onchange={analog.onChange} />
    </p>
  </div>

    <style>
      .analog-slider {
        width: 200px;
        margin-bottom: 10px;
      }

      analog > .wrapper {
        padding: 10px;
      }
      
    </style>

    <script>

      let tag = this;
      let analogs = [];

      const initialize = _.once(() => {
        analogs = _.range(8)
          .map(index => {
            return {
              index,
              initialized: false,
              value: 0,
              label: '',
              onChange: (value) => {}
            };
          });
      });
    
      const mapStateToOpts = (state) => {

        initialize();

        const dataOut = state.halData.out;
        const dataIn = state.halData.in;
        
        for (let i = 0; i < analogs.length; i++) {
          if (dataOut.analog_in[i].initialized) {
            const initValue = dataIn.analog_in[i].value || 0;
            analogs[i].initialized = true;
            analogs[i].value = Math.round(initValue * 100) / 100;
            analogs[i].label = `${analogs[i].index} (input)`;
            analogs[i].onChange = value => {
              analogs[i].value = Math.round(value * 100) / 100;
              tag.update();

              // update HAL data sent to server
              tag.updateHalDataIn(`analog_in[${i}].value`, value);
            };

          }
          else if (dataOut.analog_out[i].initialized) {
            analogs[i].initialized = true;
            analogs[i].value = dataOut.analog_out[i].value;
            analogs[i].label = `${analogs[i].index} (output)`;
          }
        }

        return {
          analogs
        };
      };

      const mapDispatchToMethods = {
        updateHalDataIn: actions.updateHalDataIn
      };

      this.reduxConnect(mapStateToOpts, mapDispatchToMethods);
  </script>
</analog>