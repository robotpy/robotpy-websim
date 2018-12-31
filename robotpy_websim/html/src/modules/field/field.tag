import { Engine, Render, World, Bodies, Body } from 'matter-js';
import * as _ from 'lodash';
import Worker from './matter.worker.js';

<field>


  <div ref="field" class="field">
    <canvas ref="canvas"></canvas>
    <context-menu onclick={onContextMenuClick} container={root}>
      <a class="dropdown-item" href="#" data-action="reset">Reset</a>
    </context-menu>
  </div>

  <style>
    canvas {
      width: 100%;
    }

  </style>

  <script>

    let robots = [];
    let fields = [];

    const worker = new Worker();

    this.onContextMenuClick = (ev) => {
      const $el = $(ev.target);
      const action = $el.attr('data-action');
      if (action === 'reset') {
        worker.postMessage({ type: 'reset' });
      }
    };

    this.on('mount', () => {
      
      const offscreen = this.refs.canvas.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);

      worker.onmessage = (e) => {
        const type = e.data.type;
        if (type === 'halDataInUpdate') {
          this.updateHalDataIn(e.data.key, e.data.value);
        }
        else if (type === 'gyroUpdate') {
          sim.socket.updateGyros(e.data.da);
        }
        else if (type === 'addDeviceGyroChannel') {
          sim.socket.addDeviceGyroChannel(e.data.angleKey);
        }
      }

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
      updateHalDataIn: sim.actions.updateHalDataIn
    };

    this.reduxConnect(mapStateToOpts, mapDispatchToMethods);


  </script>

</field>