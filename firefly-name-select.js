import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";

import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu.js";
import "@vaadin/vaadin-item/vaadin-item.js";
import "@vaadin/vaadin-list-box/vaadin-list-box.js";

import "@aspen-elements/aspen-button";
import { AspenSecurableMixin } from "@aspen-elements/aspen-securable-mixin";

import "@aspen-elements/aspen-list-icons";
import { FireflyListMixin } from "@firefly-elements/firefly-list-mixin";
import "@firefly-elements/polymerfire/firestore-query";

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
class FireflyNameSelect extends FireflyListMixin(
  AspenSecurableMixin(PolymerElement)
) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .component {
          @apply --layout-horizontal;
        }
        aspen-button {
          margin-top: 35px;
          margin-left: 4px;
          height: 24px;
        }
      </style>
      <fs-query
        app-name="[[appName]]"
        path="[[path]]"
        data="{{model}}"
        order-by="[[orderBy]]"
      ></fs-query>

      <div class="component">
        <vaadin-dropdown-menu
          label="[[label]]"
          placeholder="[[placeholder]]"
          value="{{ selected }}"
          on-value-changed="__valueChanged"
        >
          <template>
            <vaadin-list-box>
              <template is="dom-repeat" items="[[model]]">
                <vaadin-item id="[[item.$key]]" value="[[item]]"
                  >[[item.name]]</vaadin-item
                >
              </template>
            </vaadin-list-box>
          </template>
        </vaadin-dropdown-menu>

        <template is="dom-if" if="{{ editable }}">
          <asp-button
            icon="list:add-circle"
            on-tap="(_openAddDialog)"
          ></asp-button>
        </template>
      </div>

      <slot select=".detail-dialog"></slot>
    `;
  }

  /**
   * String providing the tag name to register the element under.
   */
  static get is() {
    return "firefly-name-select";
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

    afterNextRender(this, function() {});
  }

  /**
   * This method is responsible for notifying listeners whenever the selected value changes.
   * When it changes it finds the object associated with the selected id, and then sends
   * that object to any listener.
   * @param {Event} e the event object
   */

  __valueChanged(e) {
    let modelMap = new Map();
    for (let item of this.model) {
      modelMap.set(item.$key, item);
    }

    let selectedValue = e.detail.value;
    let selectedItem = modelMap.get(selectedValue.$key);

    this.set("selectedItem", selectedItem);

    this.dispatchEvent(
      new CustomEvent("fire-list-item-changed", {
        bubbles: true,
        composed: true,
        detail: {
          value: selectedItem
        }
      })
    );
  }
}

window.customElements.define(FireflyNameSelect.is, FireflyNameSelect);
