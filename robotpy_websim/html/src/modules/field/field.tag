import { Engine, Render, World, Bodies, Body } from 'matter-js';
import * as _ from 'lodash';
import Worker from './matter.worker.js';

<field>


  <div ref="field" class="field">
    <canvas ref="canvas" width="200" height="200"></canvas>
  </div>

  <script>

    const worker = new Worker();

    this.on('mount', () => {
      
      const offscreen = this.refs.canvas.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);

      this.refs.canvas.style.background = '#0f0f13';
      this.refs.canvas.style.backgroundSize = "contain";
    });
  
    const mapStateToOpts = (state) => {

      // send hal data to physics web worker
      worker.postMessage({ type: 'halUpdate', halData: state.halData });

      return {};
    };

    const mapDispatchToMethods = {
      
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);


  </script>

</field>