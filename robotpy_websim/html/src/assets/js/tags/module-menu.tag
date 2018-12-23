import * as _ from 'lodash';
import uuidv1 from "uuid";
import * as actions from 'assets/js/actions';

<module-menu>
  <div class="dropdown">
    <button 
      class="btn btn-sm btn-secondary dropdown-toggle"
      type="button" id="dropdownMenuButton" aria-haspopup="true" 
      aria-expanded="false" onclick={onToggleOpen}>
        Modules
    </button>
    <div ref="dropdown" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <div id="accordion-{_.kebabCase(category.label)}" each="{category in opts.categories}">
        <a class="dropdown-item" data-toggle="collapse" data-target="#{_.kebabCase(category.label)}" aria-expanded="false" aria-controls="{category.label}">
          {category.label}
          <span class="oi oi-caret-right"></span>
          <span class="oi oi-caret-bottom"></span>
        </a>

        <div id="{_.kebabCase(category.label)}" class="collapse" aria-labelledby="{category.label}" data-parent="#accordion-{_.kebabCase(category.label)}">
          <virtual if="{opts.added.indexOf(tag.tagName) < 0}" each="{tag in category.tags}">
            <a class="dropdown-item" href="#" data-tag="{tag.tagName}">
              {tag.label}
            </a>
          </virtual>
        </div>
      </div>
    </div>
  </div>


  <style>
    module-menu > .dropdown {
      padding: 5px 0 10px 5px;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      top: 40px;
      left: 5px;
    }

    .dropdown-item[data-tag] {
      padding-left: 1.5rem;
    }

    .dropdown-item {
      padding: .25rem 1.5rem .25rem 1rem;
    }

    .dropdown-item:active {
      background-color: #f8f9fa;
      color: black;
    }

    .dropdown-item[aria-expanded="true"] {
      background-color: #eee;
    }

    .dropdown-item[aria-expanded] {
      position: relative;
      cursor: pointer;
    }
    
    .dropdown-item[aria-expanded] .oi {
      display: none;
      font-size: 10px;
      position: absolute;
      top: calc(50% - 3px);
      right: 10px;
    }

    .dropdown-item[aria-expanded="false"] .oi-caret-right {
      display: inline-block;
    }

    .dropdown-item[aria-expanded="true"] .oi-caret-bottom {
      display: inline-block;
      right: 8px;
    }
  </style>

  <script>

    let tagNames = [];
    let categoryNames = [];
    let categories = [];


    this.getUnaddedCategories = (allCategories) => {
      return _.difference(allCategories, categoryNames);
    };

    this.getUnaddedTags = (allTags) => {
      return _.difference(allTags, tagNames);
    };

    this.addCategory = (categoryName) => {
      categories.push({
        label: categoryName,
        tags: []
      })
      categories.sort(this.sortByLabel);
    };

    this.addTag = (tag) => {

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].label !== tag.category) {
          continue;
        }

        categories[i].tags.push(tag);
        categories[i].tags.sort(this.sortByLabel);
      }
    };

    this.sortByLabel = (config1, config2) => {
      let label1 = config1.label.toLowerCase();
      let label2 = config2.label.toLowerCase();
      if (label1 < label2) {
        return -1;
      }
      else if (label1 > label2) {
        return 1;
      }
      else {
        return 0;
      }
    };

    this.onToggleOpen = (ev) => {
      $(this.refs.dropdown).toggleClass('show');
    };

    this.on('mount', () => {
      $(window).on('click', (ev) => {
        if ($(ev.target).closest('module-menu').length === 0) {
          $(this.refs.dropdown).removeClass('show');
        }
      });
    });

    this.mapStateToOpts = (state) => {

      let unaddedCategories = this.getUnaddedCategories(state.layout.categories);
      categoryNames = categoryNames.concat(unaddedCategories);

      unaddedCategories.forEach(unaddedCategory => {
        this.addCategory(unaddedCategory);
      });

      let unaddedTags = this.getUnaddedTags(Object.keys(state.layout.registered));
      tagNames = tagNames.concat(unaddedTags);

      unaddedTags.forEach(unaddedTag => {
        let tag = state.layout.registered[unaddedTag];
        this.addTag({
          ...tag,
          tagName: unaddedTag
        });
      });

      if (unaddedTags.length > 0 || !_.isEqual(this.opts.added, state.layout.added)) {

        this.update();

        setTimeout(() => {
          let query = this.refs.dropdown.querySelectorAll('[data-tag]');
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
        categories: categories,
        added: state.layout.added
      };
    }

    this.mapDispatchToMethods = {
      moduleMenuUpdated: actions.moduleMenuUpdated
    };
    

    this.reduxConnect(this.mapStateToOpts, this.mapDispatchToMethods);

  </script>
</module-menu>