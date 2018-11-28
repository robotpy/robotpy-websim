import './joystick.tag';
import * as _ from 'lodash';

<joysticks>
  <div class="wrapper">
    <div class="row">
      <div class="col-xs-4 joystick" each={joystick in opts.joysticks}>
        <virtual if={joystick.visible}>
          <joystick 
            index={joystick.index}
            axes={joystick.axes}
            povs={joystick.povs}
            buttons={joystick.buttons} 
            onupdate={joystick.onUpdate} />
        </virtual>
      </div>
    </div>
  </div>


  <style>

    joysticks {
      display: block;
      padding: 20px 15px 15px;
    }

    joysticks joystick:first-of-type {
      margin-left: 6px;
    }
    
  </style>

  <script>

    const axisLabels = ['X', 'Y', 'Z', 'T'];
    let joysticks = [];

    this.getAxisLabel = (index) => {
      if (axisLabels.length > index) {
        return axisLabels[index];
      }

      return index;
    };

    const initialize = _.once((sticks) => {
  
      joysticks = sticks.map((stick, stickIndex) => {
        return {
          index: stickIndex,
          visible: stickIndex <= 1,
          axes: stick.axes.map((value, index) => {
            return {
              index,
              label: this.getAxisLabel(index),
              visible: index <= 3,
              value
            }; 
          }),
          povs: stick.povs.map((value, index) => {
            return {
              index,
              label: 'POV',
              visible: index === 0,
              value
            };
          }),
          buttons: stick.buttons.map((value, index) => {
            return {
              index,
              visible: index <= 10 && value !== null,
              value: !!value
            };
          }),
          onUpdate: (type, index, value) => {
            if (type === 'axis') {
              this.updateHalDataIn(`joysticks[${stickIndex}].axes[${index}]`, value);
            }
            else if (type === 'button') {
              this.updateHalDataIn(`joysticks[${stickIndex}].buttons[${index}]`, value);
            }
            else if (type === 'pov') {
              this.updateHalDataIn(`joysticks[${stickIndex}].povs[${index}]`, value);
            }
          }
        };
      });
    });
    
    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;
      const dataIn = state.halData.in;

      initialize(dataOut.joysticks);
      
      for (let i = 0; i < joysticks.length; i++) {
        // Set visibility of joysticks
      }

      return {
        joysticks
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);



  </script>

</joysticks>