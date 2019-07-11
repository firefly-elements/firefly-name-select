import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { matchesSelector } from '@polymer/polymer/lib/legacy/polymer.dom.js';

/**
 * This mixin provides all properties and methods for fire-lists.
 * @polymerMixin
 * @mixinFunction
 */
export const FireflyListMixin = (superclass) => class extends superclass {
        /**
         * Object describing property-related metadata used by Polymer features
         */
         static get properties() {
            return {

                /** The text of the label. */
                label:{
                    type: String,
                    value: ''
                },

                /** The name of the firebase application. */
                appName:{
                    type: String, 
                    value: '',
                    notify: true
                },

                /** The path to the list of nodes. */
                path:{
                    type: String,
                    value: '',
                    notify: true
                },

                /** A flag that indicate whether the list should be editable. */
                editable: {
                    type: Boolean,
                    value: false
                },

                /** A flag that indicates if the component should be disabled. */
                disabled:{
                    type: Boolean,
                    value: false
                },

                /** The selected value. This is the $key value of the firebase object. */
                selected:{
                    type: Object,
                    notify: true
                },

                /** The selected object */
                selectedItem:{
                    type: Object,
                    notify: true
                },

                /** A flag that indicates that the field is required. */
                required:{
                    type: Boolean,
                    value: false
                },

                /** A string containing the placeholder/prompt text for the field. */
                placeholder:{
                    type: String,
                    value: ''
                },

                /** Indicates the name of the firebase node attribute that you should use to sort the list. */
                orderByChild:{
                    type: String,
                    value: 'name',
                    notify: true
                },

                /** An array of records returned by the query. */
                model:{
                    type: Array,
                    value: [],
                    notify: true
                },

                /** The equalTo filter value. */
                equalTo:{
                    type: Object,
                    value: null,
                    notify: true
                }
                
            };
        }

        /**
         * This method opens the dialog responsible for adding a list item.
         * @param {Event} e the event object
         */ 
         _openAddDialog(e){
            let nodes = FlattenedNodesObserver.getFlattenedNodes(this);
            let assignedNodes = nodes.filter( n => n.nodeType === Node.ELEMENT_NODE && matchesSelector(n, '.detail-dialog'));
            let dialog = assignedNodes[0];
            console.log(dialog);
            dialog.newOpen();
        }

        /**
         * This method adds a value to the list.
         * @param {Event} e the event object
         */ 
        _handleCardAdded(e){
            e.stopPropagation();
            let query = this.shadowRoot.querySelector("firebase-query");
            let msg = "";
            try {
                query.ref.push(e.detail.model);
                msg = "List item added"
            } catch (error) {
                msg = "An error occurred while adding the list item"
                console.log(error);
            }

            this.dispatchEvent(new CustomEvent('show-msg', {
                bubbles: true,
                composed: true,
                detail: {
                    msg: msg
                }
            }));
        }

        connectedCallback(){
            super.connectedCallback();
            this.addEventListener("card-added", e => this._handleCardAdded(e));
        }

        disconnectedCallback(){
            super.disconnectedCallback();
            this.removeEventListener("card-added", e=> this._handleCardAdded(e));
        }

}
