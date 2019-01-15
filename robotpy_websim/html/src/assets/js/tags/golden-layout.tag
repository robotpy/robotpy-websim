import GoldenLayout from 'golden-layout';
import '../../scss/goldenlayout-base.css';
import '../../scss/goldenlayout-light-theme.css';
import * as _ from 'lodash';
import uuidv1 from "uuid";
import * as actions from 'assets/js/actions';
import "./module-menu.tag";
import * as drag from './drag.js';
import './components';
import defaultLayout from './golden-layout-default';

<golden-layout>

  <div class="golden-layout"></div>

  <script>
    let tag = this;
    let initialized = false;
    let myLayout = null;
    this.onMenuUpdate = this.opts.onmenuupdate;

    let initialize = _.once((userConfig) => {

      try {
        let config = JSON.parse(userConfig.layout) || defaultLayout;
        myLayout = new GoldenLayout( config, '.golden-layout' );
      }
      catch(e) {
        // if parsing the JSON or setting up saved layout fails set up
        // an empty layout
        console.error(e.msg);
        myLayout = new GoldenLayout(defaultLayout, '.golden-layout' );
      }

      myLayout.on('itemCreated', (item) => {
        let tagName = item.componentName;

        if (tagName) {
          tag.addedToLayout(tagName);
        }
      });

      myLayout.on('itemDestroyed', (item) => {
        if (!item.isComponent) {
          let components = getComponents(item);
          components.forEach((component) => {
            this.removeFromLayout(component.componentName);
          });
        } 
        else {
          this.removeFromLayout(item.componentName);
        }
      });

      myLayout.on('stateChanged', function() {
        var state = JSON.stringify( myLayout.toConfig() );
        localStorage.setItem('layout', state );
      });

      initialized = true;
    });

    const initializeMyLayout = _.once(() => {
      myLayout.init();
    });


    function getComponents(item) {
      if (!item) {
        return [];
      }
      else if (item.isComponent) {
        return [item];
      }
      return _.flatMap(item.contentItems, getComponents);
    }

    function hasComponent(myLayout, tag) {
      let tagsInInterface = getComponents(myLayout.root).map((component) => {
        return component.componentName;
      });
      return tagsInInterface.indexOf(tag) >= 0;
    }

    function getRegisteredComponentNames(layoutManager) {
      return Object.keys(layoutManager._components);
    }

    this.mapStateToOpts = (state) => {

      const emptyLayout = {
        layout: {
          registered: []
        }
      };
      
      if (!state.halData.initialized) {
        return emptyLayout;
      }

      $(() => {
        initialize(state.userConfig);
      });

      if (!initialized) {
        return emptyLayout;
      }

      setTimeout(() => {

        state.layout.menuItems.forEach((item) => {

          let moduleConfig = state.layout.registered[item.tagName];
          
          drag.fixBrokenDragSource(myLayout, item.tagName, item.element, dragStopCallback);

          // Don't add tag if one has already been added
          if (drag.hasDragSourceTag(myLayout, item.tagName) || hasComponent(myLayout, item.tagName)) {
            return;
          }

          drag.createDragSource(myLayout, item.element, {
            componentName: item.tagName,
            title: moduleConfig.label,
            width: moduleConfig.width,
            height: moduleConfig.height
          });

          drag.onDragStop(myLayout, item.tagName, dragStopCallback);
        });
      }, 1);

      return {
        layout: { ...state.layout }
      };
    }

    function dragStopCallback() {
      let tagName = this._itemConfig.componentName;
      setTimeout(() => {
        let doesHaveComponent = hasComponent(this._layoutManager, tagName);
        if (doesHaveComponent) {
          drag.removeDragSource(this._layoutManager, tagName);
          tag.addedToLayout(tagName);
        }
        else {    
          drag.onDragStop(this._layoutManager, tagName, dragStopCallback);
        }
      }, 1);
    }

    this.mapDispatchToMethods = {
      removeFromLayout: actions.removeFromLayout,
      addedToLayout: actions.addedToLayout
    };


    this.on('mount', () => {
      window.addEventListener("resize", () => {
        if (myLayout) {
          myLayout.updateSize();
        }
      });
    });

    this.on('update', () => {

      if (!initialized) {
        return;
      }

      _.forEach(this.opts.layout.registered, (config, tagName) => {
        
        // Used to initialize the tag
        let registeredComponents = getRegisteredComponentNames(myLayout);
        if (registeredComponents.indexOf(tagName) < 0) {
          myLayout.registerComponent(tagName, function(container, state) {
            let $el = container.getElement();
            $el.html( `<${tagName} id="${state.id}"></${tagName}>`);
            riot.mount($el.find(`#${state.id}`)[0], tagName);
          });
        }     
      });

      initializeMyLayout();
    });
    
    this.reduxConnect(this.mapStateToOpts, this.mapDispatchToMethods);

  </script>

</golden-layout>