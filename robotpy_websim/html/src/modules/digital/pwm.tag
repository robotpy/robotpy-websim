
import * as _ from 'lodash';
import * as actions from 'assets/js/actions/main.js';

<pwm>
  <h6 class="text-center">PWM</h6>
  <virtual if={pwm.initialized} each={pwm in opts.pwms}>
    <slider 
      label={pwm.index} 
      min="-1" max="1" 
      val={pwm.value}
      disabled={true} />
  </virtual>

  <style>
    pwm {
      width: 200px;
    }
  </style>



  <script>  
    let tag = this;
    let pwms = [];

    const initialize = _.once((halPwms) => {
      pwms = halPwms.map((halPwm, index) => {
        return {
          index,
          initialized: halPwm.initialized,
          value: halPwm.value
        };
      });
    });
  
    const mapStateToOpts = (state) => {

      const dataOut = state.halData.out;

      initialize(dataOut.pwm);

      dataOut.pwm.forEach((halPwm, index)=> {
        pwms[index].initialized = halPwm.initialized;
        pwms[index].value = halPwm.value;
      });

      return {
        pwms
      };
    };

    const mapDispatchToMethods = {
      updateHalDataIn: actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);


  </script>

</pwm>