
/**
 *Global Application logic collection, should hold only instances 
 *@type Object
 */
var ping = { "Lib" : {}};


/**
 *Namespace utility
 *
 *@param ns {String} An array or string of namespaces to create or verify exist
 *@param toApply {Function} Adds 
 *@returns {Object} Last element in a NS
 */
ping.namespace = function(ns, toApply){
    var elements = ns.split(".");
    var root = window[elements[0]] = window[elements[0]] || {};
    
    for(var i = 1; i < elements.length; i++){        
        root = root[elements[i]] = root[elements[i]] || {};
    }    
    return root;
}

/**
 *With Namespace/object extension helper
 *
 *Provides a namespace safe mechanism for extending a functions prototype or decorating an object
 */
ping.w = function(target, toApply){
    toApply.call(target.prototype);
}

/**
 *Application exception implementation
 *
 *@param {string} Error message
 *@param {Object} A reference/copy of the local this variable for debugging purposes
 */
ping.Exception = function(message, scope){
    this.message = message;
    this.scope = scope;        
}

ping.Exception.prototype.toString = function(){
    return  "ping.Exception( " + this.message + ", ... );"
}

/**
 *@static Global reference to the Canvas 2d context
 *@deprecated
 */
ping.CTX = null;
