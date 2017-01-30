/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.PruebaPluginControl');
goog.require('P.impl.control.PruebaPluginControl');
goog.require('P.plugin.PruebaPlugin');


goog.exportSymbol(
    'M.plugin.PruebaPlugin',
    M.plugin.PruebaPlugin);

goog.exportProperty(
    M.plugin.PruebaPlugin.prototype,
    'addTo',
    M.plugin.PruebaPlugin.prototype.addTo);

goog.exportSymbol(
    'M.impl.control.PruebaPluginControl',
    M.impl.control.PruebaPluginControl);

goog.exportProperty(
    M.impl.control.PruebaPluginControl.prototype,
    'addTo',
    M.impl.control.PruebaPluginControl.prototype.addTo);

goog.exportProperty(
    M.impl.control.PruebaPluginControl.prototype,
    'activate',
    M.impl.control.PruebaPluginControl.prototype.activate);

goog.exportProperty(
    M.impl.control.PruebaPluginControl.prototype,
    'deactivate',
    M.impl.control.PruebaPluginControl.prototype.deactivate);

goog.exportSymbol(
    'M.control.PruebaPluginControl',
    M.control.PruebaPluginControl);

goog.exportProperty(
    M.control.PruebaPluginControl.prototype,
    'createView',
    M.control.PruebaPluginControl.prototype.createView);

goog.exportProperty(
    M.control.PruebaPluginControl.prototype,
    'getActivationButton',
    M.control.PruebaPluginControl.prototype.getActivationButton);
