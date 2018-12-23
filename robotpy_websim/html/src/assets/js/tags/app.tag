
import "./golden-layout.tag";
import "./module-menu.tag";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-modules.tag';

<app>
  <module-menu />
  <button type="button" class="btn btn-sm btn-secondary" aria-label="Left Align">
    Config
  </button>

  <golden-layout />
  <user-modules />
</app>
