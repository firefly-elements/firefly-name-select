import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';

import '@aspen-elements/aspen-button';
import {AspenSecurableMixin} from '@aspen-elements/aspen-securable-mixin';

import '@aspen-elements/aspen-list-icons';
import {FireflyListMixin} from '@firefly-elements/firefly-list-mixin';

import '@firefly-elements/polymerfire/firebase-query.js';


/**
 * `firefly-name-select` This component is designed to display a list of values where the list itself is editable,
 * and has a firebase backing list. For example, this can be used to display a list of therapeutic areas, and
 * let the user add new therapeutic areas without having to switch pages.
 * 
 * <code>
 * 	<firefly-name-select label="Project Stage:" selected="{{model.stage}}" path="/stages" app-name="pharm2market" order-by-child="ord" has-role="[[hasRole]]"></firefly-name-select>
 * </code>
 *
 * @summary ShortDescription.
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */
class FireflyNameSelect extends FireflyListMixin(AspenSecurableMixin(PolymerElement)) {
  static get template() {
    return html`
        <style>
            :host {
                display: block
            }
            .component{
                @apply --layout-horizontal;
            }
            aspen-button{
               margin-top: 35px;
               margin-left: 4px;
                height: 24px;
            }
        </style>
        <firebase-query app-name="[[appName]]" path="[[path]]" data="{{model}}" order-by-child="[[orderByChild]]" equal-to="[[equalTo]]"></firebase-query>

        <div class="component">

            <vaadin-dropdown-menu label="[[label]]" placeholder="[[placeholder]]" value="{{selected}}" readonly="[[!hasRole]]">
                <template>
                    <vaadin-list-box>
                        <template is="dom-if" if="[[defaultValue]]">
                            <vaadin-item id="[[defaultValue]]">[[defaultValue]]</vaadin-item>
                        </template>
                        
                        <template is="dom-repeat" items="[[model]]">
                            <vaadin-item id="[[item.name]]">[[item.name]]</vaadin-item>
                        </template>
                    </vaadin-list-box>
                </template>
            </vaadin-dropdown-menu>
        
            <template is="dom-if" if="[[hasRole]]">
                <aspen-button icon="list:add-circle" on-tap="_openAddDialog"></aspen-button>
            </template>
           
            
        </div>

        <slot select=".detail-dialog"></slot>
`;
  }

  /**
   * String providing the tag name to register the element under.
   */
  static get is() {
      return 'firefly-name-select';
  }

  static get properties(){
      return {

          /** The default value for the list. */
          defaultValue: {
              type: String,
              value: null
          }
      }
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
      super();
  }

  /**
   * Use for one-time configuration of your component after local DOM is initialized. 
   */
  ready() {

      super.ready();
      if(this.defaultValue !== null){
          this.selected = this.defaultValue;
      }

      afterNextRender(this, function() {
          
      });
  }
}

window.customElements.define(FireflyNameSelect.is, FireflyNameSelect);
