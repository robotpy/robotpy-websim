import * as _ from 'lodash';
import * as actions from 'assets/js/actions/main.js';

<analog>
  <div class="wrapper">
    <p class="analog-slider" if="{analog.initialized}" each="{analog in opts.analogs}">
      <virtual if={analog.type === 'output'}>
        <slider 
          label={analog.label} 
          min="-1" 
          max="1" 
          val={analog.value}
          disabled={true} />
      </virtual>
      <virtual if={analog.type === 'input'}>
        <slider 
          label={analog.label} 
          min="-1" 
          max="1" 
          initial-val={analog.value}
          onchange={analog.onChange} />
      </virtual>
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

      const initialize = _.once((dataOut, dataIn) => {
        analogs = _.range(8)
        .map(index => {
          const analogIn = {
            ...dataOut.analog_in[index],
            value: dataIn.analog_in[index].value
          };
          const analogOut = dataOut.analog_out[index];

          if (analogIn.initialized) {
            const initValue = analogIn.value || 0;
            return {
              initialized: true,
              value: Math.round(initValue * 100) / 100,
              type: 'input',
              label: `${index} (input)`,
              onChange: value => {
                // update HAL data sent to server
                tag.updateHalDataIn(`analog_in[${index}].value`, value);
              }
            };

          }
          else if (analogOut.initialized) {
            return {
              initialized: true,
              type: 'output',
              value: analogOut.value,
              label: `${index} (output)`
            };
          }
          else {
            return {
              initialized: false,
              type: null
            }
          }
        });
      });
    
      const mapStateToOpts = (state) => {

        const dataOut = state.halData.out;
        const dataIn = state.halData.in;

        initialize(dataOut, dataIn);
        
        analogs.forEach((analog, index) => {
          if (analog.type === 'output') {
            analog.value = dataOut.analog_out[index].value;
            this.update();
          }
        });

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