import * as _ from 'lodash';
import ObservableSlim from 'observable-slim';

<encoder>
  <div class="encoder" if="{encoder.initialized}" each="{encoder, i in opts.encoders}">
    <label>
      <b>Encoder ({encoder.aSourceChannel}, {encoder.bSourceChannel}):</b> 
      {encoder.count} / {(encoder.count * encoder.distancePerPulse).toFixed(3)} 
    </label>
  </div>


  <style>
    .encoder {
      text-align: center;
    }

    encoder {
      padding: 10px 10px;
      display: block;
    }
  </style>

  <script>

    let throttledUpdate = _.throttle(this.update, 100);

    let encoders = ObservableSlim.create([], false, (changes) => {
      throttledUpdate();
    });

    let initialize = _.once((data) => {
      data.encoder.forEach((encoder) => {
        encoders.push({
          initialized: encoder.initialized,
          aSourceChannel: encoder.config.ASource_Channel,
          bSourceChannel: encoder.config.BSource_Channel,
          count: encoder.count,
          distancePerPulse: encoder.distance_per_pulse
        });
      });
    });

    const mapStateToOpts = (state) => {
      let data = state.halData.out;

      initialize(data);

      data.encoder.forEach((encoder, i) => {
        encoders[i].initialized = encoder.initialized;
        encoders[i].count = encoder.count;
        encoders[i].distancePerPulse = encoder.distance_per_pulse;
      });

      return {
        encoders
      };
    };

    this.reduxConnect(mapStateToOpts, null);

  </script>


</encoder>
