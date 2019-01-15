import './joystick.tag';
import './joystick.scss';
import * as _ from 'lodash';
import ObservableSlim from 'observable-slim';

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
  <context-menu 
    container={root} 
    should-show={shouldShowContextMenu} 
    joystick-index={opts.contextMenuJoystickIndex}
    gamepad-index={opts.gamepadIndex}
    gamepads={opts.gamepads}
    on-gamepad-select={onGamepadSelect}>

    <div class="Joystick-options">
      <h6 class="dropdown-header">Joystick {opts.joystickIndex}</h6>
      <form>
        <div class="form-group">
          <label for="gamepad-select">Paired gamepad:</label>
          <select class="form-control" id="gamepad-select" onchange={opts.onGamepadSelect} value={opts.gamepadIndex}>
            <option value="-1">None</option>
            <option value={index} if={gamepad && gamepad.connected} each={gamepad, index in opts.gamepads}>
              {gamepad.id}
            </option>
          </select>
        </div>
      </form>
    </div>
  </context-menu>

  <style>
    

  </style>

  <script>
    const axisLabels = ['X', 'Y', 'Z', 'T'];
    let joysticks = [];
    let contextMenuJoystickIndex = -1;


    this.shouldShowContextMenu = (ev) => {
      let $joystick = $(ev.target).closest('joystick');
        let clickedOnJoystick = $joystick.length > 0;
        let joystickIndex = $joystick.attr('index');

        if (clickedOnJoystick) {
          contextMenuJoystickIndex = joystickIndex;
          return true;
        } 
        else {
          contextMenuJoystickIndex = -1;
          return false;
        }
    };

    this.onGamepadSelect = (ev) => {
      let value = $(ev.target).val();
      joysticks[contextMenuJoystickIndex].gamepadIndex = value;
    };

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
          gamepadIndex: -1,
          gamepad: { connected: false },
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

    this.updateJoysticks = _.throttle((state) => {
      const dataOut = state.halData.out;
      const dataIn = state.halData.in;

      const gamepads = state.gamepads;

      initialize(dataOut.joysticks, gamepads);
      
      for (let i = 0; i < joysticks.length; i++) {
        const gamepad = gamepads[joysticks[i].gamepadIndex];
        if (!gamepad) {
          joysticks[i].gamepad = {
            connected: false
          };
        }
        else {
          joysticks[i].gamepad = {
            connected: gamepad.connected,
            buttons: gamepad.buttons.map(button => {
              return button.pressed;
            }),
            axes: [...gamepad.axes]
          };
        }
        // Set visibility of joysticks
      }

    }, 50);
    
    const mapStateToOpts = (state) => {

      this.updateJoysticks(state);

      if (contextMenuJoystickIndex < 0) {
        var gamepadIndex = -1;
      }
      else {
        var gamepadIndex = joysticks[contextMenuJoystickIndex].gamepadIndex;
      }
  
      return {
        joysticks,
        gamepads: state.gamepads,
        contextMenuJoystickIndex,
        gamepadIndex
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);



  </script>

</joysticks>