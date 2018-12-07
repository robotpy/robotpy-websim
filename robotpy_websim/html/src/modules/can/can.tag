import * as _ from 'lodash';
import axios from 'axios';
import './ctre-device.tag';
import './can.css';

<can>
  <div class="can-device" each={can in opts.canDevices}>
    <h5 class="device-number">{can.deviceNumber}</h5>
    <virtual if={can.type === 'talonsrx' || can.type === 'victorspx'}>
      <ctre-device can-mode-map={canModeMap} device-number={can.deviceNumber} />
    </virtual>

  </div>

  <script>

    this.canModeMap = {};
    let canDevices = [];

    async function fetchCanModeMap() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/can_mode_map";
        const response = await axios.get(url);
        return response.data;
      }
      catch(e) {
        console.log('error', e);
        return [];
      }
    }
    
    fetchCanModeMap()
      .then(map => {
        this.canModeMap = map;
        this.update();
      });

    const initialize = _.once((halCanDevices) => {
      canDevices = _.map(halCanDevices, (halCan, deviceNumber) => {
        return {
          deviceNumber,
          type: halCan.type
        };
      });
    });
    
    const mapStateToOpts = (state) => {

      const halCanDevices = state.halData.out.CAN;
      initialize(halCanDevices);

      return {
        canDevices
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>

</can>