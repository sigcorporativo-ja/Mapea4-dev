goog.provide('P.impl.control.{{archetype.plugin.name}}Control');

/**
 * @classdesc
 * Main constructor of the {{archetype.plugin.name}}Control.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.{{archetype.plugin.name}}Control = function() {
   goog.base(this);
};
goog.inherits(M.impl.control.{{archetype.plugin.name}}Control, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.{{archetype.plugin.name}}Control.prototype.addTo = function(map, html) {
   // specific code

   // super addTo
   goog.base(this, 'addTo', map, html);
};

/**
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.{{archetype.plugin.name}}Control.prototype.activate = function() {
   M.dialog.info('Hello World!');
};

/**
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.{{archetype.plugin.name}}Control.prototype.deactivate = function() {
   M.dialog.info('Bye World!');
};
