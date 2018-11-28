import * as _ from 'lodash';
import uuidv1 from "uuid";
import * as actions from 'assets/js/actions';

<module-menu>
  <div class="dropdown">
    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Modules
    </button>
    <div ref="dropdown" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item" href="#" data-tag="{removed}" each="{removed in opts.removed}">
        {removed}
      </a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item disabled" href="#" each="{added in opts.added}">
        {added}
      </a>
    </div>
  </div>


  <style>
    module-menu > .dropdown {
      padding: 5px 0 10px 5px;
      display: inline-block;
    }
  </style>

  <script>

    this.mapStateToOpts = (state) => {
      let removed = [];

      _.forEach(state.layout.registered, (tagName) => {
        if (state.layout.added.indexOf(tagName) < 0) {
          removed.push(tagName);
        }
      });

      if (!_.isEqual(this.opts.added, state.layout.added) || !_.isEqual(this.opts.removed, removed)) {
        setTimeout(() => {
          let query = this.refs.dropdown.querySelectorAll('.dropdown-item:not(.disabled)');
          let menuItems = [...query].map((item) => {
            return {
              element: item,
              tagName: item.getAttribute('data-tag'),
            }
          });
          this.moduleMenuUpdated(menuItems);
        }, 1);
      }

      return {
        added: state.layout.added,
        removed
      };
    }

    this.mapDispatchToMethods = {
      moduleMenuUpdated: actions.moduleMenuUpdated
    };
    

    this.reduxConnect(this.mapStateToOpts, this.mapDispatchToMethods);

  </script>
</module-menu>