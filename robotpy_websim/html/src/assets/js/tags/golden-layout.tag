import GoldenLayout from 'golden-layout';
import '../../scss/goldenlayout-base.css';
import '../../scss/goldenlayout-light-theme.css';
import * as _ from 'lodash';
import uuidv1 from "uuid";
import * as actions from 'assets/js/actions/main.js';
import "./module-menu.tag";
import * as drag from './drag.js';
import './components';

<golden-layout style="position: relative">

  <div class="golden-layout" style="height:100%;"></div>
  <test/>

  <script>
    let tag = this;

    this.onMenuUpdate = this.opts.onmenuupdate;

    var config = {
      content: []
    };

    var myLayout = new GoldenLayout( config, '.golden-layout' );

    myLayout.init();

    function getComponents(item) {
      if (item.isComponent) {
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


    console.log(myLayout);

    this.mapStateToOpts = (state) => {

      setTimeout(() => {

        state.layout.menuItems.forEach((item) => {
          
          drag.fixBrokenDragSource(myLayout, item.tagName, item.element, dragStopCallback);

          // Don't add tag if one has already been added
          if (drag.hasDragSourceTag(myLayout, item.tagName) || hasComponent(myLayout, item.tagName)) {
            return;
          }

          drag.createDragSource(myLayout, item.element, item.tagName);

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

    myLayout.on('itemDestroyed', (item) => {
      if (!item.isComponent) {
        return;
      }
      this.removeFromLayout(item.componentName)
    });


    this.on('update', () => {
      _.forEach(this.opts.layout.registered, (tagName) => {
        
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
    });
    
    this.reduxConnect(this.mapStateToOpts, this.mapDispatchToMethods);

  </script>

</golden-layout>