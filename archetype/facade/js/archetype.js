goog.provide('P.plugin.{{archetype.plugin.name}}');

goog.require('P.control.{{archetype.plugin.name}}Control');

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {Object} impl implementation object
 * @api stable
 */
M.plugin.{{archetype.plugin.name}} = (function() {
   goog.base(this);
});
goog.inherits(M.plugin.{{archetype.plugin.name}}, M.Plugin);

/**
 * This function adds this plugin into the map
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.{{archetype.plugin.name}}.prototype.addTo = function(map) {
   var miControl = new M.control.{{archetype.plugin.name}}Control();
   map.addControls([miControl]);
};

