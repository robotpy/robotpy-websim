
import "./golden-layout.tag";
import "./module-menu.tag";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-modules.tag';
import axios from 'axios';

<app>
  <module-menu />
  <button type="button" class="btn btn-sm btn-secondary" aria-label="Save Layout" onclick={onClick}>
    Save Layout
  </button>

  <golden-layout />
  <user-modules />

  <script>
    this.onClick = (ev) => {
      saveLayout();
    };

    async function saveLayout() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/save_layout";
        const response = await axios.post(url, {
          layout: localStorage.getItem('layout')
        });
        return response.data.modules;
      }
      catch(e) {
        console.error('error', e);
        return [];
      }
    }
  </script>
</app>
