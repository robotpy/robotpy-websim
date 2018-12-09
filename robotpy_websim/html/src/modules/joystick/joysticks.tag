import './joystick.tag';
import './joystick.css';
import * as _ from 'lodash';

<joysticks>
  <div class="joystick" each={joystick in opts.joysticks}>
    <virtual if={joystick.visible}>
      <joystick 
        index={joystick.index}
        gamepad={joystick.gamepad}
        axes={joystick.axes}
        povs={joystick.povs}
        buttons={joystick.buttons} 
        onupdate={joystick.onUpdate} />
    </virtual>
  </div>

  <script>

    const axisLabels = ['X', 'Y', 'Z', 'T'];
    let joysticks = [];

    this.getAxisLabel = (index) => {
      if (axisLabels.length > index) {
        return axisLabels[index];
      }

      return index;
    };

    const initialize = _.once((sticks, gamepads) => {
  
      joysticks = sticks.map((stick, stickIndex) => {
        return {
          index: stickIndex,
          gamepad: gamepads[stickIndex] || { connected: false },
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

      const gamepads = state.gamepads;

      initialize(dataOut.joysticks, gamepads);
      
      for (let i = 0; i < joysticks.length; i++) {
        joysticks[i].gamepad = gamepads[i] || { connected: false };

        // Set visibility of joysticks
      }

      this.update();

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