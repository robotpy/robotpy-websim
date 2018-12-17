import { Engine, Render, World, Bodies, Body } from 'matter-js';
import * as _ from 'lodash';
import Worker from './matter.worker.js';

<field>


  <div ref="field" class="field">
    <canvas ref="canvas"></canvas>
  </div>

  <style>
    canvas {
      width: 100%;
    }

  </style>

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
      worker.postMessage({ 
        type: 'data', 
        halData: state.halData,
        time: state.time
      });

      return {};
    };

    const mapDispatchToMethods = {
      
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);


  </script>

</field>