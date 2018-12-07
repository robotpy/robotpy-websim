import axios from 'axios';

<user-modules>

  <script>
    async function getModules() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/modules";
        const response = await axios.get(url);
        return response.data.modules;
      }
      catch(e) {
        console.log('error', e);
        return [];
      }
    }

    function includeScript(path) {
      const script = document.createElement('script');
      script.src = path;
      document.getElementsByTagName('body')[0].appendChild(script);
    }

    getModules()
      .then(function(modules) {
        modules.forEach(function(module) {
          let l = window.location;
          let port = process.env.socket_port || l.port;
          let path = `/user/modules/${module}/index.js`;
          let url = "http://" + l.hostname + ":" + port + path;
          includeScript(url);
        });
      });
  </script>

</user-modules>