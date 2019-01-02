import * as _ from 'lodash';
import ObservableSlim from 'observable-slim';

<gyro>
  <div class="gyro" if="{gyro.initialized}" each="{gyro, i in opts.gyros.analog}">
    <label><b>Analog Gyro {i}:</b> {gyro.angle}&#176;</label>
  </div>
  <div class="gyro" each="{angle, label in opts.gyros.other}">
    <label><b>{label}:</b> {angle}&#176;</label>
  </div>


  <style>
    .gyro {
      text-align: center;
    }

    gyro {
      padding: 10px 10px;
      display: block;
    }
  </style>

  <script>

    let gyroInit = {
      analog: [],
      other: {}
    };

    let throttledUpdate = _.throttle(this.update, 100);

    let gyros = ObservableSlim.create(gyroInit, false, (changes) => {
      throttledUpdate();
    });

    let initialize = _.once((data) => {
      gyros.analog = data.analog_gyro.map((gyro) => {
        return {
          initialized: gyro.initialized,
          angle: gyro.angle.toFixed(2)
        }
      });
    });

    const mapStateToOpts = (state) => {
      let data = state.halData.out;

      initialize(data);

      data.analog_gyro.forEach((gyro, i) => {
        gyros.analog[i].initialized = gyro.initialized;
        gyros.analog[i].angle = gyro.angle.toFixed(2);
      });

      _.forEach(data.robot, (value, key) => {
        if (!key.endsWith('_angle')) {
          return;
        }
        gyros.other[key] = value.toFixed(2);
      });

      return {
        gyros
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>


</gyro>