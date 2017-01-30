goog.provide('P.control.{{archetype.plugin.name}}Control');

/**
 * @classdesc
 * Main constructor of the class. Creates a {{archetype.plugin.name}}Control
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.{{archetype.plugin.name}}Control = (function() {
   // 1. checks if the implementation can create {{archetype.plugin.name}}Control
   if (M.utils.isUndefined(M.impl.control.{{archetype.plugin.name}}Control)) {
      M.exception('La implementación usada no puede crear controles {{archetype.plugin.name}}Control');
   }

   // 2. implementation of this control
   var impl = new M.impl.control.{{archetype.plugin.name}}Control();

   // 3. calls super constructor (scope, implementation, controlName)
   goog.base(this, impl, "{{archetype.plugin.name}}");
});
goog.inherits(M.control.{{archetype.plugin.name}}Control, M.Control);

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.{{archetype.plugin.name}}Control.prototype.createView = function(map) {
   return M.template.compile('../src/{{archetype.plugin.id}}/templates/{{archetype.plugin.id}}.html');
};

/**
 * @public
 * @function
 * @param {HTMLElement} html to add the plugin
 * @api stable
 * @export
 */
M.control.{{archetype.plugin.name}}Control.prototype.getActivationButton = function(html) {
   return html.querySelector('button#m-{{archetype.plugin.id}}control-button');
};

