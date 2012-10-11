
/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

/*
* jQuery Mobile Framework 1.1.1 1981b3f5ec22675ae47df8f0bdf9622e7780e90e
* http://jquerymobile.com
*
* Copyright 2012 jQuery Foundation and other contributors
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/
(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ], function ( $ ) {
			factory( $, root, doc );
			return $.mobile;
		});
	} else {
		// Browser globals
		factory( root.jQuery, root, doc );
	}
}( this, document, function ( jQuery, window, document, undefined ) {


// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

(function( $, window, document, undefined ) {

var dataPropertyName = "virtualMouseBindings",
	touchTargetPropertyName = "virtualTouchID",
	virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
	touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
	mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
	mouseEventProps = $.event.props.concat( mouseHookProps ),
	activeDocHandlers = {},
	resetTimerID = 0,
	startX = 0,
	startY = 0,
	didScroll = false,
	clickBlockList = [],
	blockMouseTriggers = false,
	blockTouchTriggers = false,
	eventCaptureSupported = "addEventListener" in document,
	$document = $( document ),
	nextTouchID = 1,
	lastTouchID = 0;

$.vmouse = {
	moveDistanceThreshold: 10,
	clickDistanceThreshold: 10,
	resetTimerDuration: 1500
};

function getNativeEvent( event ) {

	while ( event && typeof event.originalEvent !== "undefined" ) {
		event = event.originalEvent;
	}
	return event;
}

function createVirtualEvent( event, eventType ) {

	var t = event.type,
		oe, props, ne, prop, ct, touch, i, j;

	event = $.Event(event);
	event.type = eventType;

	oe = event.originalEvent;
	props = $.event.props;

	// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
	// https://github.com/jquery/jquery-mobile/issues/3280
	if ( t.search( /^(mouse|click)/ ) > -1 ) {
		props = mouseEventProps;
	}

	// copy original event properties over to the new event
	// this would happen if we could call $.event.fix instead of $.Event
	// but we don't have a way to force an event to be fixed multiple times
	if ( oe ) {
		for ( i = props.length, prop; i; ) {
			prop = props[ --i ];
			event[ prop ] = oe[ prop ];
		}
	}

	// make sure that if the mouse and click virtual events are generated
	// without a .which one is defined
	if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ){
		event.which = 1;
	}

	if ( t.search(/^touch/) !== -1 ) {
		ne = getNativeEvent( oe );
		t = ne.touches;
		ct = ne.changedTouches;
		touch = ( t && t.length ) ? t[0] : ( (ct && ct.length) ? ct[ 0 ] : undefined );

		if ( touch ) {
			for ( j = 0, len = touchEventProps.length; j < len; j++){
				prop = touchEventProps[ j ];
				event[ prop ] = touch[ prop ];
			}
		}
	}

	return event;
}

function getVirtualBindingFlags( element ) {

	var flags = {},
		b, k;

	while ( element ) {

		b = $.data( element, dataPropertyName );

		for (  k in b ) {
			if ( b[ k ] ) {
				flags[ k ] = flags.hasVirtualBinding = true;
			}
		}
		element = element.parentNode;
	}
	return flags;
}

function getClosestElementWithVirtualBinding( element, eventType ) {
	var b;
	while ( element ) {

		b = $.data( element, dataPropertyName );

		if ( b && ( !eventType || b[ eventType ] ) ) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

function enableTouchBindings() {
	blockTouchTriggers = false;
}

function disableTouchBindings() {
	blockTouchTriggers = true;
}

function enableMouseBindings() {
	lastTouchID = 0;
	clickBlockList.length = 0;
	blockMouseTriggers = false;

	// When mouse bindings are enabled, our
	// touch bindings are disabled.
	disableTouchBindings();
}

function disableMouseBindings() {
	// When mouse bindings are disabled, our
	// touch bindings are enabled.
	enableTouchBindings();
}

function startResetTimer() {
	clearResetTimer();
	resetTimerID = setTimeout(function(){
		resetTimerID = 0;
		enableMouseBindings();
	}, $.vmouse.resetTimerDuration );
}

function clearResetTimer() {
	if ( resetTimerID ){
		clearTimeout( resetTimerID );
		resetTimerID = 0;
	}
}

function triggerVirtualEvent( eventType, event, flags ) {
	var ve;

	if ( ( flags && flags[ eventType ] ) ||
				( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

		ve = createVirtualEvent( event, eventType );

		$( event.target).trigger( ve );
	}

	return ve;
}

function mouseEventCallback( event ) {
	var touchID = $.data(event.target, touchTargetPropertyName);

	if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ){
		var ve = triggerVirtualEvent( "v" + event.type, event );
		if ( ve ) {
			if ( ve.isDefaultPrevented() ) {
				event.preventDefault();
			}
			if ( ve.isPropagationStopped() ) {
				event.stopPropagation();
			}
			if ( ve.isImmediatePropagationStopped() ) {
				event.stopImmediatePropagation();
			}
		}
	}
}

function handleTouchStart( event ) {

	var touches = getNativeEvent( event ).touches,
		target, flags;

	if ( touches && touches.length === 1 ) {

		target = event.target;
		flags = getVirtualBindingFlags( target );

		if ( flags.hasVirtualBinding ) {

			lastTouchID = nextTouchID++;
			$.data( target, touchTargetPropertyName, lastTouchID );

			clearResetTimer();

			disableMouseBindings();
			didScroll = false;

			var t = getNativeEvent( event ).touches[ 0 ];
			startX = t.pageX;
			startY = t.pageY;

			triggerVirtualEvent( "vmouseover", event, flags );
			triggerVirtualEvent( "vmousedown", event, flags );
		}
	}
}

function handleScroll( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	if ( !didScroll ) {
		triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
	}

	didScroll = true;
	startResetTimer();
}

function handleTouchMove( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	var t = getNativeEvent( event ).touches[ 0 ],
		didCancel = didScroll,
		moveThreshold = $.vmouse.moveDistanceThreshold;
		didScroll = didScroll ||
			( Math.abs(t.pageX - startX) > moveThreshold ||
				Math.abs(t.pageY - startY) > moveThreshold ),
		flags = getVirtualBindingFlags( event.target );

	if ( didScroll && !didCancel ) {
		triggerVirtualEvent( "vmousecancel", event, flags );
	}

	triggerVirtualEvent( "vmousemove", event, flags );
	startResetTimer();
}

function handleTouchEnd( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	disableTouchBindings();

	var flags = getVirtualBindingFlags( event.target ),
		t;
	triggerVirtualEvent( "vmouseup", event, flags );

	if ( !didScroll ) {
		var ve = triggerVirtualEvent( "vclick", event, flags );
		if ( ve && ve.isDefaultPrevented() ) {
			// The target of the mouse events that follow the touchend
			// event don't necessarily match the target used during the
			// touch. This means we need to rely on coordinates for blocking
			// any click that is generated.
			t = getNativeEvent( event ).changedTouches[ 0 ];
			clickBlockList.push({
				touchID: lastTouchID,
				x: t.clientX,
				y: t.clientY
			});

			// Prevent any mouse events that follow from triggering
			// virtual event notifications.
			blockMouseTriggers = true;
		}
	}
	triggerVirtualEvent( "vmouseout", event, flags);
	didScroll = false;

	startResetTimer();
}

function hasVirtualBindings( ele ) {
	var bindings = $.data( ele, dataPropertyName ),
		k;

	if ( bindings ) {
		for ( k in bindings ) {
			if ( bindings[ k ] ) {
				return true;
			}
		}
	}
	return false;
}

function dummyMouseHandler(){}

function getSpecialEventObject( eventType ) {
	var realType = eventType.substr( 1 );

	return {
		setup: function( data, namespace ) {
			// If this is the first virtual mouse binding for this element,
			// add a bindings object to its data.

			if ( !hasVirtualBindings( this ) ) {
				$.data( this, dataPropertyName, {});
			}

			// If setup is called, we know it is the first binding for this
			// eventType, so initialize the count for the eventType to zero.
			var bindings = $.data( this, dataPropertyName );
			bindings[ eventType ] = true;

			// If this is the first virtual mouse event for this type,
			// register a global handler on the document.

			activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

			if ( activeDocHandlers[ eventType ] === 1 ) {
				$document.bind( realType, mouseEventCallback );
			}

			// Some browsers, like Opera Mini, won't dispatch mouse/click events
			// for elements unless they actually have handlers registered on them.
			// To get around this, we register dummy handlers on the elements.

			$( this ).bind( realType, dummyMouseHandler );

			// For now, if event capture is not supported, we rely on mouse handlers.
			if ( eventCaptureSupported ) {
				// If this is the first virtual mouse binding for the document,
				// register our touchstart handler on the document.

				activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

				if (activeDocHandlers[ "touchstart" ] === 1) {
					$document.bind( "touchstart", handleTouchStart )
						.bind( "touchend", handleTouchEnd )

						// On touch platforms, touching the screen and then dragging your finger
						// causes the window content to scroll after some distance threshold is
						// exceeded. On these platforms, a scroll prevents a click event from being
						// dispatched, and on some platforms, even the touchend is suppressed. To
						// mimic the suppression of the click event, we need to watch for a scroll
						// event. Unfortunately, some platforms like iOS don't dispatch scroll
						// events until *AFTER* the user lifts their finger (touchend). This means
						// we need to watch both scroll and touchmove events to figure out whether
						// or not a scroll happenens before the touchend event is fired.

						.bind( "touchmove", handleTouchMove )
						.bind( "scroll", handleScroll );
				}
			}
		},

		teardown: function( data, namespace ) {
			// If this is the last virtual binding for this eventType,
			// remove its global handler from the document.

			--activeDocHandlers[ eventType ];

			if ( !activeDocHandlers[ eventType ] ) {
				$document.unbind( realType, mouseEventCallback );
			}

			if ( eventCaptureSupported ) {
				// If this is the last virtual mouse binding in existence,
				// remove our document touchstart listener.

				--activeDocHandlers[ "touchstart" ];

				if ( !activeDocHandlers[ "touchstart" ] ) {
					$document.unbind( "touchstart", handleTouchStart )
						.unbind( "touchmove", handleTouchMove )
						.unbind( "touchend", handleTouchEnd )
						.unbind( "scroll", handleScroll );
				}
			}

			var $this = $( this ),
				bindings = $.data( this, dataPropertyName );

			// teardown may be called when an element was
			// removed from the DOM. If this is the case,
			// jQuery core may have already stripped the element
			// of any data bindings so we need to check it before
			// using it.
			if ( bindings ) {
				bindings[ eventType ] = false;
			}

			// Unregister the dummy event handler.

			$this.unbind( realType, dummyMouseHandler );

			// If this is the last virtual mouse binding on the
			// element, remove the binding data from the element.

			if ( !hasVirtualBindings( this ) ) {
				$this.removeData( dataPropertyName );
			}
		}
	};
}

// Expose our custom events to the jQuery bind/unbind mechanism.

for ( var i = 0; i < virtualEventNames.length; i++ ){
	$.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
}

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
if ( eventCaptureSupported ) {
	document.addEventListener( "click", function( e ){
		var cnt = clickBlockList.length,
			target = e.target,
			x, y, ele, i, o, touchID;

		if ( cnt ) {
			x = e.clientX;
			y = e.clientY;
			threshold = $.vmouse.clickDistanceThreshold;

			// The idea here is to run through the clickBlockList to see if
			// the current click event is in the proximity of one of our
			// vclick events that had preventDefault() called on it. If we find
			// one, then we block the click.
			//
			// Why do we have to rely on proximity?
			//
			// Because the target of the touch event that triggered the vclick
			// can be different from the target of the click event synthesized
			// by the browser. The target of a mouse/click event that is syntehsized
			// from a touch event seems to be implementation specific. For example,
			// some browsers will fire mouse/click events for a link that is near
			// a touch event, even though the target of the touchstart/touchend event
			// says the user touched outside the link. Also, it seems that with most
			// browsers, the target of the mouse/click event is not calculated until the
			// time it is dispatched, so if you replace an element that you touched
			// with another element, the target of the mouse/click will be the new
			// element underneath that point.
			//
			// Aside from proximity, we also check to see if the target and any
			// of its ancestors were the ones that blocked a click. This is necessary
			// because of the strange mouse/click target calculation done in the
			// Android 2.1 browser, where if you click on an element, and there is a
			// mouse/click handler on one of its ancestors, the target will be the
			// innermost child of the touched element, even if that child is no where
			// near the point of touch.

			ele = target;

			while ( ele ) {
				for ( i = 0; i < cnt; i++ ) {
					o = clickBlockList[ i ];
					touchID = 0;

					if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
								$.data( ele, touchTargetPropertyName ) === o.touchID ) {
						// XXX: We may want to consider removing matches from the block list
						//      instead of waiting for the reset timer to fire.
						e.preventDefault();
						e.stopPropagation();
						return;
					}
				}
				ele = ele.parentNode;
			}
		}
	}, true);
}
})( jQuery, window, document );



// Script: jQuery hashchange event
// 
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function(val){ return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    $.browser.msie && !supports_onhashchange && (function(){
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function(){
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function(){
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function(){
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})(jQuery,this);

/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */

(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			$( elem ).triggerHandler( "remove" );
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						$( this ).triggerHandler( "remove" );
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name );
				if ( !instance ) {
					throw "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'";
				}
				if ( !$.isFunction( instance[options] ) ) {
					throw "no such method '" + options + "' for " + name + " widget instance";
				}
				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		var options = {};
		if ( $.metadata ) {
			options = $.metadata.get( element )[ this.widgetName ];
		}
		return options;
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var callback = this.options[ type ];

		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.widget", {
	// decorate the parent _createWidget to trigger `widgetinit` for users
	// who wish to do post post `widgetcreate` alterations/additions
	//
	// TODO create a pull request for jquery ui to trigger this event
	// in the original _createWidget
	_createWidget: function() {
		$.Widget.prototype._createWidget.apply( this, arguments );
		this._trigger( 'init' );
	},

	_getCreateOptions: function() {

		var elem = this.element,
			options = {};

		$.each( this.options, function( option ) {

			var value = elem.jqmData( option.replace( /[A-Z]/g, function( c ) {
							return "-" + c.toLowerCase();
						})
					);

			if ( value !== undefined ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	enhanceWithin: function( target, useKeepNative ) {
		this.enhance( $( this.options.initSelector, $( target )), useKeepNative );
	},

	enhance: function( targets, useKeepNative ) {
		var page, keepNative, $widgetElements = $( targets ), self = this;

		// if ignoreContentEnabled is set to true the framework should
		// only enhance the selected elements when they do NOT have a
		// parent with the data-namespace-ignore attribute
		$widgetElements = $.mobile.enhanceable( $widgetElements );

		if ( useKeepNative && $widgetElements.length ) {
			// TODO remove dependency on the page widget for the keepNative.
			// Currently the keepNative value is defined on the page prototype so
			// the method is as well
			page = $.mobile.closestPageData( $widgetElements );
			keepNative = (page && page.keepNativeSelector()) || "";

			$widgetElements = $widgetElements.not( keepNative );
		}

		$widgetElements[ this.widgetName ]();
	},

	raise: function( msg ) {
		throw "Widget [" + this.widgetName + "]: " + msg;
	}
});

})( jQuery );

(function( $, window, undefined ) {

	var nsNormalizeDict = {};

	// jQuery.mobile configurable options
	$.mobile = $.extend( {}, {

		// Version of the jQuery Mobile Framework
		version: "1.1.1",

		// Namespace used framework-wide for data-attrs. Default is no namespace
		ns: "",

		// Define the url parameter used for referencing widget-generated sub-pages.
		// Translates to to example.html&ui-page=subpageIdentifier
		// hash segment before &ui-page= is used to make Ajax request
		subPageUrlKey: "ui-page",

		// Class assigned to page currently in view, and during transitions
		activePageClass: "ui-page-active",

		// Class used for "active" button state, from CSS framework
		activeBtnClass: "ui-btn-active",

		// Class used for "focus" form element state, from CSS framework
		focusClass: "ui-focus",

		// Automatically handle clicks and form submissions through Ajax, when same-domain
		ajaxEnabled: true,

		// Automatically load and show pages based on location.hash
		hashListeningEnabled: true,

		// disable to prevent jquery from bothering with links
		linkBindingEnabled: true,

		// Set default page transition - 'none' for no transitions
		defaultPageTransition: "fade",

		// Set maximum window width for transitions to apply - 'false' for no limit
		maxTransitionWidth: false,

		// Minimum scroll distance that will be remembered when returning to a page
		minScrollBack: 250,

		// DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
		touchOverflowEnabled: false,

		// Set default dialog transition - 'none' for no transitions
		defaultDialogTransition: "pop",

		// Show loading message during Ajax requests
		// if false, message will not appear, but loading classes will still be toggled on html el
		loadingMessage: "loading",

		// Error response message - appears when an Ajax page request fails
		pageLoadErrorMessage: "Error Loading Page",

		// Should the text be visble in the loading message?
		loadingMessageTextVisible: false,

		// When the text is visible, what theme does the loading box use?
		loadingMessageTheme: "a",

		// For error messages, which theme does the box uses?
		pageLoadErrorMessageTheme: "e",

		//automatically initialize the DOM when it's ready
		autoInitializePage: true,

		pushStateEnabled: true,

		// allows users to opt in to ignoring content by marking a parent element as
		// data-ignored
		ignoreContentEnabled: false,

		// turn of binding to the native orientationchange due to android orientation behavior
		orientationChangeEnabled: true,

		buttonMarkup: {
			hoverDelay: 200
		},

		// TODO might be useful upstream in jquery itself ?
		keyCode: {
			ALT: 18,
			BACKSPACE: 8,
			CAPS_LOCK: 20,
			COMMA: 188,
			COMMAND: 91,
			COMMAND_LEFT: 91, // COMMAND
			COMMAND_RIGHT: 93,
			CONTROL: 17,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			INSERT: 45,
			LEFT: 37,
			MENU: 93, // COMMAND_RIGHT
			NUMPAD_ADD: 107,
			NUMPAD_DECIMAL: 110,
			NUMPAD_DIVIDE: 111,
			NUMPAD_ENTER: 108,
			NUMPAD_MULTIPLY: 106,
			NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SHIFT: 16,
			SPACE: 32,
			TAB: 9,
			UP: 38,
			WINDOWS: 91 // COMMAND
		},

		// Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
		silentScroll: function( ypos ) {
			if ( $.type( ypos ) !== "number" ) {
				ypos = $.mobile.defaultHomeScroll;
			}

			// prevent scrollstart and scrollstop events
			$.event.special.scrollstart.enabled = false;

			setTimeout(function() {
				window.scrollTo( 0, ypos );
				$( document ).trigger( "silentscroll", { x: 0, y: ypos });
			}, 20 );

			setTimeout(function() {
				$.event.special.scrollstart.enabled = true;
			}, 150 );
		},

		// Expose our cache for testing purposes.
		nsNormalizeDict: nsNormalizeDict,

		// Take a data attribute property, prepend the namespace
		// and then camel case the attribute string. Add the result
		// to our nsNormalizeDict so we don't have to do this again.
		nsNormalize: function( prop ) {
			if ( !prop ) {
				return;
			}

			return nsNormalizeDict[ prop ] || ( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
		},

		// Find the closest parent with a theme class on it. Note that
		// we are not using $.fn.closest() on purpose here because this
		// method gets called quite a bit and we need it to be as fast
		// as possible.
		getInheritedTheme: function( el, defaultTheme ) {
			var e = el[ 0 ],
				ltr = "",
				re = /ui-(bar|body|overlay)-([a-z])\b/,
				c, m;

			while ( e ) {
				c = e.className || "";
				if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
					// We found a parent with a theme class
					// on it so bail from this loop.
					break;
				}

				e = e.parentNode;
			}

			// Return the theme letter we found, if none, return the
			// specified default.

			return ltr || defaultTheme || "a";
		},

		// TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
		//
		// Find the closest javascript page element to gather settings data jsperf test
		// http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
		// possibly naive, but it shows that the parsing overhead for *just* the page selector vs
		// the page and dialog selector is negligable. This could probably be speed up by
		// doing a similar parent node traversal to the one found in the inherited theme code above
		closestPageData: function( $target ) {
			return $target
				.closest(':jqmData(role="page"), :jqmData(role="dialog")')
				.data("page");
		},

		enhanceable: function( $set ) {
			return this.haveParents( $set, "enhance" );
		},

		hijackable: function( $set ) {
			return this.haveParents( $set, "ajax" );
		},

		haveParents: function( $set, attr ) {
			if( !$.mobile.ignoreContentEnabled ){
				return $set;
			}

			var count = $set.length,
				$newSet = $(),
				e, $element, excluded;

			for ( var i = 0; i < count; i++ ) {
				$element = $set.eq( i );
				excluded = false;
				e = $set[ i ];

				while ( e ) {
					var c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

					if ( c === "false" ) {
						excluded = true;
						break;
					}

					e = e.parentNode;
				}

				if ( !excluded ) {
					$newSet = $newSet.add( $element );
				}
			}

			return $newSet;
		},

		getScreenHeight: function(){
			// Native innerHeight returns more accurate value for this across platforms,
			// jQuery version is here as a normalized fallback for platforms like Symbian
			return window.innerHeight || $( window ).height();
		}
	}, $.mobile );

	// Mobile version of data and removeData and hasData methods
	// ensures all data is set and retrieved using jQuery Mobile's data namespace
	$.fn.jqmData = function( prop, value ) {
		var result;
		if ( typeof prop != "undefined" ) {
			if ( prop ) {
				prop = $.mobile.nsNormalize( prop );
			}
			result = this.data.apply( this, arguments.length < 2 ? [ prop ] : [ prop, value ] );
		}
		return result;
	};

	$.jqmData = function( elem, prop, value ) {
		var result;
		if ( typeof prop != "undefined" ) {
			result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
		}
		return result;
	};

	$.fn.jqmRemoveData = function( prop ) {
		return this.removeData( $.mobile.nsNormalize( prop ) );
	};

	$.jqmRemoveData = function( elem, prop ) {
		return $.removeData( elem, $.mobile.nsNormalize( prop ) );
	};

	$.fn.removeWithDependents = function() {
		$.removeWithDependents( this );
	};

	$.removeWithDependents = function( elem ) {
		var $elem = $( elem );

		( $elem.jqmData('dependents') || $() ).remove();
		$elem.remove();
	};

	$.fn.addDependents = function( newDependents ) {
		$.addDependents( $(this), newDependents );
	};

	$.addDependents = function( elem, newDependents ) {
		var dependents = $(elem).jqmData( 'dependents' ) || $();

		$(elem).jqmData( 'dependents', $.merge(dependents, newDependents) );
	};

	// note that this helper doesn't attempt to handle the callback
	// or setting of an html elements text, its only purpose is
	// to return the html encoded version of the text in all cases. (thus the name)
	$.fn.getEncodedText = function() {
		return $( "<div/>" ).text( $(this).text() ).html();
	};

	// fluent helper function for the mobile namespaced equivalent
	$.fn.jqmEnhanceable = function() {
		return $.mobile.enhanceable( this );
	};

	$.fn.jqmHijackable = function() {
		return $.mobile.hijackable( this );
	};

	// Monkey-patching Sizzle to filter the :jqmData selector
	var oldFind = $.find,
		jqmDataRE = /:jqmData\(([^)]*)\)/g;

	$.find = function( selector, context, ret, extra ) {
		selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );

		return oldFind.call( this, selector, context, ret, extra );
	};

	$.extend( $.find, oldFind );

	$.find.matches = function( expr, set ) {
		return $.find( expr, null, null, set );
	};

	$.find.matchesSelector = function( node, expr ) {
		return $.find( expr, null, null, [ node ] ).length > 0;
	};
})( jQuery, this );


(function( $, undefined ) {

var $window = $( window ),
	$html = $( "html" );

/* $.mobile.media method: pass a CSS media type or query and get a bool return
	note: this feature relies on actual media query support for media queries, though types will work most anywhere
	examples:
		$.mobile.media('screen') // tests for screen media type
		$.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window width > 480px
		$.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit 2x pixel ratio (iPhone 4)
*/
$.mobile.media = (function() {
	// TODO: use window.matchMedia once at least one UA implements it
	var cache = {},
		testDiv = $( "<div id='jquery-mediatest'></div>" ),
		fakeBody = $( "<body>" ).append( testDiv );

	return function( query ) {
		if ( !( query in cache ) ) {
			var styleBlock = document.createElement( "style" ),
				cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";

			//must set type for IE!
			styleBlock.type = "text/css";

			if ( styleBlock.styleSheet  ){
				styleBlock.styleSheet.cssText = cssrule;
			} else {
				styleBlock.appendChild( document.createTextNode(cssrule) );
			}

			$html.prepend( fakeBody ).prepend( styleBlock );
			cache[ query ] = testDiv.css( "position" ) === "absolute";
			fakeBody.add( styleBlock ).remove();
		}
		return cache[ query ];
	};
})();

})(jQuery);

(function( $, undefined ) {

var fakeBody = $( "<body>" ).prependTo( "html" ),
	fbCSS = fakeBody[ 0 ].style,
	vendors = [ "Webkit", "Moz", "O" ],
	webos = "palmGetResource" in window, //only used to rule out scrollTop
	opera = window.opera,
	operamini = window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]",
	bb = window.blackberry; //only used to rule out box shadow, as it's filled opaque on BB

// thx Modernizr
function propExists( prop ) {
	var uc_prop = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
		props = ( prop + " " + vendors.join( uc_prop + " " ) + uc_prop ).split( " " );

	for ( var v in props ){
		if ( fbCSS[ props[ v ] ] !== undefined ) {
			return true;
		}
	}
}

function validStyle( prop, value, check_vend ) {
	var div = document.createElement('div'),
		uc = function( txt ) {
			return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 )
		},
		vend_pref = function( vend ) {
			return  "-" + vend.charAt( 0 ).toLowerCase() + vend.substr( 1 ) + "-";
		},
		check_style = function( vend ) {
			var vend_prop = vend_pref( vend ) + prop + ": " + value + ";",
				uc_vend = uc( vend ),
				propStyle = uc_vend + uc( prop );
		
			div.setAttribute( "style", vend_prop );
		
			if( !!div.style[ propStyle ] ) {
				ret = true;
			}
		},
		check_vends = check_vend ? [ check_vend ] : vendors,
		ret;

	for( i = 0; i < check_vends.length; i++ ) {
		check_style( check_vends[i] );
	}
	return !!ret;
}

// Thanks to Modernizr src for this test idea. `perspective` check is limited to Moz to prevent a false positive for 3D transforms on Android.
function transform3dTest() {
	var prop = "transform-3d";
	return validStyle( 'perspective', '10px', 'moz' ) || $.mobile.media( "(-" + vendors.join( "-" + prop + "),(-" ) + "-" + prop + "),(" + prop + ")" );
}

// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
function baseTagTest() {
	var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
		base = $( "head base" ),
		fauxEle = null,
		href = "",
		link, rebase;

	if ( !base.length ) {
		base = fauxEle = $( "<base>", { "href": fauxBase }).appendTo( "head" );
	} else {
		href = base.attr( "href" );
	}

	link = $( "<a href='testurl' />" ).prependTo( fakeBody );
	rebase = link[ 0 ].href;
	base[ 0 ].href = href || location.pathname;

	if ( fauxEle ) {
		fauxEle.remove();
	}
	return rebase.indexOf( fauxBase ) === 0;
}

// Thanks Modernizr
function cssPointerEventsTest() {
	var element = document.createElement('x'),
		documentElement = document.documentElement,
		getComputedStyle = window.getComputedStyle,
		supports;

	if( !( 'pointerEvents' in element.style ) ){
		return false;
	}

	element.style.pointerEvents = 'auto';
	element.style.pointerEvents = 'x';
    documentElement.appendChild(element);
	supports = getComputedStyle &&
    getComputedStyle( element, '' ).pointerEvents === 'auto';
	documentElement.removeChild( element );
    return !!supports;
}


// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
// allows for inclusion of IE 6+, including Windows Mobile 7
$.extend( $.mobile, { browser: {} } );
$.mobile.browser.ie = (function() {
	var v = 3,
	div = document.createElement( "div" ),
	a = div.all || [];

	// added {} to silence closure compiler warnings. registering my dislike of all things
	// overly clever here for future reference
	while ( div.innerHTML = "<!--[if gt IE " + ( ++v ) + "]><br><![endif]-->", a[ 0 ] ){};

	return v > 4 ? v : !v;
})();


$.extend( $.support, {
	orientation: "orientation" in window && "onorientationchange" in window,
	touch: "ontouchend" in document,
	cssTransitions: "WebKitTransitionEvent" in window || validStyle( 'transition', 'height 100ms linear' ) && !opera,
	pushState: "pushState" in history && "replaceState" in history,
	mediaquery: $.mobile.media( "only all" ),
	cssPseudoElement: !!propExists( "content" ),
	touchOverflow: !!propExists( "overflowScrolling" ),
	cssTransform3d: transform3dTest(),
	boxShadow: !!propExists( "boxShadow" ) && !bb,
	scrollTop: ( "pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[ 0 ] ) && !webos && !operamini,
	dynamicBaseTag: baseTagTest(),
	cssPointerEvents: cssPointerEventsTest()
});

fakeBody.remove();


// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
// Note: This detection below is used as a last resort.
// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
var nokiaLTE7_3 = (function(){

	var ua = window.navigator.userAgent;

	//The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
	return ua.indexOf( "Nokia" ) > -1 &&
			( ua.indexOf( "Symbian/3" ) > -1 || ua.indexOf( "Series60/5" ) > -1 ) &&
			ua.indexOf( "AppleWebKit" ) > -1 &&
			ua.match( /(BrowserNG|NokiaBrowser)\/7\.[0-3]/ );
})();

// Support conditions that must be met in order to proceed
// default enhanced qualifications are media query support OR IE 7+
$.mobile.gradeA = function(){
	return $.support.mediaquery || $.mobile.browser.ie && $.mobile.browser.ie >= 7;
};

$.mobile.ajaxBlacklist =
			// BlackBerry browsers, pre-webkit
			window.blackberry && !window.WebKitPoint ||
			// Opera Mini
			operamini ||
			// Symbian webkits pre 7.3
			nokiaLTE7_3;

// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
// This simply reappends the CSS in place, which for some reason makes it apply
if ( nokiaLTE7_3 ) {
	$(function() {
		$( "head link[rel='stylesheet']" ).attr( "rel", "alternate stylesheet" ).attr( "rel", "stylesheet" );
	});
}

// For ruling out shadows via css
if ( !$.support.boxShadow ) {
	$( "html" ).addClass( "ui-mobile-nosupport-boxshadow" );
}

})( jQuery );

(function( $, window, undefined ) {

// add new event shortcuts
$.each( ( "touchstart touchmove touchend orientationchange throttledresize " +
					"tap taphold swipe swipeleft swiperight scrollstart scrollstop" ).split( " " ), function( i, name ) {

	$.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	$.attrFn[ name ] = true;
});

var supportTouch = $.support.touch,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

function triggerCustomEvent( obj, eventType, event ) {
	var originalType = event.type;
	event.type = eventType;
	$.event.handle.call( obj, event );
	event.type = originalType;
}

// also handles scrollstop
$.event.special.scrollstart = {

	enabled: true,

	setup: function() {

		var thisObject = this,
			$this = $( thisObject ),
			scrolling,
			timer;

		function trigger( event, state ) {
			scrolling = state;
			triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
		}

		// iPhone triggers scroll after a small delay; use touchmove instead
		$this.bind( scrollEvent, function( event ) {

			if ( !$.event.special.scrollstart.enabled ) {
				return;
			}

			if ( !scrolling ) {
				trigger( event, true );
			}

			clearTimeout( timer );
			timer = setTimeout(function() {
				trigger( event, false );
			}, 50 );
		});
	}
};

// also handles taphold
$.event.special.tap = {
	setup: function() {
		var thisObject = this,
			$this = $( thisObject );

		$this.bind( "vmousedown", function( event ) {

			if ( event.which && event.which !== 1 ) {
				return false;
			}

			var origTarget = event.target,
				origEvent = event.originalEvent,
				timer;

			function clearTapTimer() {
				clearTimeout( timer );
			}

			function clearTapHandlers() {
				clearTapTimer();

				$this.unbind( "vclick", clickHandler )
					.unbind( "vmouseup", clearTapTimer );
				$( document ).unbind( "vmousecancel", clearTapHandlers );
			}

			function clickHandler(event) {
				clearTapHandlers();

				// ONLY trigger a 'tap' event if the start target is
				// the same as the stop target.
				if ( origTarget == event.target ) {
					triggerCustomEvent( thisObject, "tap", event );
				}
			}

			$this.bind( "vmouseup", clearTapTimer )
				.bind( "vclick", clickHandler );
			$( document ).bind( "vmousecancel", clearTapHandlers );

			timer = setTimeout(function() {
					triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
			}, 750 );
		});
	}
};

// also handles swipeleft, swiperight
$.event.special.swipe = {
	scrollSupressionThreshold: 10, // More than this horizontal displacement, and we will suppress scrolling.

	durationThreshold: 1000, // More time than this, and it isn't a swipe.

	horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

	verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

	setup: function() {
		var thisObject = this,
			$this = $( thisObject );

		$this.bind( touchStartEvent, function( event ) {
			var data = event.originalEvent.touches ?
								event.originalEvent.touches[ 0 ] : event,
				start = {
					time: ( new Date() ).getTime(),
					coords: [ data.pageX, data.pageY ],
					origin: $( event.target )
				},
				stop;

			function moveHandler( event ) {

				if ( !start ) {
					return;
				}

				var data = event.originalEvent.touches ?
						event.originalEvent.touches[ 0 ] : event;

				stop = {
					time: ( new Date() ).getTime(),
					coords: [ data.pageX, data.pageY ]
				};

				// prevent scrolling
				if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
					event.preventDefault();
				}
			}

			$this.bind( touchMoveEvent, moveHandler )
				.one( touchStopEvent, function( event ) {
					$this.unbind( touchMoveEvent, moveHandler );

					if ( start && stop ) {
						if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
								Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
								Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

							start.origin.trigger( "swipe" )
								.trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
						}
					}
					start = stop = undefined;
				});
		});
	}
};

(function( $, window ) {
	// "Cowboy" Ben Alman

	var win = $( window ),
		special_event,
		get_orientation,
		last_orientation,
		initial_orientation_is_landscape,
		initial_orientation_is_default,
		portrait_map = { "0": true, "180": true };

	// It seems that some device/browser vendors use window.orientation values 0 and 180 to
	// denote the "default" orientation. For iOS devices, and most other smart-phones tested,
	// the default orientation is always "portrait", but in some Android and RIM based tablets,
	// the default orientation is "landscape". The following code attempts to use the window
	// dimensions to figure out what the current orientation is, and then makes adjustments
	// to the to the portrait_map if necessary, so that we can properly decode the
	// window.orientation value whenever get_orientation() is called.
	//
	// Note that we used to use a media query to figure out what the orientation the browser
	// thinks it is in:
	//
	//     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
	//
	// but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
	// where the browser *ALWAYS* applied the landscape media query. This bug does not
	// happen on iPad.

	if ( $.support.orientation ) {

		// Check the window width and height to figure out what the current orientation
		// of the device is at this moment. Note that we've initialized the portrait map
		// values to 0 and 180, *AND* we purposely check for landscape so that if we guess
		// wrong, , we default to the assumption that portrait is the default orientation.
		// We use a threshold check below because on some platforms like iOS, the iPhone
		// form-factor can report a larger width than height if the user turns on the
		// developer console. The actual threshold value is somewhat arbitrary, we just
		// need to make sure it is large enough to exclude the developer console case.

		var ww = window.innerWidth || $( window ).width(),
			wh = window.innerHeight || $( window ).height(),
			landscape_threshold = 50;

		initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


		// Now check to see if the current window.orientation is 0 or 180.
		initial_orientation_is_default = portrait_map[ window.orientation ];

		// If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
		// if the initial orientation is portrait, but window.orientation reports 90 or -90, we
		// need to flip our portrait_map values because landscape is the default orientation for
		// this device/browser.
		if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
			portrait_map = { "-90": true, "90": true };
		}
	}

	$.event.special.orientationchange = special_event = {
		setup: function() {
			// If the event is supported natively, return false so that jQuery
			// will bind to the event using DOM methods.
			if ( $.support.orientation && $.mobile.orientationChangeEnabled ) {
				return false;
			}

			// Get the current orientation to avoid initial double-triggering.
			last_orientation = get_orientation();

			// Because the orientationchange event doesn't exist, simulate the
			// event by testing window dimensions on resize.
			win.bind( "throttledresize", handler );
		},
		teardown: function(){
			// If the event is supported natively, return false so that
			// jQuery will unbind the event using DOM methods.
			if ( $.support.orientation && $.mobile.orientationChangeEnabled ) {
				return false;
			}

			// Because the orientationchange event doesn't exist, unbind the
			// resize event handler.
			win.unbind( "throttledresize", handler );
		},
		add: function( handleObj ) {
			// Save a reference to the bound event handler.
			var old_handler = handleObj.handler;


			handleObj.handler = function( event ) {
				// Modify event object, adding the .orientation property.
				event.orientation = get_orientation();

				// Call the originally-bound event handler and return its result.
				return old_handler.apply( this, arguments );
			};
		}
	};

	// If the event is not supported natively, this handler will be bound to
	// the window resize event to simulate the orientationchange event.
	function handler() {
		// Get the current orientation.
		var orientation = get_orientation();

		if ( orientation !== last_orientation ) {
			// The orientation has changed, so trigger the orientationchange event.
			last_orientation = orientation;
			win.trigger( "orientationchange" );
		}
	}

	// Get the current page orientation. This method is exposed publicly, should it
	// be needed, as jQuery.event.special.orientationchange.orientation()
	$.event.special.orientationchange.orientation = get_orientation = function() {
		var isPortrait = true, elem = document.documentElement;

		// prefer window orientation to the calculation based on screensize as
		// the actual screen resize takes place before or after the orientation change event
		// has been fired depending on implementation (eg android 2.3 is before, iphone after).
		// More testing is required to determine if a more reliable method of determining the new screensize
		// is possible when orientationchange is fired. (eg, use media queries + element + opacity)
		if ( $.support.orientation ) {
			// if the window orientation registers as 0 or 180 degrees report
			// portrait, otherwise landscape
			isPortrait = portrait_map[ window.orientation ];
		} else {
			isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		}

		return isPortrait ? "portrait" : "landscape";
	};

})( jQuery, window );


// throttled resize event
(function() {

	$.event.special.throttledresize = {
		setup: function() {
			$( this ).bind( "resize", handler );
		},
		teardown: function(){
			$( this ).unbind( "resize", handler );
		}
	};

	var throttle = 250,
		handler = function() {
			curr = ( new Date() ).getTime();
			diff = curr - lastCall;

			if ( diff >= throttle ) {

				lastCall = curr;
				$( this ).trigger( "throttledresize" );

			} else {

				if ( heldCall ) {
					clearTimeout( heldCall );
				}

				// Promise a held call will still execute
				heldCall = setTimeout( handler, throttle - diff );
			}
		},
		lastCall = 0,
		heldCall,
		curr,
		diff;
})();


$.each({
	scrollstop: "scrollstart",
	taphold: "tap",
	swipeleft: "swipe",
	swiperight: "swipe"
}, function( event, sourceEvent ) {

	$.event.special[ event ] = {
		setup: function() {
			$( this ).bind( sourceEvent, $.noop );
		}
	};
});

})( jQuery, this );

(function( $, undefined ) {

$.widget( "mobile.page", $.mobile.widget, {
	options: {
		theme: "c",
		domCache: false,
		keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs')"
	},

	_create: function() {
		
		var self = this;
		
		// if false is returned by the callbacks do not create the page
		if( self._trigger( "beforecreate" ) === false ){
			return false;
		}

		self.element
			.attr( "tabindex", "0" )
			.addClass( "ui-page ui-body-" + self.options.theme )
			.bind( "pagebeforehide", function(){
				self.removeContainerBackground();
			} )
			.bind( "pagebeforeshow", function(){
				self.setContainerBackground();
			} );

	},
	
	removeContainerBackground: function(){
		$.mobile.pageContainer.removeClass( "ui-overlay-" + $.mobile.getInheritedTheme( this.element.parent() ) );
	},
	
	// set the page container background to the page theme
	setContainerBackground: function( theme ){
		if( this.options.theme ){
			$.mobile.pageContainer.addClass( "ui-overlay-" + ( theme || this.options.theme ) );
		}
	},

	keepNativeSelector: function() {
		var options = this.options,
			keepNativeDefined = options.keepNative && $.trim(options.keepNative);

		if( keepNativeDefined && options.keepNative !== options.keepNativeDefault ){
			return [options.keepNative, options.keepNativeDefault].join(", ");
		}

		return options.keepNativeDefault;
	}
});
})( jQuery );


(function( $, window, undefined ) {

var createHandler = function( sequential ){
	
	// Default to sequential
	if( sequential === undefined ){
		sequential = true;
	}
	
	return function( name, reverse, $to, $from ) {

		var deferred = new $.Deferred(),
			reverseClass = reverse ? " reverse" : "",
			active	= $.mobile.urlHistory.getActive(),
			toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
			screenHeight = $.mobile.getScreenHeight(),
			maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $( window ).width() > $.mobile.maxTransitionWidth,
			none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none" || Math.max( $( window ).scrollTop(), toScroll ) > $.mobile.getMaxScrollForTransition(),
			toPreClass = " ui-page-pre-in",
			toggleViewportClass = function(){
				$.mobile.pageContainer.toggleClass( "ui-mobile-viewport-transitioning viewport-" + name );
			},
			scrollPage = function(){
				// By using scrollTo instead of silentScroll, we can keep things better in order
				// Just to be precautios, disable scrollstart listening like silentScroll would
				$.event.special.scrollstart.enabled = false;
				
				window.scrollTo( 0, toScroll );
				
				// reenable scrollstart listening like silentScroll would
				setTimeout(function() {
					$.event.special.scrollstart.enabled = true;
				}, 150 );
			},
			cleanFrom = function(){
				$from
					.removeClass( $.mobile.activePageClass + " out in reverse " + name )
					.height( "" );
			},
			startOut = function(){
				// if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
				if( !sequential ){
					doneOut();
				}
				else {
					$from.animationComplete( doneOut );	
				}
				
				// Set the from page's height and start it transitioning out
				// Note: setting an explicit height helps eliminate tiling in the transitions
				$from
					.height( screenHeight + $(window ).scrollTop() )
					.addClass( name + " out" + reverseClass );
			},
			
			doneOut = function() {

				if ( $from && sequential ) {
					cleanFrom();
				}
				
				startIn();
			},
			
			startIn = function(){	
			
				$to.addClass( $.mobile.activePageClass );				
			
				// Send focus to page as it is now display: block
				$.mobile.focusPage( $to );

				// Set to page height
				$to.height( screenHeight + toScroll );
				
				scrollPage();
				
				if( !none ){
					$to.animationComplete( doneIn );
				}
				
				$to.addClass( name + " in" + reverseClass );
				
				if( none ){
					doneIn();
				}
				
			},
		
			doneIn = function() {
			
				if ( !sequential ) {
					
					if( $from ){
						cleanFrom();
					}
				}
			
				$to
					.removeClass( "out in reverse " + name )
					.height( "" );
				
				toggleViewportClass();
				
				// In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
				// This ensures we jump to that spot after the fact, if we aren't there already.
				if( $( window ).scrollTop() !== toScroll ){
					scrollPage();
				}

				deferred.resolve( name, reverse, $to, $from, true );
			};

		toggleViewportClass();
	
		if ( $from && !none ) {
			startOut();
		}
		else {
			doneOut();
		}

		return deferred.promise();
	};
}

// generate the handlers from the above
var sequentialHandler = createHandler(),
	simultaneousHandler = createHandler( false ),
	defaultGetMaxScrollForTransition = function() {
		return $.mobile.getScreenHeight() * 3;
	};

// Make our transition handler the public default.
$.mobile.defaultTransitionHandler = sequentialHandler;

//transition handler dictionary for 3rd party transitions
$.mobile.transitionHandlers = {
	"default": $.mobile.defaultTransitionHandler,
	"sequential": sequentialHandler,
	"simultaneous": simultaneousHandler
};

$.mobile.transitionFallbacks = {};

// Set the getMaxScrollForTransition to default if no implementation was set by user
$.mobile.getMaxScrollForTransition = $.mobile.getMaxScrollForTransition || defaultGetMaxScrollForTransition;
})( jQuery, this );

( function( $, undefined ) {

	//define vars for interal use
	var $window = $( window ),
		$html = $( 'html' ),
		$head = $( 'head' ),

		//url path helpers for use in relative url management
		path = {

			// This scary looking regular expression parses an absolute URL or its relative
			// variants (protocol, site, document, query, and hash), into the various
			// components (protocol, host, path, query, fragment, etc that make up the
			// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
			// or String.match, it parses the URL into a results array that looks like this:
			//
			//     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
			//     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
			//     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
			//     [3]: http://jblas:password@mycompany.com:8080
			//     [4]: http:
			//     [5]: //
			//     [6]: jblas:password@mycompany.com:8080
			//     [7]: jblas:password
			//     [8]: jblas
			//     [9]: password
			//    [10]: mycompany.com:8080
			//    [11]: mycompany.com
			//    [12]: 8080
			//    [13]: /mail/inbox
			//    [14]: /mail/
			//    [15]: inbox
			//    [16]: ?msg=1234&type=unread
			//    [17]: #msg-content
			//
			urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

			//Parse a URL into a structure that allows easy access to
			//all of the URL components by name.
			parseUrl: function( url ) {
				// If we're passed an object, we'll assume that it is
				// a parsed url object and just return it back to the caller.
				if ( $.type( url ) === "object" ) {
					return url;
				}

				var matches = path.urlParseRE.exec( url || "" ) || [];

					// Create an object that allows the caller to access the sub-matches
					// by name. Note that IE returns an empty string instead of undefined,
					// like all other browsers do, so we normalize everything so its consistent
					// no matter what browser we're running on.
					return {
						href:         matches[  0 ] || "",
						hrefNoHash:   matches[  1 ] || "",
						hrefNoSearch: matches[  2 ] || "",
						domain:       matches[  3 ] || "",
						protocol:     matches[  4 ] || "",
						doubleSlash:  matches[  5 ] || "",
						authority:    matches[  6 ] || "",
						username:     matches[  8 ] || "",
						password:     matches[  9 ] || "",
						host:         matches[ 10 ] || "",
						hostname:     matches[ 11 ] || "",
						port:         matches[ 12 ] || "",
						pathname:     matches[ 13 ] || "",
						directory:    matches[ 14 ] || "",
						filename:     matches[ 15 ] || "",
						search:       matches[ 16 ] || "",
						hash:         matches[ 17 ] || ""
					};
			},

			//Turn relPath into an asbolute path. absPath is
			//an optional absolute path which describes what
			//relPath is relative to.
			makePathAbsolute: function( relPath, absPath ) {
				if ( relPath && relPath.charAt( 0 ) === "/" ) {
					return relPath;
				}

				relPath = relPath || "";
				absPath = absPath ? absPath.replace( /^\/|(\/[^\/]*|[^\/]+)$/g, "" ) : "";

				var absStack = absPath ? absPath.split( "/" ) : [],
					relStack = relPath.split( "/" );
				for ( var i = 0; i < relStack.length; i++ ) {
					var d = relStack[ i ];
					switch ( d ) {
						case ".":
							break;
						case "..":
							if ( absStack.length ) {
								absStack.pop();
							}
							break;
						default:
							absStack.push( d );
							break;
					}
				}
				return "/" + absStack.join( "/" );
			},

			//Returns true if both urls have the same domain.
			isSameDomain: function( absUrl1, absUrl2 ) {
				return path.parseUrl( absUrl1 ).domain === path.parseUrl( absUrl2 ).domain;
			},

			//Returns true for any relative variant.
			isRelativeUrl: function( url ) {
				// All relative Url variants have one thing in common, no protocol.
				return path.parseUrl( url ).protocol === "";
			},

			//Returns true for an absolute url.
			isAbsoluteUrl: function( url ) {
				return path.parseUrl( url ).protocol !== "";
			},

			//Turn the specified realtive URL into an absolute one. This function
			//can handle all relative variants (protocol, site, document, query, fragment).
			makeUrlAbsolute: function( relUrl, absUrl ) {
				if ( !path.isRelativeUrl( relUrl ) ) {
					return relUrl;
				}

				var relObj = path.parseUrl( relUrl ),
					absObj = path.parseUrl( absUrl ),
					protocol = relObj.protocol || absObj.protocol,
					doubleSlash = relObj.protocol ? relObj.doubleSlash : ( relObj.doubleSlash || absObj.doubleSlash ),
					authority = relObj.authority || absObj.authority,
					hasPath = relObj.pathname !== "",
					pathname = path.makePathAbsolute( relObj.pathname || absObj.filename, absObj.pathname ),
					search = relObj.search || ( !hasPath && absObj.search ) || "",
					hash = relObj.hash;

				return protocol + doubleSlash + authority + pathname + search + hash;
			},

			//Add search (aka query) params to the specified url.
			addSearchParams: function( url, params ) {
				var u = path.parseUrl( url ),
					p = ( typeof params === "object" ) ? $.param( params ) : params,
					s = u.search || "?";
				return u.hrefNoSearch + s + ( s.charAt( s.length - 1 ) !== "?" ? "&" : "" ) + p + ( u.hash || "" );
			},

			convertUrlToDataUrl: function( absUrl ) {
				var u = path.parseUrl( absUrl );
				if ( path.isEmbeddedPage( u ) ) {
				    // For embedded pages, remove the dialog hash key as in getFilePath(),
				    // otherwise the Data Url won't match the id of the embedded Page.
					return u.hash.split( dialogHashKey )[0].replace( /^#/, "" );
				} else if ( path.isSameDomain( u, documentBase ) ) {
					return u.hrefNoHash.replace( documentBase.domain, "" ).split( dialogHashKey )[0];
				}
				return absUrl;
			},

			//get path from current hash, or from a file path
			get: function( newPath ) {
				if( newPath === undefined ) {
					newPath = location.hash;
				}
				return path.stripHash( newPath ).replace( /[^\/]*\.[^\/*]+$/, '' );
			},

			//return the substring of a filepath before the sub-page key, for making a server request
			getFilePath: function( path ) {
				var splitkey = '&' + $.mobile.subPageUrlKey;
				return path && path.split( splitkey )[0].split( dialogHashKey )[0];
			},

			//set location hash to path
			set: function( path ) {
				location.hash = path;
			},

			//test if a given url (string) is a path
			//NOTE might be exceptionally naive
			isPath: function( url ) {
				return ( /\// ).test( url );
			},

			//return a url path with the window's location protocol/hostname/pathname removed
			clean: function( url ) {
				return url.replace( documentBase.domain, "" );
			},

			//just return the url without an initial #
			stripHash: function( url ) {
				return url.replace( /^#/, "" );
			},

			//remove the preceding hash, any query params, and dialog notations
			cleanHash: function( hash ) {
				return path.stripHash( hash.replace( /\?.*$/, "" ).replace( dialogHashKey, "" ) );
			},

			isHashValid: function( hash ) {
				return /^#[^#]+$/.test(hash);
			},

			//check whether a url is referencing the same domain, or an external domain or different protocol
			//could be mailto, etc
			isExternal: function( url ) {
				var u = path.parseUrl( url );
				return u.protocol && u.domain !== documentUrl.domain ? true : false;
			},

			hasProtocol: function( url ) {
				return ( /^(:?\w+:)/ ).test( url );
			},

			//check if the specified url refers to the first page in the main application document.
			isFirstPageUrl: function( url ) {
				// We only deal with absolute paths.
				var u = path.parseUrl( path.makeUrlAbsolute( url, documentBase ) ),

					// Does the url have the same path as the document?
					samePath = u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ),

					// Get the first page element.
					fp = $.mobile.firstPage,

					// Get the id of the first page element if it has one.
					fpId = fp && fp[0] ? fp[0].id : undefined;

					// The url refers to the first page if the path matches the document and
					// it either has no hash value, or the hash is exactly equal to the id of the
					// first page element.
					return samePath && ( !u.hash || u.hash === "#" || ( fpId && u.hash.replace( /^#/, "" ) === fpId ) );
			},

			isEmbeddedPage: function( url ) {
				var u = path.parseUrl( url );

				//if the path is absolute, then we need to compare the url against
				//both the documentUrl and the documentBase. The main reason for this
				//is that links embedded within external documents will refer to the
				//application document, whereas links embedded within the application
				//document will be resolved against the document base.
				if ( u.protocol !== "" ) {
					return ( u.hash && ( u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ) ) );
				}
				return (/^#/).test( u.href );
			},


			// Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
			// requests if the document doing the request was loaded via the file:// protocol.
			// This is usually to allow the application to "phone home" and fetch app specific
			// data. We normally let the browser handle external/cross-domain urls, but if the
			// allowCrossDomainPages option is true, we will allow cross-domain http/https
			// requests to go through our page loading logic.
			isPermittedCrossDomainRequest: function( docUrl, reqUrl ) {
				return $.mobile.allowCrossDomainPages
					&& docUrl.protocol === "file:"
					&& reqUrl.search( /^https?:/ ) != -1;
			}
		},

		//will be defined when a link is clicked and given an active class
		$activeClickedLink = null,

		//urlHistory is purely here to make guesses at whether the back or forward button was clicked
		//and provide an appropriate transition
		urlHistory = {
			// Array of pages that are visited during a single page load.
			// Each has a url and optional transition, title, and pageUrl (which represents the file path, in cases where URL is obscured, such as dialogs)
			stack: [],

			//maintain an index number for the active page in the stack
			activeIndex: 0,

			//get active
			getActive: function() {
				return urlHistory.stack[ urlHistory.activeIndex ];
			},

			getPrev: function() {
				return urlHistory.stack[ urlHistory.activeIndex - 1 ];
			},

			getNext: function() {
				return urlHistory.stack[ urlHistory.activeIndex + 1 ];
			},

			// addNew is used whenever a new page is added
			addNew: function( url, transition, title, pageUrl, role ) {
				//if there's forward history, wipe it
				if( urlHistory.getNext() ) {
					urlHistory.clearForward();
				}

				urlHistory.stack.push( {url : url, transition: transition, title: title, pageUrl: pageUrl, role: role } );

				urlHistory.activeIndex = urlHistory.stack.length - 1;
			},

			//wipe urls ahead of active index
			clearForward: function() {
				urlHistory.stack = urlHistory.stack.slice( 0, urlHistory.activeIndex + 1 );
			},

			directHashChange: function( opts ) {
				var back , forward, newActiveIndex, prev = this.getActive();

				// check if url is in history and if it's ahead or behind current page
				$.each( urlHistory.stack, function( i, historyEntry ) {

					//if the url is in the stack, it's a forward or a back
					if( opts.currentUrl === historyEntry.url ) {
						//define back and forward by whether url is older or newer than current page
						back = i < urlHistory.activeIndex;
						forward = !back;
						newActiveIndex = i;
					}
				});

				// save new page index, null check to prevent falsey 0 result
				this.activeIndex = newActiveIndex !== undefined ? newActiveIndex : this.activeIndex;

				if( back ) {
					( opts.either || opts.isBack )( true );
				} else if( forward ) {
					( opts.either || opts.isForward )( false );
				}
			},

			//disable hashchange event listener internally to ignore one change
			//toggled internally when location.hash is updated to match the url of a successful page load
			ignoreNextHashChange: false
		},

		//define first selector to receive focus when a page is shown
		focusable = "[tabindex],a,button:visible,select:visible,input",

		//queue to hold simultanious page transitions
		pageTransitionQueue = [],

		//indicates whether or not page is in process of transitioning
		isPageTransitioning = false,

		//nonsense hash change key for dialogs, so they create a history entry
		dialogHashKey = "&ui-state=dialog",

		//existing base tag?
		$base = $head.children( "base" ),

		//tuck away the original document URL minus any fragment.
		documentUrl = path.parseUrl( location.href ),

		//if the document has an embedded base tag, documentBase is set to its
		//initial value. If a base tag does not exist, then we default to the documentUrl.
		documentBase = $base.length ? path.parseUrl( path.makeUrlAbsolute( $base.attr( "href" ), documentUrl.href ) ) : documentUrl,

		//cache the comparison once.
		documentBaseDiffers = ( documentUrl.hrefNoHash !== documentBase.hrefNoHash ),

		getScreenHeight = $.mobile.getScreenHeight;

		//base element management, defined depending on dynamic base tag support
		var base = $.support.dynamicBaseTag ? {

			//define base element, for use in routing asset urls that are referenced in Ajax-requested markup
			element: ( $base.length ? $base : $( "<base>", { href: documentBase.hrefNoHash } ).prependTo( $head ) ),

			//set the generated BASE element's href attribute to a new page's base path
			set: function( href ) {
				base.element.attr( "href", path.makeUrlAbsolute( href, documentBase ) );
			},

			//set the generated BASE element's href attribute to a new page's base path
			reset: function() {
				base.element.attr( "href", documentBase.hrefNoHash );
			}

		} : undefined;

/*
	internal utility functions
--------------------------------------*/


	//direct focus to the page title, or otherwise first focusable element
	$.mobile.focusPage = function ( page ) {
		var autofocus = page.find("[autofocus]"),
			pageTitle = page.find( ".ui-title:eq(0)" );

		if( autofocus.length ) {
			autofocus.focus();
			return;
		}

		if( pageTitle.length ) {
			pageTitle.focus();
		}
		else{
			page.focus();
		}
	}

	//remove active classes after page transition or error
	function removeActiveLinkClass( forceRemoval ) {
		if( !!$activeClickedLink && ( !$activeClickedLink.closest( '.ui-page-active' ).length || forceRemoval ) ) {
			$activeClickedLink.removeClass( $.mobile.activeBtnClass );
		}
		$activeClickedLink = null;
	}

	function releasePageTransitionLock() {
		isPageTransitioning = false;
		if( pageTransitionQueue.length > 0 ) {
			$.mobile.changePage.apply( null, pageTransitionQueue.pop() );
		}
	}

	// Save the last scroll distance per page, before it is hidden
	var setLastScrollEnabled = true,
		setLastScroll, delayedSetLastScroll;

	setLastScroll = function() {
		// this barrier prevents setting the scroll value based on the browser
		// scrolling the window based on a hashchange
		if( !setLastScrollEnabled ) {
			return;
		}

		var active = $.mobile.urlHistory.getActive();

		if( active ) {
			var lastScroll = $window.scrollTop();

			// Set active page's lastScroll prop.
			// If the location we're scrolling to is less than minScrollBack, let it go.
			active.lastScroll = lastScroll < $.mobile.minScrollBack ? $.mobile.defaultHomeScroll : lastScroll;
		}
	};

	// bind to scrollstop to gather scroll position. The delay allows for the hashchange
	// event to fire and disable scroll recording in the case where the browser scrolls
	// to the hash targets location (sometimes the top of the page). once pagechange fires
	// getLastScroll is again permitted to operate
	delayedSetLastScroll = function() {
		setTimeout( setLastScroll, 100 );
	};

	// disable an scroll setting when a hashchange has been fired, this only works
	// because the recording of the scroll position is delayed for 100ms after
	// the browser might have changed the position because of the hashchange
	$window.bind( $.support.pushState ? "popstate" : "hashchange", function() {
	 	setLastScrollEnabled = false;
	});

	// handle initial hashchange from chrome :(
	$window.one( $.support.pushState ? "popstate" : "hashchange", function() {
		setLastScrollEnabled = true;
	});

	// wait until the mobile page container has been determined to bind to pagechange
	$window.one( "pagecontainercreate", function(){
		// once the page has changed, re-enable the scroll recording
		$.mobile.pageContainer.bind( "pagechange", function() {

	 		setLastScrollEnabled = true;

			// remove any binding that previously existed on the get scroll
			// which may or may not be different than the scroll element determined for
			// this page previously
			$window.unbind( "scrollstop", delayedSetLastScroll );

			// determine and bind to the current scoll element which may be the window
			// or in the case of touch overflow the element with touch overflow
			$window.bind( "scrollstop", delayedSetLastScroll );
		});
	});

	// bind to scrollstop for the first page as "pagechange" won't be fired in that case
	$window.bind( "scrollstop", delayedSetLastScroll );

	//function for transitioning between two existing pages
	function transitionPages( toPage, fromPage, transition, reverse ) {

		if( fromPage ) {
			//trigger before show/hide events
			fromPage.data( "page" )._trigger( "beforehide", null, { nextPage: toPage } );
		}

		toPage.data( "page" )._trigger( "beforeshow", null, { prevPage: fromPage || $( "" ) } );

		//clear page loader
		$.mobile.hidePageLoadingMsg();

		// If transition is defined, check if css 3D transforms are supported, and if not, if a fallback is specified
		if( transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[ transition ] ){
			transition = $.mobile.transitionFallbacks[ transition ];
		}

		//find the transition handler for the specified transition. If there
		//isn't one in our transitionHandlers dictionary, use the default one.
		//call the handler immediately to kick-off the transition.
		var th = $.mobile.transitionHandlers[ transition || "default" ] || $.mobile.defaultTransitionHandler,
			promise = th( transition, reverse, toPage, fromPage );

		promise.done(function() {

			//trigger show/hide events
			if( fromPage ) {
				fromPage.data( "page" )._trigger( "hide", null, { nextPage: toPage } );
			}

			//trigger pageshow, define prevPage as either fromPage or empty jQuery obj
			toPage.data( "page" )._trigger( "show", null, { prevPage: fromPage || $( "" ) } );
		});

		return promise;
	}

	//simply set the active page's minimum height to screen height, depending on orientation
	function resetActivePageHeight(){
		var aPage = $( "." + $.mobile.activePageClass ),
			aPagePadT = parseFloat( aPage.css( "padding-top" ) ),
			aPagePadB = parseFloat( aPage.css( "padding-bottom" ) ),
			aPageBorderT = parseFloat( aPage.css( "border-top-width" ) ),
			aPageBorderB = parseFloat( aPage.css( "border-bottom-width" ) );

		aPage.css( "min-height", getScreenHeight() - aPagePadT - aPagePadB - aPageBorderT - aPageBorderB );
	}

	//shared page enhancements
	function enhancePage( $page, role ) {
		// If a role was specified, make sure the data-role attribute
		// on the page element is in sync.
		if( role ) {
			$page.attr( "data-" + $.mobile.ns + "role", role );
		}

		//run page plugin
		$page.page();
	}

/* exposed $.mobile methods	 */

	//animation complete callback
	$.fn.animationComplete = function( callback ) {
		if( $.support.cssTransitions ) {
			return $( this ).one( 'webkitAnimationEnd animationend', callback );
		}
		else{
			// defer execution for consistency between webkit/non webkit
			setTimeout( callback, 0 );
			return $( this );
		}
	};

	//expose path object on $.mobile
	$.mobile.path = path;

	//expose base object on $.mobile
	$.mobile.base = base;

	//history stack
	$.mobile.urlHistory = urlHistory;

	$.mobile.dialogHashKey = dialogHashKey;



	//enable cross-domain page support
	$.mobile.allowCrossDomainPages = false;

	//return the original document url
	$.mobile.getDocumentUrl = function(asParsedObject) {
		return asParsedObject ? $.extend( {}, documentUrl ) : documentUrl.href;
	};

	//return the original document base url
	$.mobile.getDocumentBase = function(asParsedObject) {
		return asParsedObject ? $.extend( {}, documentBase ) : documentBase.href;
	};

	$.mobile._bindPageRemove = function() {
		var page = $(this);

		// when dom caching is not enabled or the page is embedded bind to remove the page on hide
		if( !page.data("page").options.domCache
				&& page.is(":jqmData(external-page='true')") ) {

			page.bind( 'pagehide.remove', function() {
				var $this = $( this ),
					prEvent = new $.Event( "pageremove" );

				$this.trigger( prEvent );

				if( !prEvent.isDefaultPrevented() ){
					$this.removeWithDependents();
				}
			});
		}
	};

	// Load a page into the DOM.
	$.mobile.loadPage = function( url, options ) {
		// This function uses deferred notifications to let callers
		// know when the page is done loading, or if an error has occurred.
		var deferred = $.Deferred(),

			// The default loadPage options with overrides specified by
			// the caller.
			settings = $.extend( {}, $.mobile.loadPage.defaults, options ),

			// The DOM element for the page after it has been loaded.
			page = null,

			// If the reloadPage option is true, and the page is already
			// in the DOM, dupCachedPage will be set to the page element
			// so that it can be removed after the new version of the
			// page is loaded off the network.
			dupCachedPage = null,

			// determine the current base url
			findBaseWithDefault = function(){
				var closestBase = ( $.mobile.activePage && getClosestBaseUrl( $.mobile.activePage ) );
				return closestBase || documentBase.hrefNoHash;
			},

			// The absolute version of the URL passed into the function. This
			// version of the URL may contain dialog/subpage params in it.
			absUrl = path.makeUrlAbsolute( url, findBaseWithDefault() );


		// If the caller provided data, and we're using "get" request,
		// append the data to the URL.
		if ( settings.data && settings.type === "get" ) {
			absUrl = path.addSearchParams( absUrl, settings.data );
			settings.data = undefined;
		}

		// If the caller is using a "post" request, reloadPage must be true
		if(  settings.data && settings.type === "post" ){
			settings.reloadPage = true;
		}

			// The absolute version of the URL minus any dialog/subpage params.
			// In otherwords the real URL of the page to be loaded.
		var fileUrl = path.getFilePath( absUrl ),

			// The version of the Url actually stored in the data-url attribute of
			// the page. For embedded pages, it is just the id of the page. For pages
			// within the same domain as the document base, it is the site relative
			// path. For cross-domain pages (Phone Gap only) the entire absolute Url
			// used to load the page.
			dataUrl = path.convertUrlToDataUrl( absUrl );

		// Make sure we have a pageContainer to work with.
		settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

		// Check to see if the page already exists in the DOM.
		page = settings.pageContainer.children( ":jqmData(url='" + dataUrl + "')" );

		// If we failed to find the page, check to see if the url is a
		// reference to an embedded page. If so, it may have been dynamically
		// injected by a developer, in which case it would be lacking a data-url
		// attribute and in need of enhancement.
		if ( page.length === 0 && dataUrl && !path.isPath( dataUrl ) ) {
			page = settings.pageContainer.children( "#" + dataUrl )
				.attr( "data-" + $.mobile.ns + "url", dataUrl );
		}

		// If we failed to find a page in the DOM, check the URL to see if it
		// refers to the first page in the application. If it isn't a reference
		// to the first page and refers to non-existent embedded page, error out.
		if ( page.length === 0 ) {
			if ( $.mobile.firstPage && path.isFirstPageUrl( fileUrl ) ) {
				// Check to make sure our cached-first-page is actually
				// in the DOM. Some user deployed apps are pruning the first
				// page from the DOM for various reasons, we check for this
				// case here because we don't want a first-page with an id
				// falling through to the non-existent embedded page error
				// case. If the first-page is not in the DOM, then we let
				// things fall through to the ajax loading code below so
				// that it gets reloaded.
				if ( $.mobile.firstPage.parent().length ) {
					page = $( $.mobile.firstPage );
				}
			} else if ( path.isEmbeddedPage( fileUrl )  ) {
				deferred.reject( absUrl, options );
				return deferred.promise();
			}
		}

		// Reset base to the default document base.
		if ( base ) {
			base.reset();
		}

		// If the page we are interested in is already in the DOM,
		// and the caller did not indicate that we should force a
		// reload of the file, we are done. Otherwise, track the
		// existing page as a duplicated.
		if ( page.length ) {
			if ( !settings.reloadPage ) {
				enhancePage( page, settings.role );
				deferred.resolve( absUrl, options, page );
				return deferred.promise();
			}
			dupCachedPage = page;
		}

		var mpc = settings.pageContainer,
			pblEvent = new $.Event( "pagebeforeload" ),
			triggerData = { url: url, absUrl: absUrl, dataUrl: dataUrl, deferred: deferred, options: settings };

		// Let listeners know we're about to load a page.
		mpc.trigger( pblEvent, triggerData );

		// If the default behavior is prevented, stop here!
		if( pblEvent.isDefaultPrevented() ){
			return deferred.promise();
		}

		if ( settings.showLoadMsg ) {

			// This configurable timeout allows cached pages a brief delay to load without showing a message
			var loadMsgDelay = setTimeout(function(){
					$.mobile.showPageLoadingMsg();
				}, settings.loadMsgDelay ),

				// Shared logic for clearing timeout and removing message.
				hideMsg = function(){

					// Stop message show timer
					clearTimeout( loadMsgDelay );

					// Hide loading message
					$.mobile.hidePageLoadingMsg();
				};
		}

		if ( !( $.mobile.allowCrossDomainPages || path.isSameDomain( documentUrl, absUrl ) ) ) {
			deferred.reject( absUrl, options );
		} else {
			// Load the new page.
			$.ajax({
				url: fileUrl,
				type: settings.type,
				data: settings.data,
				dataType: "html",
				success: function( html, textStatus, xhr ) {
					//pre-parse html to check for a data-url,
					//use it as the new fileUrl, base path, etc
					var all = $( "<div></div>" ),

						//page title regexp
						newPageTitle = html.match( /<title[^>]*>([^<]*)/ ) && RegExp.$1,

						// TODO handle dialogs again
						pageElemRegex = new RegExp( "(<[^>]+\\bdata-" + $.mobile.ns + "role=[\"']?page[\"']?[^>]*>)" ),
						dataUrlRegex = new RegExp( "\\bdata-" + $.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?" );


					// data-url must be provided for the base tag so resource requests can be directed to the
					// correct url. loading into a temprorary element makes these requests immediately
					if( pageElemRegex.test( html )
							&& RegExp.$1
							&& dataUrlRegex.test( RegExp.$1 )
							&& RegExp.$1 ) {
						url = fileUrl = path.getFilePath( RegExp.$1 );
					}

					if ( base ) {
						base.set( fileUrl );
					}

					//workaround to allow scripts to execute when included in page divs
					all.get( 0 ).innerHTML = html;
					page = all.find( ":jqmData(role='page'), :jqmData(role='dialog')" ).first();

					//if page elem couldn't be found, create one and insert the body element's contents
					if( !page.length ){
						page = $( "<div data-" + $.mobile.ns + "role='page'>" + html.split( /<\/?body[^>]*>/gmi )[1] + "</div>" );
					}

					if ( newPageTitle && !page.jqmData( "title" ) ) {
						if ( ~newPageTitle.indexOf( "&" ) ) {
							newPageTitle = $( "<div>" + newPageTitle + "</div>" ).text();
						}
						page.jqmData( "title", newPageTitle );
					}

					//rewrite src and href attrs to use a base url
					if( !$.support.dynamicBaseTag ) {
						var newPath = path.get( fileUrl );
						page.find( "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]" ).each(function() {
							var thisAttr = $( this ).is( '[href]' ) ? 'href' :
									$(this).is('[src]') ? 'src' : 'action',
								thisUrl = $( this ).attr( thisAttr );

							// XXX_jblas: We need to fix this so that it removes the document
							//            base URL, and then prepends with the new page URL.
							//if full path exists and is same, chop it - helps IE out
							thisUrl = thisUrl.replace( location.protocol + '//' + location.host + location.pathname, '' );

							if( !/^(\w+:|#|\/)/.test( thisUrl ) ) {
								$( this ).attr( thisAttr, newPath + thisUrl );
							}
						});
					}

					//append to page and enhance
					// TODO taging a page with external to make sure that embedded pages aren't removed
					//      by the various page handling code is bad. Having page handling code in many
					//      places is bad. Solutions post 1.0
					page
						.attr( "data-" + $.mobile.ns + "url", path.convertUrlToDataUrl( fileUrl ) )
						.attr( "data-" + $.mobile.ns + "external-page", true )
						.appendTo( settings.pageContainer );

					// wait for page creation to leverage options defined on widget
					page.one( 'pagecreate', $.mobile._bindPageRemove );

					enhancePage( page, settings.role );

					// Enhancing the page may result in new dialogs/sub pages being inserted
					// into the DOM. If the original absUrl refers to a sub-page, that is the
					// real page we are interested in.
					if ( absUrl.indexOf( "&" + $.mobile.subPageUrlKey ) > -1 ) {
						page = settings.pageContainer.children( ":jqmData(url='" + dataUrl + "')" );
					}

					//bind pageHide to removePage after it's hidden, if the page options specify to do so

					// Remove loading message.
					if ( settings.showLoadMsg ) {
						hideMsg();
					}

					// Add the page reference and xhr to our triggerData.
					triggerData.xhr = xhr;
					triggerData.textStatus = textStatus;
					triggerData.page = page;

					// Let listeners know the page loaded successfully.
					settings.pageContainer.trigger( "pageload", triggerData );

					deferred.resolve( absUrl, options, page, dupCachedPage );
				},
				error: function( xhr, textStatus, errorThrown ) {
					//set base back to current path
					if( base ) {
						base.set( path.get() );
					}

					// Add error info to our triggerData.
					triggerData.xhr = xhr;
					triggerData.textStatus = textStatus;
					triggerData.errorThrown = errorThrown;

					var plfEvent = new $.Event( "pageloadfailed" );

					// Let listeners know the page load failed.
					settings.pageContainer.trigger( plfEvent, triggerData );

					// If the default behavior is prevented, stop here!
					// Note that it is the responsibility of the listener/handler
					// that called preventDefault(), to resolve/reject the
					// deferred object within the triggerData.
					if( plfEvent.isDefaultPrevented() ){
						return;
					}

					// Remove loading message.
					if ( settings.showLoadMsg ) {

						// Remove loading message.
						hideMsg();

						// show error message
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

						// hide after delay
						setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
					}

					deferred.reject( absUrl, options );
				}
			});
		}

		return deferred.promise();
	};

	$.mobile.loadPage.defaults = {
		type: "get",
		data: undefined,
		reloadPage: false,
		role: undefined, // By default we rely on the role defined by the @data-role attribute.
		showLoadMsg: false,
		pageContainer: undefined,
		loadMsgDelay: 50 // This delay allows loads that pull from browser cache to occur without showing the loading message.
	};

	// Show a specific page in the page container.
	$.mobile.changePage = function( toPage, options ) {
		// If we are in the midst of a transition, queue the current request.
		// We'll call changePage() once we're done with the current transition to
		// service the request.
		if( isPageTransitioning ) {
			pageTransitionQueue.unshift( arguments );
			return;
		}

		var settings = $.extend( {}, $.mobile.changePage.defaults, options );

		// Make sure we have a pageContainer to work with.
		settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

		// Make sure we have a fromPage.
		settings.fromPage = settings.fromPage || $.mobile.activePage;

		var mpc = settings.pageContainer,
			pbcEvent = new $.Event( "pagebeforechange" ),
			triggerData = { toPage: toPage, options: settings };

		// Let listeners know we're about to change the current page.
		mpc.trigger( pbcEvent, triggerData );

		// If the default behavior is prevented, stop here!
		if( pbcEvent.isDefaultPrevented() ){
			return;
		}

		// We allow "pagebeforechange" observers to modify the toPage in the trigger
		// data to allow for redirects. Make sure our toPage is updated.

		toPage = triggerData.toPage;

		// Set the isPageTransitioning flag to prevent any requests from
		// entering this method while we are in the midst of loading a page
		// or transitioning.

		isPageTransitioning = true;

		// If the caller passed us a url, call loadPage()
		// to make sure it is loaded into the DOM. We'll listen
		// to the promise object it returns so we know when
		// it is done loading or if an error ocurred.
		if ( typeof toPage == "string" ) {
			$.mobile.loadPage( toPage, settings )
				.done(function( url, options, newPage, dupCachedPage ) {
					isPageTransitioning = false;
					options.duplicateCachedPage = dupCachedPage;
					$.mobile.changePage( newPage, options );
				})
				.fail(function( url, options ) {
					isPageTransitioning = false;

					//clear out the active button state
					removeActiveLinkClass( true );

					//release transition lock so navigation is free again
					releasePageTransitionLock();
					settings.pageContainer.trigger( "pagechangefailed", triggerData );
				});
			return;
		}

		// If we are going to the first-page of the application, we need to make
		// sure settings.dataUrl is set to the application document url. This allows
		// us to avoid generating a document url with an id hash in the case where the
		// first-page of the document has an id attribute specified.
		if ( toPage[ 0 ] === $.mobile.firstPage[ 0 ] && !settings.dataUrl ) {
			settings.dataUrl = documentUrl.hrefNoHash;
		}

		// The caller passed us a real page DOM element. Update our
		// internal state and then trigger a transition to the page.
		var fromPage = settings.fromPage,
			url = ( settings.dataUrl && path.convertUrlToDataUrl( settings.dataUrl ) ) || toPage.jqmData( "url" ),
			// The pageUrl var is usually the same as url, except when url is obscured as a dialog url. pageUrl always contains the file path
			pageUrl = url,
			fileUrl = path.getFilePath( url ),
			active = urlHistory.getActive(),
			activeIsInitialPage = urlHistory.activeIndex === 0,
			historyDir = 0,
			pageTitle = document.title,
			isDialog = settings.role === "dialog" || toPage.jqmData( "role" ) === "dialog";

		// By default, we prevent changePage requests when the fromPage and toPage
		// are the same element, but folks that generate content manually/dynamically
		// and reuse pages want to be able to transition to the same page. To allow
		// this, they will need to change the default value of allowSamePageTransition
		// to true, *OR*, pass it in as an option when they manually call changePage().
		// It should be noted that our default transition animations assume that the
		// formPage and toPage are different elements, so they may behave unexpectedly.
		// It is up to the developer that turns on the allowSamePageTransitiona option
		// to either turn off transition animations, or make sure that an appropriate
		// animation transition is used.
		if( fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition ) {
			isPageTransitioning = false;
			mpc.trigger( "pagechange", triggerData );

			// Even if there is no page change to be done, we should keep the urlHistory in sync with the hash changes
			if( settings.fromHashChange ) {
				urlHistory.directHashChange({
					currentUrl:	url,
					isBack:		function() {},
					isForward:	function() {}
				});
			}

			return;
		}

		// We need to make sure the page we are given has already been enhanced.
		enhancePage( toPage, settings.role );

		// If the changePage request was sent from a hashChange event, check to see if the
		// page is already within the urlHistory stack. If so, we'll assume the user hit
		// the forward/back button and will try to match the transition accordingly.
		if( settings.fromHashChange ) {
			urlHistory.directHashChange({
				currentUrl:	url,
				isBack:		function() { historyDir = -1; },
				isForward:	function() { historyDir = 1; }
			});
		}

		// Kill the keyboard.
		// XXX_jblas: We need to stop crawling the entire document to kill focus. Instead,
		//            we should be tracking focus with a delegate() handler so we already have
		//            the element in hand at this point.
		// Wrap this in a try/catch block since IE9 throw "Unspecified error" if document.activeElement
		// is undefined when we are in an IFrame.
		try {
			if(document.activeElement && document.activeElement.nodeName.toLowerCase() != 'body') {
				$(document.activeElement).blur();
			} else {
				$( "input:focus, textarea:focus, select:focus" ).blur();
			}
		} catch(e) {}

		// Record whether we are at a place in history where a dialog used to be - if so, do not add a new history entry and do not change the hash either
		var alreadyThere = false;

		// If we're displaying the page as a dialog, we don't want the url
		// for the dialog content to be used in the hash. Instead, we want
		// to append the dialogHashKey to the url of the current page.
		if ( isDialog && active ) {
			// on the initial page load active.url is undefined and in that case should
			// be an empty string. Moving the undefined -> empty string back into
			// urlHistory.addNew seemed imprudent given undefined better represents
			// the url state

			// If we are at a place in history that once belonged to a dialog, reuse
			// this state without adding to urlHistory and without modifying the hash.
			// However, if a dialog is already displayed at this point, and we're
			// about to display another dialog, then we must add another hash and
			// history entry on top so that one may navigate back to the original dialog
			if ( active.url.indexOf( dialogHashKey ) > -1 && !$.mobile.activePage.is( ".ui-dialog" ) ) {
				settings.changeHash = false;
				alreadyThere = true;
			}

			url = ( active.url || "" ) + dialogHashKey;

			// tack on another dialogHashKey if this is the same as the initial hash
			// this makes sure that a history entry is created for this dialog
			if ( urlHistory.activeIndex === 0 && url === urlHistory.initialDst ) {
				url += dialogHashKey;
			}
		}

		// Set the location hash.
		if( settings.changeHash !== false && url ) {
			//disable hash listening temporarily
			urlHistory.ignoreNextHashChange = true;
			//update hash and history
			path.set( url );
		}

		// if title element wasn't found, try the page div data attr too
		// If this is a deep-link or a reload ( active === undefined ) then just use pageTitle
		var newPageTitle = ( !active )? pageTitle : toPage.jqmData( "title" ) || toPage.children(":jqmData(role='header')").find(".ui-title" ).getEncodedText();
		if( !!newPageTitle && pageTitle == document.title ) {
			pageTitle = newPageTitle;
		}
		if ( !toPage.jqmData( "title" ) ) {
			toPage.jqmData( "title", pageTitle );
		}

		// Make sure we have a transition defined.
		settings.transition = settings.transition
			|| ( ( historyDir && !activeIsInitialPage ) ? active.transition : undefined )
			|| ( isDialog ? $.mobile.defaultDialogTransition : $.mobile.defaultPageTransition );

		//add page to history stack if it's not back or forward
		if( !historyDir && !alreadyThere ) {
			urlHistory.addNew( url, settings.transition, pageTitle, pageUrl, settings.role );
		}

		//set page title
		document.title = urlHistory.getActive().title;

		//set "toPage" as activePage
		$.mobile.activePage = toPage;

		// If we're navigating back in the URL history, set reverse accordingly.
		settings.reverse = settings.reverse || historyDir < 0;

		transitionPages( toPage, fromPage, settings.transition, settings.reverse )
			.done(function( name, reverse, $to, $from, alreadyFocused ) {
				removeActiveLinkClass();

				//if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
				if ( settings.duplicateCachedPage ) {
					settings.duplicateCachedPage.remove();
				}

				// Send focus to the newly shown page. Moved from promise .done binding in transitionPages
				// itself to avoid ie bug that reports offsetWidth as > 0 (core check for visibility)
				// despite visibility: hidden addresses issue #2965
				// https://github.com/jquery/jquery-mobile/issues/2965
				if( !alreadyFocused ){
					$.mobile.focusPage( toPage );
				}

				releasePageTransitionLock();

				// Let listeners know we're all done changing the current page.
				mpc.trigger( "pagechange", triggerData );
			});
	};

	$.mobile.changePage.defaults = {
		transition: undefined,
		reverse: false,
		changeHash: true,
		fromHashChange: false,
		role: undefined, // By default we rely on the role defined by the @data-role attribute.
		duplicateCachedPage: undefined,
		pageContainer: undefined,
		showLoadMsg: true, //loading message shows by default when pages are being fetched during changePage
		dataUrl: undefined,
		fromPage: undefined,
		allowSamePageTransition: false
	};

/* Event Bindings - hashchange, submit, and click */
	function findClosestLink( ele )
	{
		while ( ele ) {
			// Look for the closest element with a nodeName of "a".
			// Note that we are checking if we have a valid nodeName
			// before attempting to access it. This is because the
			// node we get called with could have originated from within
			// an embedded SVG document where some symbol instance elements
			// don't have nodeName defined on them, or strings are of type
			// SVGAnimatedString.
			if ( ( typeof ele.nodeName === "string" ) && ele.nodeName.toLowerCase() == "a" ) {
				break;
			}
			ele = ele.parentNode;
		}
		return ele;
	}

	// The base URL for any given element depends on the page it resides in.
	function getClosestBaseUrl( ele )
	{
		// Find the closest page and extract out its url.
		var url = $( ele ).closest( ".ui-page" ).jqmData( "url" ),
			base = documentBase.hrefNoHash;

		if ( !url || !path.isPath( url ) ) {
			url = base;
		}

		return path.makeUrlAbsolute( url, base);
	}

	//The following event bindings should be bound after mobileinit has been triggered
	//the following deferred is resolved in the init file
	$.mobile.navreadyDeferred = $.Deferred();
	$.mobile.navreadyDeferred.done( function(){
		//bind to form submit events, handle with Ajax
		$( document ).delegate( "form", "submit", function( event ) {
			var $this = $( this );

			if( !$.mobile.ajaxEnabled ||
					// test that the form is, itself, ajax false
					$this.is(":jqmData(ajax='false')") ||
					// test that $.mobile.ignoreContentEnabled is set and
					// the form or one of it's parents is ajax=false
					!$this.jqmHijackable().length ) {
				return;
			}

			var type = $this.attr( "method" ),
				target = $this.attr( "target" ),
				url = $this.attr( "action" );

			// If no action is specified, browsers default to using the
			// URL of the document containing the form. Since we dynamically
			// pull in pages from external documents, the form should submit
			// to the URL for the source document of the page containing
			// the form.
			if ( !url ) {
				// Get the @data-url for the page containing the form.
				url = getClosestBaseUrl( $this );
				if ( url === documentBase.hrefNoHash ) {
					// The url we got back matches the document base,
					// which means the page must be an internal/embedded page,
					// so default to using the actual document url as a browser
					// would.
					url = documentUrl.hrefNoSearch;
				}
			}

			url = path.makeUrlAbsolute(  url, getClosestBaseUrl($this) );

			if(( path.isExternal( url ) && !path.isPermittedCrossDomainRequest(documentUrl, url)) || target ) {
				return;
			}

			$.mobile.changePage(
				url,
				{
					type:		type && type.length && type.toLowerCase() || "get",
					data:		$this.serialize(),
					transition:	$this.jqmData( "transition" ),
					direction:	$this.jqmData( "direction" ),
					reloadPage:	true
				}
			);
			event.preventDefault();
		});

		//add active state on vclick
		$( document ).bind( "vclick", function( event ) {
			// if this isn't a left click we don't care. Its important to note
			// that when the virtual event is generated it will create the which attr
			if ( event.which > 1 || !$.mobile.linkBindingEnabled ) {
				return;
			}

			var link = findClosestLink( event.target );

			// split from the previous return logic to avoid find closest where possible
			// TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
			// can be avoided
			if ( !$(link).jqmHijackable().length ) {
				return;
			}

			if ( link ) {
				if ( path.parseUrl( link.getAttribute( "href" ) || "#" ).hash !== "#" ) {
					removeActiveLinkClass( true );
					$activeClickedLink = $( link ).closest( ".ui-btn" ).not( ".ui-disabled" );
					$activeClickedLink.addClass( $.mobile.activeBtnClass );
				}
			}
		});

		// click routing - direct to HTTP or Ajax, accordingly
		$( document ).bind( "click", function( event ) {
			if( !$.mobile.linkBindingEnabled ){
				return;
			}

			var link = findClosestLink( event.target ), $link = $( link ), httpCleanup;

			// If there is no link associated with the click or its not a left
			// click we want to ignore the click
			// TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
			// can be avoided
			if ( !link || event.which > 1 || !$link.jqmHijackable().length ) {
				return;
			}

			//remove active link class if external (then it won't be there if you come back)
			httpCleanup = function(){
				window.setTimeout( function() { removeActiveLinkClass( true ); }, 200 );
			};

			//if there's a data-rel=back attr, go back in history
			if( $link.is( ":jqmData(rel='back')" ) ) {
				window.history.back();
				return false;
			}

			var baseUrl = getClosestBaseUrl( $link ),

				//get href, if defined, otherwise default to empty hash
				href = path.makeUrlAbsolute( $link.attr( "href" ) || "#", baseUrl );

			//if ajax is disabled, exit early
			if( !$.mobile.ajaxEnabled && !path.isEmbeddedPage( href ) ){
				httpCleanup();
				//use default click handling
				return;
			}

			// XXX_jblas: Ideally links to application pages should be specified as
			//            an url to the application document with a hash that is either
			//            the site relative path or id to the page. But some of the
			//            internal code that dynamically generates sub-pages for nested
			//            lists and select dialogs, just write a hash in the link they
			//            create. This means the actual URL path is based on whatever
			//            the current value of the base tag is at the time this code
			//            is called. For now we are just assuming that any url with a
			//            hash in it is an application page reference.
			if ( href.search( "#" ) != -1 ) {
				href = href.replace( /[^#]*#/, "" );
				if ( !href ) {
					//link was an empty hash meant purely
					//for interaction, so we ignore it.
					event.preventDefault();
					return;
				} else if ( path.isPath( href ) ) {
					//we have apath so make it the href we want to load.
					href = path.makeUrlAbsolute( href, baseUrl );
				} else {
					//we have a simple id so use the documentUrl as its base.
					href = path.makeUrlAbsolute( "#" + href, documentUrl.hrefNoHash );
				}
			}

				// Should we handle this link, or let the browser deal with it?
			var useDefaultUrlHandling = $link.is( "[rel='external']" ) || $link.is( ":jqmData(ajax='false')" ) || $link.is( "[target]" ),

				// Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
				// requests if the document doing the request was loaded via the file:// protocol.
				// This is usually to allow the application to "phone home" and fetch app specific
				// data. We normally let the browser handle external/cross-domain urls, but if the
				// allowCrossDomainPages option is true, we will allow cross-domain http/https
				// requests to go through our page loading logic.

				//check for protocol or rel and its not an embedded page
				//TODO overlap in logic from isExternal, rel=external check should be
				//     moved into more comprehensive isExternalLink
				isExternal = useDefaultUrlHandling || ( path.isExternal( href ) && !path.isPermittedCrossDomainRequest(documentUrl, href) );

			if( isExternal ) {
				httpCleanup();
				//use default click handling
				return;
			}

			//use ajax
			var transition = $link.jqmData( "transition" ),
				direction = $link.jqmData( "direction" ),
				reverse = ( direction && direction === "reverse" ) ||
							// deprecated - remove by 1.0
							$link.jqmData( "back" ),

				//this may need to be more specific as we use data-rel more
				role = $link.attr( "data-" + $.mobile.ns + "rel" ) || undefined;

			$.mobile.changePage( href, { transition: transition, reverse: reverse, role: role } );
			event.preventDefault();
		});

		//prefetch pages when anchors with data-prefetch are encountered
		$( document ).delegate( ".ui-page", "pageshow.prefetch", function() {
			var urls = [];
			$( this ).find( "a:jqmData(prefetch)" ).each(function(){
				var $link = $(this),
					url = $link.attr( "href" );

				if ( url && $.inArray( url, urls ) === -1 ) {
					urls.push( url );

					$.mobile.loadPage( url, {role: $link.attr("data-" + $.mobile.ns + "rel")} );
				}
			});
		});

		$.mobile._handleHashChange = function( hash ) {
			//find first page via hash
			var to = path.stripHash( hash ),
				//transition is false if it's the first page, undefined otherwise (and may be overridden by default)
				transition = $.mobile.urlHistory.stack.length === 0 ? "none" : undefined,

				// default options for the changPage calls made after examining the current state
				// of the page and the hash
				changePageOptions = {
					transition: transition,
					changeHash: false,
					fromHashChange: true
				};

			if ( 0 === urlHistory.stack.length ) {
				urlHistory.initialDst = to;
			}

			//if listening is disabled (either globally or temporarily), or it's a dialog hash
			if( !$.mobile.hashListeningEnabled || urlHistory.ignoreNextHashChange ) {
				urlHistory.ignoreNextHashChange = false;
				return;
			}

			// special case for dialogs
			if( urlHistory.stack.length > 1 && to.indexOf( dialogHashKey ) > -1 && urlHistory.initialDst !== to ) {

				// If current active page is not a dialog skip the dialog and continue
				// in the same direction
				if(!$.mobile.activePage.is( ".ui-dialog" )) {
					//determine if we're heading forward or backward and continue accordingly past
					//the current dialog
					urlHistory.directHashChange({
						currentUrl: to,
						isBack: function() { window.history.back(); },
						isForward: function() { window.history.forward(); }
					});

					// prevent changePage()
					return;
				} else {
					// if the current active page is a dialog and we're navigating
					// to a dialog use the dialog objected saved in the stack
					urlHistory.directHashChange({
						currentUrl: to,

						// regardless of the direction of the history change
						// do the following
						either: function( isBack ) {
							var active = $.mobile.urlHistory.getActive();

							to = active.pageUrl;

							// make sure to set the role, transition and reversal
							// as most of this is lost by the domCache cleaning
							$.extend( changePageOptions, {
								role: active.role,
								transition:	 active.transition,
								reverse: isBack
							});
						}
					});
				}
			}

			//if to is defined, load it
			if ( to ) {
				// At this point, 'to' can be one of 3 things, a cached page element from
				// a history stack entry, an id, or site-relative/absolute URL. If 'to' is
				// an id, we need to resolve it against the documentBase, not the location.href,
				// since the hashchange could've been the result of a forward/backward navigation
				// that crosses from an external page/dialog to an internal page/dialog.
				to = ( typeof to === "string" && !path.isPath( to ) ) ? ( path.makeUrlAbsolute( '#' + to, documentBase ) ) : to;
				$.mobile.changePage( to, changePageOptions );
			}	else {
				//there's no hash, go to the first page in the dom
				$.mobile.changePage( $.mobile.firstPage, changePageOptions );
			}
		};

		//hashchange event handler
		$window.bind( "hashchange", function( e, triggered ) {
			$.mobile._handleHashChange( location.hash );
		});

		//set page min-heights to be device specific
		$( document ).bind( "pageshow", resetActivePageHeight );
		$( window ).bind( "throttledresize", resetActivePageHeight );

	});//navreadyDeferred done callback

})( jQuery );

( function( $, window ) {
	// For now, let's Monkeypatch this onto the end of $.mobile._registerInternalEvents
	// Scope self to pushStateHandler so we can reference it sanely within the
	// methods handed off as event handlers
	var	pushStateHandler = {},
		self = pushStateHandler,
		$win = $( window ),
		url = $.mobile.path.parseUrl( location.href ),
		mobileinitDeferred = $.Deferred(),
		domreadyDeferred = $.Deferred();

	$( document ).ready( $.proxy( domreadyDeferred, "resolve" ) );

	$( document ).one( "mobileinit", $.proxy( mobileinitDeferred, "resolve" ) );

	$.extend( pushStateHandler, {
		// TODO move to a path helper, this is rather common functionality
		initialFilePath: (function() {
			return url.pathname + url.search;
		})(),

		hashChangeTimeout: 200,

		hashChangeEnableTimer: undefined,

		initialHref: url.hrefNoHash,

		state: function() {
			return {
				hash: location.hash || "#" + self.initialFilePath,
				title: document.title,

				// persist across refresh
				initialHref: self.initialHref
			};
		},

		resetUIKeys: function( url ) {
			var dialog = $.mobile.dialogHashKey,
				subkey = "&" + $.mobile.subPageUrlKey,
				dialogIndex = url.indexOf( dialog );

			if( dialogIndex > -1 ) {
				url = url.slice( 0, dialogIndex ) + "#" + url.slice( dialogIndex );
			} else if( url.indexOf( subkey ) > -1 ) {
				url = url.split( subkey ).join( "#" + subkey );
			}

			return url;
		},

		// TODO sort out a single barrier to hashchange functionality
		nextHashChangePrevented: function( value ) {
			$.mobile.urlHistory.ignoreNextHashChange = value;
			self.onHashChangeDisabled = value;
		},

		// on hash change we want to clean up the url
		// NOTE this takes place *after* the vanilla navigation hash change
		// handling has taken place and set the state of the DOM
		onHashChange: function( e ) {
			// disable this hash change
			if( self.onHashChangeDisabled ){
				return;
			}

			var href, state,
				hash = location.hash,
				isPath = $.mobile.path.isPath( hash ),
				resolutionUrl = isPath ? location.href : $.mobile.getDocumentUrl();

			hash = isPath ? hash.replace( "#", "" ) : hash;


			// propulate the hash when its not available
			state = self.state();

			// make the hash abolute with the current href
			href = $.mobile.path.makeUrlAbsolute( hash, resolutionUrl );

			if ( isPath ) {
				href = self.resetUIKeys( href );
			}

			// replace the current url with the new href and store the state
			// Note that in some cases we might be replacing an url with the
			// same url. We do this anyways because we need to make sure that
			// all of our history entries have a state object associated with
			// them. This allows us to work around the case where window.history.back()
			// is called to transition from an external page to an embedded page.
			// In that particular case, a hashchange event is *NOT* generated by the browser.
			// Ensuring each history entry has a state object means that onPopState()
			// will always trigger our hashchange callback even when a hashchange event
			// is not fired.
			history.replaceState( state, document.title, href );
		},

		// on popstate (ie back or forward) we need to replace the hash that was there previously
		// cleaned up by the additional hash handling
		onPopState: function( e ) {
			var poppedState = e.originalEvent.state,
				fromHash, toHash, hashChanged;

			// if there's no state its not a popstate we care about, eg chrome's initial popstate
			if( poppedState ) {
				// if we get two pop states in under this.hashChangeTimeout
				// make sure to clear any timer set for the previous change
				clearTimeout( self.hashChangeEnableTimer );

				// make sure to enable hash handling for the the _handleHashChange call
				self.nextHashChangePrevented( false );

				// change the page based on the hash in the popped state
				$.mobile._handleHashChange( poppedState.hash );

				// prevent any hashchange in the next self.hashChangeTimeout
				self.nextHashChangePrevented( true );

				// re-enable hash change handling after swallowing a possible hash
				// change event that comes on all popstates courtesy of browsers like Android
				self.hashChangeEnableTimer = setTimeout( function() {
					self.nextHashChangePrevented( false );
				}, self.hashChangeTimeout);
			}
		},

		init: function() {
			$win.bind( "hashchange", self.onHashChange );

			// Handle popstate events the occur through history changes
			$win.bind( "popstate", self.onPopState );

			// if there's no hash, we need to replacestate for returning to home
			if ( location.hash === "" ) {
				history.replaceState( self.state(), document.title, location.href );
			}
		}
	});

	// We need to init when "mobileinit", "domready", and "navready" have all happened
	$.when( domreadyDeferred, mobileinitDeferred, $.mobile.navreadyDeferred ).done( function() {
		if( $.mobile.pushStateEnabled && $.support.pushState ){
			pushStateHandler.init();
		}
	});
})( jQuery, this );

/*
* fallback transition for pop in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.pop = "fade";

})( jQuery, this );

/*
* fallback transition for slide in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

// Use the simultaneous transition handler for slide transitions
$.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;

// Set the slide transition's fallback to "fade"
$.mobile.transitionFallbacks.slide = "fade";

})( jQuery, this );

/*
* fallback transition for slidedown in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.slidedown = "fade";

})( jQuery, this );

/*
* fallback transition for slideup in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.slideup = "fade";

})( jQuery, this );

/*
* fallback transition for flip in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.flip = "fade";

})( jQuery, this );

/*
* fallback transition for flow in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.flow = "fade";

})( jQuery, this );

/*
* fallback transition for turn in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.turn = "fade";

})( jQuery, this );

(function( $, undefined ) {

$.mobile.page.prototype.options.degradeInputs = {
	color: false,
	date: false,
	datetime: false,
	"datetime-local": false,
	email: false,
	month: false,
	number: false,
	range: "number",
	search: "text",
	tel: false,
	time: false,
	url: false,
	week: false
};


//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){

	var page = $.mobile.closestPageData($(e.target)), options;

	if( !page ) {
		return;
	}

	options = page.options;

	// degrade inputs to avoid poorly implemented native functionality
	$( e.target ).find( "input" ).not( page.keepNativeSelector() ).each(function() {
		var $this = $( this ),
			type = this.getAttribute( "type" ),
			optType = options.degradeInputs[ type ] || "text";

		if ( options.degradeInputs[ type ] ) {
			var html = $( "<div>" ).html( $this.clone() ).html(),
				// In IE browsers, the type sometimes doesn't exist in the cloned markup, so we replace the closing tag instead
				hasType = html.indexOf( " type=" ) > -1,
				findstr = hasType ? /\s+type=["']?\w+['"]?/ : /\/?>/,
				repstr = " type=\"" + optType + "\" data-" + $.mobile.ns + "type=\"" + type + "\"" + ( hasType ? "" : ">" );

			$this.replaceWith( html.replace( findstr, repstr ) );
		}
	});

});

})( jQuery );

(function( $, window, undefined ) {

$.widget( "mobile.dialog", $.mobile.widget, {
	options: {
		closeBtnText 	: "Close",
		overlayTheme	: "a",
		initSelector	: ":jqmData(role='dialog')"
	},
	_create: function() {
		var self = this,
			$el = this.element,
			headerCloseButton = $( "<a href='#' data-" + $.mobile.ns + "icon='delete' data-" + $.mobile.ns + "iconpos='notext'>"+ this.options.closeBtnText + "</a>" ),
			dialogWrap = $("<div/>", {
					"role" : "dialog",
					"class" : "ui-dialog-contain ui-corner-all ui-overlay-shadow"
				});

		$el.addClass( "ui-dialog ui-overlay-" + this.options.overlayTheme );
		
		// Class the markup for dialog styling
		// Set aria role
		$el
			.wrapInner( dialogWrap )
			.children()
				.find( ":jqmData(role='header')" )
					.prepend( headerCloseButton )
				.end()
				.children( ':first-child')
					.addClass( "ui-corner-top" )
				.end()
				.children( ":last-child" )
					.addClass( "ui-corner-bottom" );

		// this must be an anonymous function so that select menu dialogs can replace
		// the close method. This is a change from previously just defining data-rel=back
		// on the button and letting nav handle it
		//
		// Use click rather than vclick in order to prevent the possibility of unintentionally
		// reopening the dialog if the dialog opening item was directly under the close button.
		headerCloseButton.bind( "click", function() {
			self.close();
		});

		/* bind events
			- clicks and submits should use the closing transition that the dialog opened with
			  unless a data-transition is specified on the link/form
			- if the click was on the close button, or the link has a data-rel="back" it'll go back in history naturally
		*/
		$el.bind( "vclick submit", function( event ) {
			var $target = $( event.target ).closest( event.type === "vclick" ? "a" : "form" ),
				active;

			if ( $target.length && !$target.jqmData( "transition" ) ) {

				active = $.mobile.urlHistory.getActive() || {};

				$target.attr( "data-" + $.mobile.ns + "transition", ( active.transition || $.mobile.defaultDialogTransition ) )
					.attr( "data-" + $.mobile.ns + "direction", "reverse" );
			}
		})
		.bind( "pagehide", function( e, ui ) {
			self._isClosed = false;
			$( this ).find( "." + $.mobile.activeBtnClass ).not( ".ui-slider-bg" ).removeClass( $.mobile.activeBtnClass );
		})
		// Override the theme set by the page plugin on pageshow
		.bind( "pagebeforeshow", function(){
			if( self.options.overlayTheme ){
				self.element
					.page( "removeContainerBackground" )
					.page( "setContainerBackground", self.options.overlayTheme );
			}
		});
	},

	// Close method goes back in history
	close: function() {
		if ( !this._isClosed ) {
			this._isClosed = true;
			if ( $.mobile.hashListeningEnabled ) {
				window.history.back();
			}
			else {
				$.mobile.changePage( $.mobile.urlHistory.getPrev().url );
			}
		}
	}
});

//auto self-init widgets
$( document ).delegate( $.mobile.dialog.prototype.options.initSelector, "pagecreate", function(){
	$.mobile.dialog.prototype.enhance( this );
});

})( jQuery, this );

(function( $, undefined ) {

$.mobile.page.prototype.options.backBtnText  = "Back";
$.mobile.page.prototype.options.addBackBtn   = false;
$.mobile.page.prototype.options.backBtnTheme = null;
$.mobile.page.prototype.options.headerTheme  = "a";
$.mobile.page.prototype.options.footerTheme  = "a";
$.mobile.page.prototype.options.contentTheme = null;

// NOTE bind used to force this binding to run before the buttonMarkup binding
//      which expects .ui-footer top be applied in its gigantic selector 
// TODO remove the buttonMarkup giant selector and move it to the various modules
//      on which it depends
$( document ).bind( "pagecreate", function( e ) {
	var $page = $( e.target ),
		o = $page.data( "page" ).options,
		pageRole = $page.jqmData( "role" ),
		pageTheme = o.theme;

	$( ":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", $page )
		.jqmEnhanceable()
		.each(function() {

		var $this = $( this ),
			role = $this.jqmData( "role" ),
			theme = $this.jqmData( "theme" ),
			contentTheme = theme || o.contentTheme || ( pageRole === "dialog" && pageTheme ),
			$headeranchors,
			leftbtn,
			rightbtn,
			backBtn;

		$this.addClass( "ui-" + role );

		//apply theming and markup modifications to page,header,content,footer
		if ( role === "header" || role === "footer" ) {

			var thisTheme = theme || ( role === "header" ? o.headerTheme : o.footerTheme ) || pageTheme;

			$this
				//add theme class
				.addClass( "ui-bar-" + thisTheme )
				// Add ARIA role
				.attr( "role", role === "header" ? "banner" : "contentinfo" );

			if( role === "header") {
				// Right,left buttons
				$headeranchors	= $this.children( "a" );
				leftbtn	= $headeranchors.hasClass( "ui-btn-left" );
				rightbtn = $headeranchors.hasClass( "ui-btn-right" );

				leftbtn = leftbtn || $headeranchors.eq( 0 ).not( ".ui-btn-right" ).addClass( "ui-btn-left" ).length;

				rightbtn = rightbtn || $headeranchors.eq( 1 ).addClass( "ui-btn-right" ).length;
			}

			// Auto-add back btn on pages beyond first view
			if ( o.addBackBtn &&
				role === "header" &&
				$( ".ui-page" ).length > 1 &&
				$page.jqmData( "url" ) !== $.mobile.path.stripHash( location.hash ) &&
				!leftbtn ) {

				backBtn = $( "<a href='javascript:void(0);' class='ui-btn-left' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='arrow-l'>"+ o.backBtnText +"</a>" )
					// If theme is provided, override default inheritance
					.attr( "data-"+ $.mobile.ns +"theme", o.backBtnTheme || thisTheme )
					.prependTo( $this );
			}

			// Page title
			$this.children( "h1, h2, h3, h4, h5, h6" )
				.addClass( "ui-title" )
				// Regardless of h element number in src, it becomes h1 for the enhanced page
				.attr({
					"role": "heading",
					"aria-level": "1"
				});

		} else if ( role === "content" ) {
			if ( contentTheme ) {
			    $this.addClass( "ui-body-" + ( contentTheme ) );
			}

			// Add ARIA role
			$this.attr( "role", "main" );
		}
	});
});

})( jQuery );

(function( $, undefined ) {

// filter function removes whitespace between label and form element so we can use inline-block (nodeType 3 = text)
$.fn.fieldcontain = function( options ) {
	return this
		.addClass( "ui-field-contain ui-body ui-br" )
		.contents().filter( function() {
			return ( this.nodeType === 3 && !/\S/.test( this.nodeValue ) );
		}).remove();
};

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( ":jqmData(role='fieldcontain')", e.target ).jqmEnhanceable().fieldcontain();
});

})( jQuery );

(function( $, undefined ) {

$.fn.grid = function( options ) {
	return this.each(function() {

		var $this = $( this ),
			o = $.extend({
				grid: null
			},options),
			$kids = $this.children(),
			gridCols = {solo:1, a:2, b:3, c:4, d:5},
			grid = o.grid,
			iterator;

			if ( !grid ) {
				if ( $kids.length <= 5 ) {
					for ( var letter in gridCols ) {
						if ( gridCols[ letter ] === $kids.length ) {
							grid = letter;
						}
					}
				} else {
					grid = "a";
					$this.addClass( "ui-grid-duo" );
				}
			}
			iterator = gridCols[grid];

		$this.addClass( "ui-grid-" + grid );

		$kids.filter( ":nth-child(" + iterator + "n+1)" ).addClass( "ui-block-a" );

		if ( iterator > 1 ) {
			$kids.filter( ":nth-child(" + iterator + "n+2)" ).addClass( "ui-block-b" );
		}
		if ( iterator > 2 ) {
			$kids.filter( ":nth-child(3n+3)" ).addClass( "ui-block-c" );
		}
		if ( iterator > 3 ) {
			$kids.filter( ":nth-child(4n+4)" ).addClass( "ui-block-d" );
		}
		if ( iterator > 4 ) {
			$kids.filter( ":nth-child(5n+5)" ).addClass( "ui-block-e" );
		}
	});
};
})( jQuery );

(function( $, undefined ) {

$( document ).bind( "pagecreate create", function( e ){
	$( ":jqmData(role='nojs')", e.target ).addClass( "ui-nojs" );
	
});

})( jQuery );

( function( $, undefined ) {

$.fn.buttonMarkup = function( options ) {
	var $workingSet = this;

	// Enforce options to be of type string
	options = ( options && ( $.type( options ) == "object" ) )? options : {};
	for ( var i = 0; i < $workingSet.length; i++ ) {
		var el = $workingSet.eq( i ),
			e = el[ 0 ],
			o = $.extend( {}, $.fn.buttonMarkup.defaults, {
				icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
				iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
				theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ) || $.mobile.getInheritedTheme( el, "c" ),
				inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
				shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
				corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
				iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" ),
				mini:       options.mini       !== undefined ? options.mini       : el.jqmData( "mini" )
			}, options ),

			// Classes Defined
			innerClass = "ui-btn-inner",
			textClass = "ui-btn-text",
			buttonClass, iconClass,
			// Button inner markup
			buttonInner,
			buttonText,
			buttonIcon,
			buttonElements;

		$.each(o, function(key, value) {
			e.setAttribute( "data-" + $.mobile.ns + key, value );
			el.jqmData(key, value);
		});

		// Check if this element is already enhanced
		buttonElements = $.data(((e.tagName === "INPUT" || e.tagName === "BUTTON") ? e.parentNode : e), "buttonElements");

		if (buttonElements) {
			e = buttonElements.outer;
			el = $(e);
			buttonInner = buttonElements.inner;
			buttonText = buttonElements.text;
			// We will recreate this icon below
			$(buttonElements.icon).remove();
			buttonElements.icon = null;
		}
		else {
			buttonInner = document.createElement( o.wrapperEls );
			buttonText = document.createElement( o.wrapperEls );
		}
		buttonIcon = o.icon ? document.createElement( "span" ) : null;

		if ( attachEvents && !buttonElements) {
			attachEvents();
		}
		
		// if not, try to find closest theme container	
		if ( !o.theme ) {
			o.theme = $.mobile.getInheritedTheme( el, "c" );	
		}		

		buttonClass = "ui-btn ui-btn-up-" + o.theme;
		buttonClass += o.inline ? " ui-btn-inline" : "";
		buttonClass += o.shadow ? " ui-shadow" : "";
		buttonClass += o.corners ? " ui-btn-corner-all" : "";

		if ( o.mini !== undefined ) {
			// Used to control styling in headers/footers, where buttons default to `mini` style.
			buttonClass += o.mini ? " ui-mini" : " ui-fullsize";
		}
		
		if ( o.inline !== undefined ) {			
			// Used to control styling in headers/footers, where buttons default to `mini` style.
			buttonClass += o.inline === false ? " ui-btn-block" : " ui-btn-inline";
		}
		
		
		if ( o.icon ) {
			o.icon = "ui-icon-" + o.icon;
			o.iconpos = o.iconpos || "left";

			iconClass = "ui-icon " + o.icon;

			if ( o.iconshadow ) {
				iconClass += " ui-icon-shadow";
			}
		}

		if ( o.iconpos ) {
			buttonClass += " ui-btn-icon-" + o.iconpos;

			if ( o.iconpos == "notext" && !el.attr( "title" ) ) {
				el.attr( "title", el.getEncodedText() );
			}
		}
    
		innerClass += o.corners ? " ui-btn-corner-all" : "";

		if ( o.iconpos && o.iconpos === "notext" && !el.attr( "title" ) ) {
			el.attr( "title", el.getEncodedText() );
		}

		if ( buttonElements ) {
			el.removeClass( buttonElements.bcls || "" );
		}
		el.removeClass( "ui-link" ).addClass( buttonClass );

		buttonInner.className = innerClass;

		buttonText.className = textClass;
		if ( !buttonElements ) {
			buttonInner.appendChild( buttonText );
		}
		if ( buttonIcon ) {
			buttonIcon.className = iconClass;
			if ( !(buttonElements && buttonElements.icon) ) {
				buttonIcon.appendChild( document.createTextNode("\u00a0") );
				buttonInner.appendChild( buttonIcon );
			}
		}

		while ( e.firstChild && !buttonElements) {
			buttonText.appendChild( e.firstChild );
		}

		if ( !buttonElements ) {
			e.appendChild( buttonInner );
		}

		// Assign a structure containing the elements of this button to the elements of this button. This
		// will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
		buttonElements = {
			bcls  : buttonClass,
			outer : e,
			inner : buttonInner,
			text  : buttonText,
			icon  : buttonIcon
		};

		$.data(e,           'buttonElements', buttonElements);
		$.data(buttonInner, 'buttonElements', buttonElements);
		$.data(buttonText,  'buttonElements', buttonElements);
		if (buttonIcon) {
			$.data(buttonIcon, 'buttonElements', buttonElements);
		}
	}

	return this;
};

$.fn.buttonMarkup.defaults = {
	corners: true,
	shadow: true,
	iconshadow: true,
	wrapperEls: "span"
};

function closestEnabledButton( element ) {
    var cname;

    while ( element ) {
		// Note that we check for typeof className below because the element we
		// handed could be in an SVG DOM where className on SVG elements is defined to
		// be of a different type (SVGAnimatedString). We only operate on HTML DOM
		// elements, so we look for plain "string".
        cname = ( typeof element.className === 'string' ) && (element.className + ' ');
        if ( cname && cname.indexOf("ui-btn ") > -1 && cname.indexOf("ui-disabled ") < 0 ) {
            break;
        }

        element = element.parentNode;
    }

    return element;
}

var attachEvents = function() {
	var hoverDelay = $.mobile.buttonMarkup.hoverDelay, hov, foc;

	$( document ).bind( {
		"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function( event ) {
			var theme,
				$btn = $( closestEnabledButton( event.target ) ),
				evt = event.type;
		
			if ( $btn.length ) {
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
		
				if ( evt === "vmousedown" ) {
					if ( $.support.touch ) {
						hov = setTimeout(function() {
							$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
						}, hoverDelay );
					} else {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
					}
				} else if ( evt === "vmousecancel" || evt === "vmouseup" ) {
					$btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
				} else if ( evt === "vmouseover" || evt === "focus" ) {
					if ( $.support.touch ) {
						foc = setTimeout(function() {
							$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
						}, hoverDelay );
					} else {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
					}
				} else if ( evt === "vmouseout" || evt === "blur" || evt === "scrollstart" ) {
					$btn.removeClass( "ui-btn-hover-" + theme  + " ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
					if ( hov ) {
						clearTimeout( hov );
					}
					if ( foc ) {
						clearTimeout( foc );
					}
				}
			}
		},
		"focusin focus": function( event ){
			$( closestEnabledButton( event.target ) ).addClass( $.mobile.focusClass );
		},
		"focusout blur": function( event ){
			$( closestEnabledButton( event.target ) ).removeClass( $.mobile.focusClass );
		}
	});

	attachEvents = null;
};

//links in bars, or those with  data-role become buttons
//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){

	$( ":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target )
		.not( ".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
		.buttonMarkup();
});

})( jQuery );


(function( $, undefined ) {

$.widget( "mobile.collapsible", $.mobile.widget, {
	options: {
		expandCueText: " click to expand contents",
		collapseCueText: " click to collapse contents",
		collapsed: true,
		heading: "h1,h2,h3,h4,h5,h6,legend",
		theme: null,
		contentTheme: null,
		iconTheme: "d",
		mini: false,
		initSelector: ":jqmData(role='collapsible')"
	},
	_create: function() {

		var $el = this.element,
			o = this.options,
			collapsible = $el.addClass( "ui-collapsible" ),
			collapsibleHeading = $el.children( o.heading ).first(),
			collapsibleContent = collapsible.wrapInner( "<div class='ui-collapsible-content'></div>" ).find( ".ui-collapsible-content" ),
			collapsibleSet = $el.closest( ":jqmData(role='collapsible-set')" ).addClass( "ui-collapsible-set" );

		// Replace collapsibleHeading if it's a legend
		if ( collapsibleHeading.is( "legend" ) ) {
			collapsibleHeading = $( "<div role='heading'>"+ collapsibleHeading.html() +"</div>" ).insertBefore( collapsibleHeading );
			collapsibleHeading.next().remove();
		}

		// If we are in a collapsible set
		if ( collapsibleSet.length ) {
			// Inherit the theme from collapsible-set
			if ( !o.theme ) {
				o.theme = collapsibleSet.jqmData("theme") || $.mobile.getInheritedTheme( collapsibleSet, "c" );
			}
			// Inherit the content-theme from collapsible-set
			if ( !o.contentTheme ) {
				o.contentTheme = collapsibleSet.jqmData( "content-theme" );
			}

			// Gets the preference icon position in the set
			if ( !o.iconPos ) {
				o.iconPos = collapsibleSet.jqmData( "iconpos" );
			}

			if( !o.mini ) {
				o.mini = collapsibleSet.jqmData( "mini" );
			}
		}
		collapsibleContent.addClass( ( o.contentTheme ) ? ( "ui-body-" + o.contentTheme ) : "");

		collapsibleHeading
			//drop heading in before content
			.insertBefore( collapsibleContent )
			//modify markup & attributes
			.addClass( "ui-collapsible-heading" )
			.append( "<span class='ui-collapsible-heading-status'></span>" )
			.wrapInner( "<a href='#' class='ui-collapsible-heading-toggle'></a>" )
			.find( "a" )
				.first()
				.buttonMarkup({
					shadow: false,
					corners: false,
					iconpos: $el.jqmData( "iconpos" ) || o.iconPos || "left",
					icon: "plus",
					mini: o.mini,
					theme: o.theme
				})
			.add( ".ui-btn-inner", $el )
				.addClass( "ui-corner-top ui-corner-bottom" );

		//events
		collapsible
			.bind( "expand collapse", function( event ) {
				if ( !event.isDefaultPrevented() ) {

					event.preventDefault();

					var $this = $( this ),
						isCollapse = ( event.type === "collapse" ),
					    contentTheme = o.contentTheme;

					collapsibleHeading
						.toggleClass( "ui-collapsible-heading-collapsed", isCollapse)
						.find( ".ui-collapsible-heading-status" )
							.text( isCollapse ? o.expandCueText : o.collapseCueText )
						.end()
						.find( ".ui-icon" )
							.toggleClass( "ui-icon-minus", !isCollapse )
							.toggleClass( "ui-icon-plus", isCollapse )
						.end()
						.find( "a" ).first().removeClass( $.mobile.activeBtnClass );

					$this.toggleClass( "ui-collapsible-collapsed", isCollapse );
					collapsibleContent.toggleClass( "ui-collapsible-content-collapsed", isCollapse ).attr( "aria-hidden", isCollapse );

					if ( contentTheme && ( !collapsibleSet.length || collapsible.jqmData( "collapsible-last" ) ) ) {
						collapsibleHeading
							.find( "a" ).first().add( collapsibleHeading.find( ".ui-btn-inner" ) )
							.toggleClass( "ui-corner-bottom", isCollapse );
						collapsibleContent.toggleClass( "ui-corner-bottom", !isCollapse );
					}
					collapsibleContent.trigger( "updatelayout" );
				}
			})
			.trigger( o.collapsed ? "collapse" : "expand" );

		collapsibleHeading
			.bind( "tap", function( event ) {
				collapsibleHeading.find( "a" ).first().addClass( $.mobile.activeBtnClass );
			})
			.bind( "click", function( event ) {

				var type = collapsibleHeading.is( ".ui-collapsible-heading-collapsed" ) ?
										"expand" : "collapse";

				collapsible.trigger( type );

				event.preventDefault();
				event.stopPropagation();
			});
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.collapsible.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.collapsibleset", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(role='collapsible-set')"
	},
	_create: function() {
		var $el = this.element.addClass( "ui-collapsible-set" ),
			o = this.options;

		// Inherit the theme from collapsible-set
		if ( !o.theme ) {
			o.theme = $.mobile.getInheritedTheme( $el, "c" );
		}
		// Inherit the content-theme from collapsible-set
		if ( !o.contentTheme ) {
			o.contentTheme = $el.jqmData( "content-theme" );
		}

		if ( !o.corners ) {
			o.corners = $el.jqmData( "corners" ) === undefined ? true : false;
		}

		// Initialize the collapsible set if it's not already initialized
		if ( !$el.jqmData( "collapsiblebound" ) ) {
			$el
				.jqmData( "collapsiblebound", true )
				.bind( "expand collapse", function( event ) {
					var isCollapse = ( event.type === "collapse" ),
						collapsible = $( event.target ).closest( ".ui-collapsible" ),
						widget = collapsible.data( "collapsible" ),
					    contentTheme = widget.options.contentTheme;
					if ( contentTheme && collapsible.jqmData( "collapsible-last" ) ) {
						collapsible.find( widget.options.heading ).first()
							.find( "a" ).first()
							.toggleClass( "ui-corner-bottom", isCollapse )
							.find( ".ui-btn-inner" )
							.toggleClass( "ui-corner-bottom", isCollapse );
						collapsible.find( ".ui-collapsible-content" ).toggleClass( "ui-corner-bottom", !isCollapse );
					}
				})
				.bind( "expand", function( event ) {
					$( event.target )
						.closest( ".ui-collapsible" )
						.siblings( ".ui-collapsible" )
						.trigger( "collapse" );
				});
		}
	},

	_init: function() {
		this.refresh();
	},

	refresh: function() {
		var $el = this.element,
			o = this.options,
			collapsiblesInSet = $el.children( ":jqmData(role='collapsible')" );

		$.mobile.collapsible.prototype.enhance( collapsiblesInSet.not( ".ui-collapsible" ) );

		// clean up borders
		collapsiblesInSet.each( function() {
			$( this ).find( $.mobile.collapsible.prototype.options.heading )
				.find( "a" ).first()
				.removeClass( "ui-corner-top ui-corner-bottom" )
				.find( ".ui-btn-inner" )
				.removeClass( "ui-corner-top ui-corner-bottom" );
		});

		collapsiblesInSet.first()
			.find( "a" )
				.first()
				.addClass( o.corners ? "ui-corner-top" : "" )
				.find( ".ui-btn-inner" )
					.addClass( "ui-corner-top" );

		collapsiblesInSet.last()
			.jqmData( "collapsible-last", true )
			.find( "a" )
				.first()
				.addClass( o.corners ? "ui-corner-bottom" : "" )
				.find( ".ui-btn-inner" )
					.addClass( "ui-corner-bottom" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.collapsibleset.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.navbar", $.mobile.widget, {
	options: {
		iconpos: "top",
		grid: null,
		initSelector: ":jqmData(role='navbar')"
	},

	_create: function(){

		var $navbar = this.element,
			$navbtns = $navbar.find( "a" ),
			iconpos = $navbtns.filter( ":jqmData(icon)" ).length ?
									this.options.iconpos : undefined;

		$navbar.addClass( "ui-navbar ui-mini" )
			.attr( "role","navigation" )
			.find( "ul" )
			.jqmEnhanceable()
			.grid({ grid: this.options.grid });

		$navbtns.buttonMarkup({
			corners:	false,
			shadow:		false,
			inline:     true,
			iconpos:	iconpos
		});

		$navbar.delegate( "a", "vclick", function( event ) {
			if( !$(event.target).hasClass("ui-disabled") ) {
				$navbtns.removeClass( $.mobile.activeBtnClass );
				$( this ).addClass( $.mobile.activeBtnClass );
			}
		});

		// Buttons in the navbar with ui-state-persist class should regain their active state before page show
		$navbar.closest( ".ui-page" ).bind( "pagebeforeshow", function() {
			$navbtns.filter( ".ui-state-persist" ).addClass( $.mobile.activeBtnClass );
		});
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.navbar.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
var listCountPerPage = {};

$.widget( "mobile.listview", $.mobile.widget, {

	options: {
		theme: null,
		countTheme: "c",
		headerTheme: "b",
		dividerTheme: "b",
		splitIcon: "arrow-r",
		splitTheme: "b",
		inset: false,
		initSelector: ":jqmData(role='listview')"
	},

	_create: function() {
		var t = this,
			listviewClasses = "";
			
		listviewClasses += t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "";

		// create listview markup
		t.element.addClass(function( i, orig ) {
			return orig + " ui-listview " + listviewClasses;
		});

		t.refresh( true );
	},

	_removeCorners: function( li, which ) {
		var top = "ui-corner-top ui-corner-tr ui-corner-tl",
			bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

		li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

		if ( which === "top" ) {
			li.removeClass( top );
		} else if ( which === "bottom" ) {
			li.removeClass( bot );
		} else {
			li.removeClass( top + " " + bot );
		}
	},

	_refreshCorners: function( create ) {
		var $li,
			$visibleli,
			$topli,
			$bottomli;

		if ( this.options.inset ) {
			$li = this.element.children( "li" );
			// at create time the li are not visible yet so we need to rely on .ui-screen-hidden
			$visibleli = create?$li.not( ".ui-screen-hidden" ):$li.filter( ":visible" );

			this._removeCorners( $li );

			// Select the first visible li element
			$topli = $visibleli.first()
				.addClass( "ui-corner-top" );

			$topli.add( $topli.find( ".ui-btn-inner" )
					.not( ".ui-li-link-alt span:first-child" ) )
                                .addClass( "ui-corner-top" )
                                .end()
				.find( ".ui-li-link-alt, .ui-li-link-alt span:first-child" )
					.addClass( "ui-corner-tr" )
				.end()
				.find( ".ui-li-thumb" )
					.not(".ui-li-icon")
					.addClass( "ui-corner-tl" );

			// Select the last visible li element
			$bottomli = $visibleli.last()
				.addClass( "ui-corner-bottom" );

			$bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
				.find( ".ui-li-link-alt" )
					.addClass( "ui-corner-br" )
				.end()
				.find( ".ui-li-thumb" )
					.not(".ui-li-icon")
					.addClass( "ui-corner-bl" );
		}
		if ( !create ) {
			this.element.trigger( "updatelayout" );
		}
	},

	// This is a generic utility method for finding the first
	// node with a given nodeName. It uses basic DOM traversal
	// to be fast and is meant to be a substitute for simple
	// $.fn.closest() and $.fn.children() calls on a single
	// element. Note that callers must pass both the lowerCase
	// and upperCase version of the nodeName they are looking for.
	// The main reason for this is that this function will be
	// called many times and we want to avoid having to lowercase
	// the nodeName from the element every time to ensure we have
	// a match. Note that this function lives here for now, but may
	// be moved into $.mobile if other components need a similar method.
	_findFirstElementByTagName: function( ele, nextProp, lcName, ucName )
	{
		var dict = {};
		dict[ lcName ] = dict[ ucName ] = true;
		while ( ele ) {
			if ( dict[ ele.nodeName ] ) {
				return ele;
			}
			ele = ele[ nextProp ];
		}
		return null;
	},
	_getChildrenByTagName: function( ele, lcName, ucName )
	{
		var results = [],
			dict = {};
		dict[ lcName ] = dict[ ucName ] = true;
		ele = ele.firstChild;
		while ( ele ) {
			if ( dict[ ele.nodeName ] ) {
				results.push( ele );
			}
			ele = ele.nextSibling;
		}
		return $( results );
	},

	_addThumbClasses: function( containers )
	{
		var i, img, len = containers.length;
		for ( i = 0; i < len; i++ ) {
			img = $( this._findFirstElementByTagName( containers[ i ].firstChild, "nextSibling", "img", "IMG" ) );
			if ( img.length ) {
				img.addClass( "ui-li-thumb" );
				$( this._findFirstElementByTagName( img[ 0 ].parentNode, "parentNode", "li", "LI" ) ).addClass( img.is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
			}
		}
	},

	refresh: function( create ) {
		this.parentPage = this.element.closest( ".ui-page" );
		this._createSubPages();

		var o = this.options,
			$list = this.element,
			self = this,
			dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
			listsplittheme = $list.jqmData( "splittheme" ),
			listspliticon = $list.jqmData( "spliticon" ),
			li = this._getChildrenByTagName( $list[ 0 ], "li", "LI" ),
			counter = $.support.cssPseudoElement || !$.nodeName( $list[ 0 ], "ol" ) ? 0 : 1,
			itemClassDict = {},
			item, itemClass, itemTheme,
			a, last, splittheme, countParent, icon, imgParents, img, linkIcon;

		if ( counter ) {
			$list.find( ".ui-li-dec" ).remove();
		}

		if ( !o.theme ) {
			o.theme = $.mobile.getInheritedTheme( this.element, "c" );
		}

		for ( var pos = 0, numli = li.length; pos < numli; pos++ ) {
			item = li.eq( pos );
			itemClass = "ui-li";

			// If we're creating the element, we update it regardless
			if ( create || !item.hasClass( "ui-li" ) ) {
				itemTheme = item.jqmData("theme") || o.theme;
				a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
				var isDivider = ( item.jqmData( "role" ) === "list-divider" );

				if ( a.length && !isDivider ) {
					icon = item.jqmData("icon");

					item.buttonMarkup({
						wrapperEls: "div",
						shadow: false,
						corners: false,
						iconpos: "right",
						icon: a.length > 1 || icon === false ? false : icon || "arrow-r",
						theme: itemTheme
					});

					if ( ( icon != false ) && ( a.length == 1 ) ) {
						item.addClass( "ui-li-has-arrow" );
					}

					a.first().removeClass( "ui-link" ).addClass( "ui-link-inherit" );

					if ( a.length > 1 ) {
						itemClass += " ui-li-has-alt";

						last = a.last();
						splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;
						linkIcon = last.jqmData("icon");

						last.appendTo(item)
							.attr( "title", last.getEncodedText() )
							.addClass( "ui-li-link-alt" )
							.empty()
							.buttonMarkup({
								shadow: false,
								corners: false,
								theme: itemTheme,
								icon: false,
								iconpos: "notext"
							})
							.find( ".ui-btn-inner" )
								.append(
									$( document.createElement( "span" ) ).buttonMarkup({
										shadow: true,
										corners: true,
										theme: splittheme,
										iconpos: "notext",
										// link icon overrides list item icon overrides ul element overrides options
										icon: linkIcon || icon || listspliticon || o.splitIcon
									})
								);
					}
				} else if ( isDivider ) {

					itemClass += " ui-li-divider ui-bar-" + dividertheme;
					item.attr( "role", "heading" );

					//reset counter when a divider heading is encountered
					if ( counter ) {
						counter = 1;
					}

				} else {
					itemClass += " ui-li-static ui-body-" + itemTheme;
				}
			}

			if ( counter && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
				countParent = item.is( ".ui-li-static:first" ) ? item : item.find( ".ui-link-inherit" );

				countParent.addClass( "ui-li-jsnumbering" )
					.prepend( "<span class='ui-li-dec'>" + (counter++) + ". </span>" );
			}

			// Instead of setting item class directly on the list item and its
			// btn-inner at this point in time, push the item into a dictionary
			// that tells us what class to set on it so we can do this after this
			// processing loop is finished.

			if ( !itemClassDict[ itemClass ] ) {
				itemClassDict[ itemClass ] = [];
			}

			itemClassDict[ itemClass ].push( item[ 0 ] );
		}

		// Set the appropriate listview item classes on each list item
		// and their btn-inner elements. The main reason we didn't do this
		// in the for-loop above is because we can eliminate per-item function overhead
		// by calling addClass() and children() once or twice afterwards. This
		// can give us a significant boost on platforms like WP7.5.

		for ( itemClass in itemClassDict ) {
			$( itemClassDict[ itemClass ] ).addClass( itemClass ).children( ".ui-btn-inner" ).addClass( itemClass );
		}

		$list.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" )
			.end()

			.find( "p, dl" ).addClass( "ui-li-desc" )
			.end()

			.find( ".ui-li-aside" ).each(function() {
					var $this = $(this);
					$this.prependTo( $this.parent() ); //shift aside to front for css float
				})
			.end()

			.find( ".ui-li-count" ).each( function() {
					$( this ).closest( "li" ).addClass( "ui-li-has-count" );
				}).addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme) + " ui-btn-corner-all" );

		// The idea here is to look at the first image in the list item
		// itself, and any .ui-link-inherit element it may contain, so we
		// can place the appropriate classes on the image and list item.
		// Note that we used to use something like:
		//
		//    li.find(">img:eq(0), .ui-link-inherit>img:eq(0)").each( ... );
		//
		// But executing a find() like that on Windows Phone 7.5 took a
		// really long time. Walking things manually with the code below
		// allows the 400 listview item page to load in about 3 seconds as
		// opposed to 30 seconds.

		this._addThumbClasses( li );
		this._addThumbClasses( $list.find( ".ui-link-inherit" ) );

		this._refreshCorners( create );
	},

	//create a string for ID/subpage url creation
	_idStringEscape: function( str ) {
		return str.replace(/[^a-zA-Z0-9]/g, '-');
	},

	_createSubPages: function() {
		var parentList = this.element,
			parentPage = parentList.closest( ".ui-page" ),
			parentUrl = parentPage.jqmData( "url" ),
			parentId = parentUrl || parentPage[ 0 ][ $.expando ],
			parentListId = parentList.attr( "id" ),
			o = this.options,
			dns = "data-" + $.mobile.ns,
			self = this,
			persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
			hasSubPages;

		if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
			listCountPerPage[ parentId ] = -1;
		}

		parentListId = parentListId || ++listCountPerPage[ parentId ];

		$( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function( i ) {
			var self = this,
				list = $( this ),
				listId = list.attr( "id" ) || parentListId + "-" + i,
				parent = list.parent(),
				nodeEls = $( list.prevAll().toArray().reverse() ),
				nodeEls = nodeEls.length ? nodeEls : $( "<span>" + $.trim(parent.contents()[ 0 ].nodeValue) + "</span>" ),
				title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
				id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
				theme = list.jqmData( "theme" ) || o.theme,
				countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
				newPage, anchor;

			//define hasSubPages for use in later removal
			hasSubPages = true;

			newPage = list.detach()
						.wrap( "<div " + dns + "role='page' " +	dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
						.parent()
							.before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
							.after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='"+ persistentFooterID +"'>") : "" )
							.parent()
								.appendTo( $.mobile.pageContainer );

			newPage.page();

			anchor = parent.find('a:first');

			if ( !anchor.length ) {
				anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
			}

			anchor.attr( "href", "#" + id );

		}).listview();

		// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
		// and aren't embedded
		if( hasSubPages &&
			parentPage.is( ":jqmData(external-page='true')" ) &&
			parentPage.data("page").options.domCache === false ) {

			var newRemove = function( e, ui ){
				var nextPage = ui.nextPage, npURL,
					prEvent = new $.Event( "pageremove" );

				if( ui.nextPage ){
					npURL = nextPage.jqmData( "url" );
					if( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ){
						self.childPages().remove();
						parentPage.trigger( prEvent );
						if( !prEvent.isDefaultPrevented() ){
							parentPage.removeWithDependents();
						}
					}
				}
			};

			// unbind the original page remove and replace with our specialized version
			parentPage
				.unbind( "pagehide.remove" )
				.bind( "pagehide.remove", newRemove);
		}
	},

	// TODO sort out a better way to track sub pages of the listview this is brittle
	childPages: function(){
		var parentUrl = this.parentPage.jqmData( "url" );

		return $( ":jqmData(url^='"+  parentUrl + "&" + $.mobile.subPageUrlKey +"')");
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.listview.prototype.enhanceWithin( e.target );
});

})( jQuery );

/*
* "checkboxradio" plugin
*/

(function( $, undefined ) {

$.widget( "mobile.checkboxradio", $.mobile.widget, {
	options: {
		theme: null,
		initSelector: "input[type='checkbox'],input[type='radio']"
	},
	_create: function() {
		var self = this,
			input = this.element,
			inheritAttr = function( input, dataAttr ) {
				return input.jqmData( dataAttr ) || input.closest( "form,fieldset" ).jqmData( dataAttr )
			},
			// NOTE: Windows Phone could not find the label through a selector
			// filter works though.
			parentLabel = $( input ).closest( "label" ),
			label = parentLabel.length ? parentLabel : $( input ).closest( "form,fieldset,:jqmData(role='page'),:jqmData(role='dialog')" ).find( "label" ).filter( "[for='" + input[0].id + "']" ),
			inputtype = input[0].type,
			mini = inheritAttr( input, "mini" ),
			checkedState = inputtype + "-on",
			uncheckedState = inputtype + "-off",
			icon = input.parents( ":jqmData(type='horizontal')" ).length ? undefined : uncheckedState,
			iconpos = inheritAttr( input, "iconpos" ),
			activeBtn = icon ? "" : " " + $.mobile.activeBtnClass,
			checkedClass = "ui-" + checkedState + activeBtn,
			uncheckedClass = "ui-" + uncheckedState,
			checkedicon = "ui-icon-" + checkedState,
			uncheckedicon = "ui-icon-" + uncheckedState;

		if ( inputtype !== "checkbox" && inputtype !== "radio" ) {
			return;
		}

		// Expose for other methods
		$.extend( this, {
			label: label,
			inputtype: inputtype,
			checkedClass: checkedClass,
			uncheckedClass: uncheckedClass,
			checkedicon: checkedicon,
			uncheckedicon: uncheckedicon
		});

		// If there's no selected theme check the data attr
		if( !this.options.theme ) {
			this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
		}

		label.buttonMarkup({
			theme: this.options.theme,
			icon: icon,
			shadow: false,
			mini: mini,
			iconpos: iconpos
		});

		// Wrap the input + label in a div
		var wrapper = document.createElement('div');
		wrapper.className = 'ui-' + inputtype;

		input.add( label ).wrapAll( wrapper );

		label.bind({
			vmouseover: function( event ) {
				if ( $( this ).parent().is( ".ui-disabled" ) ) {
					event.stopPropagation();
				}
			},

			vclick: function( event ) {
				if ( input.is( ":disabled" ) ) {
					event.preventDefault();
					return;
				}

				self._cacheVals();

				input.prop( "checked", inputtype === "radio" && true || !input.prop( "checked" ) );

				// trigger click handler's bound directly to the input as a substitute for
				// how label clicks behave normally in the browsers
				// TODO: it would be nice to let the browser's handle the clicks and pass them
				//       through to the associate input. we can swallow that click at the parent
				//       wrapper element level
				input.triggerHandler( 'click' );

				// Input set for common radio buttons will contain all the radio
				// buttons, but will not for checkboxes. clearing the checked status
				// of other radios ensures the active button state is applied properly
				self._getInputSet().not( input ).prop( "checked", false );

				self._updateAll();
				return false;
			}
		});

		input
			.bind({
				vmousedown: function() {
					self._cacheVals();
				},

				vclick: function() {
					var $this = $(this);

					// Adds checked attribute to checked input when keyboard is used
					if ( $this.is( ":checked" ) ) {

						$this.prop( "checked", true);
						self._getInputSet().not($this).prop( "checked", false );
					} else {

						$this.prop( "checked", false );
					}

					self._updateAll();
				},

				focus: function() {
					label.addClass( $.mobile.focusClass );
				},

				blur: function() {
					label.removeClass( $.mobile.focusClass );
				}
			});

		this.refresh();
	},

	_cacheVals: function() {
		this._getInputSet().each(function() {
			$(this).jqmData( "cacheVal", this.checked );
		});
	},

	//returns either a set of radios with the same name attribute, or a single checkbox
	_getInputSet: function(){
		if(this.inputtype === "checkbox") {
			return this.element;
		}

		return this.element.closest( "form,fieldset,:jqmData(role='page')" )
			.find( "input[name='"+ this.element[0].name +"'][type='"+ this.inputtype +"']" );
	},

	_updateAll: function() {
		var self = this;

		this._getInputSet().each(function() {
			var $this = $(this);

			if ( this.checked || self.inputtype === "checkbox" ) {
				$this.trigger( "change" );
			}
		})
		.checkboxradio( "refresh" );
	},

	refresh: function() {
		var input = this.element[0],
			label = this.label,
			icon = label.find( ".ui-icon" );

		if ( input.checked ) {
			label.addClass( this.checkedClass ).removeClass( this.uncheckedClass );
			icon.addClass( this.checkedicon ).removeClass( this.uncheckedicon );
		} else {
			label.removeClass( this.checkedClass ).addClass( this.uncheckedClass );
			icon.removeClass( this.checkedicon ).addClass( this.uncheckedicon );
		}

		if ( input.disabled ) {
			this.disable();
		} else {
			this.enable();
		}
	},

	disable: function() {
		this.element.prop( "disabled", true ).parent().addClass( "ui-disabled" );
	},

	enable: function() {
		this.element.prop( "disabled", false ).parent().removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.checkboxradio.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.button", $.mobile.widget, {
	options: {
		theme: null,
		icon: null,
		iconpos: null,
		inline: false,
		corners: true,
		shadow: true,
		iconshadow: true,
		initSelector: "button, [type='button'], [type='submit'], [type='reset'], [type='image']",
		mini: false
	},
	_create: function() {
		var $el = this.element,
			$button,
			o = this.options,
			type,
			name,
			classes = "",
			$buttonPlaceholder;

		// if this is a link, check if it's been enhanced and, if not, use the right function
		if( $el[ 0 ].tagName === "A" ) {
	 	 	!$el.hasClass( "ui-btn" ) && $el.buttonMarkup();
	 	 	return;
 	 	}

		// get the inherited theme
		// TODO centralize for all widgets
		if ( !this.options.theme ) {
			this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
		}

		// TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
		/* if( $el[0].className.length ) {
			classes = $el[0].className;
		} */
		if( !!~$el[0].className.indexOf( "ui-btn-left" ) ) {
			classes = "ui-btn-left";
		}

		if(  !!~$el[0].className.indexOf( "ui-btn-right" ) ) {
			classes = "ui-btn-right";
		}

		if(  $el.attr( "type" ) === "submit" || $el.attr( "type" ) === "reset" ) {
			classes ? classes += " ui-submit" :  classes = "ui-submit";
		}
		
		$( "label[for='" + $el.attr( "id" ) + "']" ).addClass( "ui-submit" );

		// Add ARIA role
		this.button = $( "<div></div>" )
			.text( $el.text() || $el.val() )
			.insertBefore( $el )
			.buttonMarkup({
				theme: o.theme,
				icon: o.icon,
				iconpos: o.iconpos,
				inline: o.inline,
				corners: o.corners,
				shadow: o.shadow,
				iconshadow: o.iconshadow,
				mini: o.mini
			})
			.addClass( classes )
			.append( $el.addClass( "ui-btn-hidden" ) );

        $button = this.button;
		type = $el.attr( "type" );
		name = $el.attr( "name" );

		// Add hidden input during submit if input type="submit" has a name.
		if ( type !== "button" && type !== "reset" && name ) {
				$el.bind( "vclick", function() {
					// Add hidden input if it doesn't already exist.
					if( $buttonPlaceholder === undefined ) {
						$buttonPlaceholder = $( "<input>", {
							type: "hidden",
							name: $el.attr( "name" ),
							value: $el.attr( "value" )
						}).insertBefore( $el );

						// Bind to doc to remove after submit handling
						$( document ).one("submit", function(){
							$buttonPlaceholder.remove();

							// reset the local var so that the hidden input
							// will be re-added on subsequent clicks
							$buttonPlaceholder = undefined;
						});
					}
				});
		}

        $el.bind({
            focus: function() {
                $button.addClass( $.mobile.focusClass );
            },

            blur: function() {
                $button.removeClass( $.mobile.focusClass );
            }
        });

		this.refresh();
	},

	enable: function() {
		this.element.attr( "disabled", false );
		this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
		return this._setOption( "disabled", false );
	},

	disable: function() {
		this.element.attr( "disabled", true );
		this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
		return this._setOption( "disabled", true );
	},

	refresh: function() {
		var $el = this.element;

		if ( $el.prop("disabled") ) {
			this.disable();
		} else {
			this.enable();
		}

		// Grab the button's text element from its implementation-independent data item
		$( this.button.data( 'buttonElements' ).text ).text( $el.text() || $el.val() );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.button.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.fn.controlgroup = function( options ) {
	function flipClasses( els, flCorners  ) {
		els.removeClass( "ui-btn-corner-all ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-controlgroup-last ui-shadow" )
			.eq( 0 ).addClass( flCorners[ 0 ] )
			.end()
			.last().addClass( flCorners[ 1 ] ).addClass( "ui-controlgroup-last" );
	}

	return this.each(function() {
		var $el = $( this ),
			o = $.extend({
						direction: $el.jqmData( "type" ) || "vertical",
						shadow: false,
						excludeInvisible: true,
						mini: $el.jqmData( "mini" )
					}, options ),
			groupheading = $el.children( "legend" ),
			flCorners = o.direction == "horizontal" ? [ "ui-corner-left", "ui-corner-right" ] : [ "ui-corner-top", "ui-corner-bottom" ],
			type = $el.find( "input" ).first().attr( "type" );
			
		$el.wrapInner( "<div class='ui-controlgroup-controls'></div>" );

		// Replace legend with more stylable replacement div
		if ( groupheading.length ) {
			$( "<div role='heading' class='ui-controlgroup-label'>" + groupheading.html() + "</div>" ).insertBefore( $el.children(0) );
			groupheading.remove();
		}

		$el.addClass( "ui-corner-all ui-controlgroup ui-controlgroup-" + o.direction );

		flipClasses( $el.find( ".ui-btn" + ( o.excludeInvisible ? ":visible" : "" ) ).not('.ui-slider-handle'), flCorners );
		flipClasses( $el.find( ".ui-btn-inner" ), flCorners );

		if ( o.shadow ) {
			$el.addClass( "ui-shadow" );
		}

		if ( o.mini ) {
			$el.addClass( "ui-mini" );
		}

	});
};

// The pagecreate handler for controlgroup is in jquery.mobile.init because of the soft-dependency on the wrapped widgets

})(jQuery);

(function( $, undefined ) {

$( document ).bind( "pagecreate create", function( e ){

	//links within content areas, tests included with page
	$( e.target )
		.find( "a" )
		.jqmEnhanceable()
		.not( ".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')" )
		.addClass( "ui-link" );

});

})( jQuery );


( function( $ ) {
	var	meta = $( "meta[name=viewport]" ),
        initialContent = meta.attr( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
        enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
		disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test( initialContent );
	
	$.mobile.zoom = $.extend( {}, {
		enabled: !disabledInitially,
		locked: false,
		disable: function( lock ) {
			if( !disabledInitially && !$.mobile.zoom.locked ){
	        	meta.attr( "content", disabledZoom );
	        	$.mobile.zoom.enabled = false;
				$.mobile.zoom.locked = lock || false;
			}
		},
		enable: function( unlock ) {
			if( !disabledInitially && ( !$.mobile.zoom.locked || unlock === true ) ){
		        meta.attr( "content", enabledZoom );
		        $.mobile.zoom.enabled = true;
				$.mobile.zoom.locked = false;
			}
		},
		restore: function() {
			if( !disabledInitially ){
	        	meta.attr( "content", initialContent );
	        	$.mobile.zoom.enabled = true;
			}
		}
	});

}( jQuery ));

(function( $, undefined ) {

$.widget( "mobile.textinput", $.mobile.widget, {
	options: {
		theme: null,
		// This option defaults to true on iOS devices.
		preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
		initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])",
		clearSearchButtonText: "clear text"
	},

	_create: function() {

		var input = this.element,
			o = this.options,
			theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
			themeclass  = " ui-body-" + theme,
			mini = input.jqmData("mini") == true,
			miniclass = mini ? " ui-mini" : "",
			focusedEl, clearbtn;

		$( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

		focusedEl = input.addClass("ui-input-text ui-body-"+ theme );

		// XXX: Temporary workaround for issue 785 (Apple bug 8910589).
		//      Turn off autocorrect and autocomplete on non-iOS 5 devices
		//      since the popup they use can't be dismissed by the user. Note
		//      that we test for the presence of the feature by looking for
		//      the autocorrect property on the input element. We currently
		//      have no test for iOS 5 or newer so we're temporarily using
		//      the touchOverflow support flag for jQM 1.0. Yes, I feel dirty. - jblas
		if ( typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow ) {
			// Set the attribute instead of the property just in case there
			// is code that attempts to make modifications via HTML.
			input[0].setAttribute( "autocorrect", "off" );
			input[0].setAttribute( "autocomplete", "off" );
		}


		//"search" input widget
		if ( input.is( "[type='search'],:jqmData(type='search')" ) ) {

			focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield" + themeclass + miniclass + "'></div>" ).parent();
			clearbtn = $( "<a href='#' class='ui-input-clear' title='" + o.clearSearchButtonText + "'>" + o.clearSearchButtonText + "</a>" )
				.bind('click', function( event ) {
					input
						.val( "" )
						.focus()
						.trigger( "change" );
					clearbtn.addClass( "ui-input-clear-hidden" );
					event.preventDefault();
				})
				.appendTo( focusedEl )
				.buttonMarkup({
					icon: "delete",
					iconpos: "notext",
					corners: true,
					shadow: true,
					mini: mini
				});

			function toggleClear() {
				setTimeout(function() {
					clearbtn.toggleClass( "ui-input-clear-hidden", !input.val() );
				}, 0);
			}

			toggleClear();

			input.bind('paste cut keyup focus change blur', toggleClear);

		} else {
			input.addClass( "ui-corner-all ui-shadow-inset" + themeclass + miniclass );
		}

		input.focus(function() {
				focusedEl.addClass( $.mobile.focusClass );
			})
			.blur(function(){
				focusedEl.removeClass( $.mobile.focusClass );
			})
			// In many situations, iOS will zoom into the select upon tap, this prevents that from happening
			.bind( "focus", function() {
				if( o.preventFocusZoom ){
					$.mobile.zoom.disable( true );
				}
			})
			.bind( "blur", function() {
				if( o.preventFocusZoom ){
					$.mobile.zoom.enable( true );
				}
			});

		// Autogrow
		if ( input.is( "textarea" ) ) {
			var extraLineHeight = 15,
				keyupTimeoutBuffer = 100,
				keyup = function() {
					var scrollHeight = input[ 0 ].scrollHeight,
						clientHeight = input[ 0 ].clientHeight;

					if ( clientHeight < scrollHeight ) {
						input.height(scrollHeight + extraLineHeight);
					}
				},
				keyupTimeout;

			input.keyup(function() {
				clearTimeout( keyupTimeout );
				keyupTimeout = setTimeout( keyup, keyupTimeoutBuffer );
			});

			// binding to pagechange here ensures that for pages loaded via
			// ajax the height is recalculated without user input
			$( document ).one( "pagechange", keyup );

			// Issue 509: the browser is not providing scrollHeight properly until the styles load
			if ( $.trim( input.val() ) ) {
				// bind to the window load to make sure the height is calculated based on BOTH
				// the DOM and CSS
				$( window ).load( keyup );
			}
		}
	},

	disable: function(){
		( this.element.attr( "disabled", true ).is( "[type='search'],:jqmData(type='search')" ) ?
			this.element.parent() : this.element ).addClass( "ui-disabled" );
	},

	enable: function(){
		( this.element.attr( "disabled", false).is( "[type='search'],:jqmData(type='search')" ) ?
			this.element.parent() : this.element ).removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.textinput.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.mobile.listview.prototype.options.filter = false;
$.mobile.listview.prototype.options.filterPlaceholder = "Filter items...";
$.mobile.listview.prototype.options.filterTheme = "c";
$.mobile.listview.prototype.options.filterCallback = function( text, searchValue ){
	return text.toLowerCase().indexOf( searchValue ) === -1;
};

$( document ).delegate( ":jqmData(role='listview')", "listviewcreate", function() {

	var list = $( this ),
		listview = list.data( "listview" );

	if ( !listview.options.filter ) {
		return;
	}

	var wrapper = $( "<form>", {
			"class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
			"role": "search"
		}),
		search = $( "<input>", {
			placeholder: listview.options.filterPlaceholder
		})
		.attr( "data-" + $.mobile.ns + "type", "search" )
		.jqmData( "lastval", "" )
		.bind( "keyup change", function() {

			var $this = $(this),
				val = this.value.toLowerCase(),
				listItems = null,
				lastval = $this.jqmData( "lastval" ) + "",
				childItems = false,
				itemtext = "",
				item;

			// Change val as lastval for next execution
			$this.jqmData( "lastval" , val );
			if ( val.length < lastval.length || val.indexOf(lastval) !== 0 ) {

				// Removed chars or pasted something totally different, check all items
				listItems = list.children();
			} else {

				// Only chars added, not removed, only use visible subset
				listItems = list.children( ":not(.ui-screen-hidden)" );
			}

			if ( val ) {

				// This handles hiding regular rows without the text we search for
				// and any list dividers without regular rows shown under it

				for ( var i = listItems.length - 1; i >= 0; i-- ) {
					item = $( listItems[ i ] );
					itemtext = item.jqmData( "filtertext" ) || item.text();

					if ( item.is( "li:jqmData(role=list-divider)" ) ) {

						item.toggleClass( "ui-filter-hidequeue" , !childItems );

						// New bucket!
						childItems = false;

					} else if ( listview.options.filterCallback( itemtext, val ) ) {

						//mark to be hidden
						item.toggleClass( "ui-filter-hidequeue" , true );
					} else {

						// There's a shown item in the bucket
						childItems = true;
					}
				}

				// Show items, not marked to be hidden
				listItems
					.filter( ":not(.ui-filter-hidequeue)" )
					.toggleClass( "ui-screen-hidden", false );

				// Hide items, marked to be hidden
				listItems
					.filter( ".ui-filter-hidequeue" )
					.toggleClass( "ui-screen-hidden", true )
					.toggleClass( "ui-filter-hidequeue", false );

			} else {

				//filtervalue is empty => show all
				listItems.toggleClass( "ui-screen-hidden", false );
			}
			listview._refreshCorners();
		})
		.appendTo( wrapper )
		.textinput();

	if ( listview.options.inset ) {
		wrapper.addClass( "ui-listview-filter-inset" );
	}

	wrapper.bind( "submit", function() {
		return false;
	})
	.insertBefore( list );
});

})( jQuery );

( function( $, undefined ) {

$.widget( "mobile.slider", $.mobile.widget, {
	options: {
		theme: null,
		trackTheme: null,
		disabled: false,
		initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
		mini: false
	},

	_create: function() {

		// TODO: Each of these should have comments explain what they're for
		var self = this,

			control = this.element,

			parentTheme = $.mobile.getInheritedTheme( control, "c" ),

			theme = this.options.theme || parentTheme,

			trackTheme = this.options.trackTheme || parentTheme,

			cType = control[ 0 ].nodeName.toLowerCase(),

			selectClass = ( cType == "select" ) ? "ui-slider-switch" : "",

			controlID = control.attr( "id" ),

			$label = $( "[for='" + controlID + "']" ),

			labelID = $label.attr( "id" ) || controlID + "-label",

			label = $label.attr( "id", labelID ),

			val = function() {
				return  cType == "input"  ? parseFloat( control.val() ) : control[0].selectedIndex;
			},

			min =  cType == "input" ? parseFloat( control.attr( "min" ) ) : 0,

			max =  cType == "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length-1,

			step = window.parseFloat( control.attr( "step" ) || 1 ),

			inlineClass = ( this.options.inline || control.jqmData("inline") == true ) ? " ui-slider-inline" : "",

			miniClass = ( this.options.mini || control.jqmData("mini") ) ? " ui-slider-mini" : "",


			domHandle = document.createElement('a'),
			handle = $( domHandle ),
			domSlider = document.createElement('div'),
			slider = $( domSlider ),

			valuebg = control.jqmData("highlight") && cType != "select" ? (function() {
				var bg = document.createElement('div');
				bg.className = 'ui-slider-bg ' + $.mobile.activeBtnClass + ' ui-btn-corner-all';
				return $( bg ).prependTo( slider );
			})() : false,

			options;

        domHandle.setAttribute( 'href', "#" );
		domSlider.setAttribute('role','application');
		domSlider.className = ['ui-slider ',selectClass," ui-btn-down-",trackTheme,' ui-btn-corner-all', inlineClass, miniClass].join("");
		domHandle.className = 'ui-slider-handle';
		domSlider.appendChild(domHandle);

		handle.buttonMarkup({ corners: true, theme: theme, shadow: true })
				.attr({
					"role": "slider",
					"aria-valuemin": min,
					"aria-valuemax": max,
					"aria-valuenow": val(),
					"aria-valuetext": val(),
					"title": val(),
					"aria-labelledby": labelID
				});

		$.extend( this, {
			slider: slider,
			handle: handle,
			valuebg: valuebg,
			dragging: false,
			beforeStart: null,
			userModified: false,
			mouseMoved: false
		});

		if ( cType == "select" ) {
			var wrapper = document.createElement('div');
			wrapper.className = 'ui-slider-inneroffset';

			for(var j = 0,length = domSlider.childNodes.length;j < length;j++){
				wrapper.appendChild(domSlider.childNodes[j]);
			}

			domSlider.appendChild(wrapper);

			// slider.wrapInner( "<div class='ui-slider-inneroffset'></div>" );

			// make the handle move with a smooth transition
			handle.addClass( "ui-slider-handle-snapping" );

			options = control.find( "option" );

			for(var i = 0, optionsCount = options.length; i < optionsCount; i++){
				var side = !i ? "b":"a",
					sliderTheme = !i ? " ui-btn-down-" + trackTheme :( " " + $.mobile.activeBtnClass ),
					sliderLabel = document.createElement('div'),
					sliderImg = document.createElement('span');

				sliderImg.className = ['ui-slider-label ui-slider-label-',side,sliderTheme," ui-btn-corner-all"].join("");
				sliderImg.setAttribute('role','img');
				sliderImg.appendChild(document.createTextNode(options[i].innerHTML));
				$(sliderImg).prependTo( slider );
			}

			self._labels = $( ".ui-slider-label", slider );

		}

		label.addClass( "ui-slider" );

		// monitor the input for updated values
		control.addClass( cType === "input" ? "ui-slider-input" : "ui-slider-switch" )
			.change( function() {
				// if the user dragged the handle, the "change" event was triggered from inside refresh(); don't call refresh() again
				if (!self.mouseMoved) {
					self.refresh( val(), true );
				}
			})
			.keyup( function() { // necessary?
				self.refresh( val(), true, true );
			})
			.blur( function() {
				self.refresh( val(), true );
			});

		// prevent screen drag when slider activated
		$( document ).bind( "vmousemove", function( event ) {
			if ( self.dragging ) {
				// self.mouseMoved must be updated before refresh() because it will be used in the control "change" event
				self.mouseMoved = true;

				if ( cType === "select" ) {
					// make the handle move in sync with the mouse
					handle.removeClass( "ui-slider-handle-snapping" );
				}

				self.refresh( event );

				// only after refresh() you can calculate self.userModified
				self.userModified = self.beforeStart !== control[0].selectedIndex;
				return false;
			}
		});

		slider.bind( "vmousedown", function( event ) {
			self.dragging = true;
			self.userModified = false;
			self.mouseMoved = false;

			if ( cType === "select" ) {
				self.beforeStart = control[0].selectedIndex;
			}

			self.refresh( event );
			return false;
		})
		.bind( "vclick", false );

		slider.add( document )
			.bind( "vmouseup", function() {
				if ( self.dragging ) {

					self.dragging = false;

					if ( cType === "select") {

						// make the handle move with a smooth transition
						handle.addClass( "ui-slider-handle-snapping" );

						if ( self.mouseMoved ) {

							// this is a drag, change the value only if user dragged enough
							if ( self.userModified ) {
								self.refresh( self.beforeStart == 0 ? 1 : 0 );
							}
							else {
								self.refresh( self.beforeStart );
							}

						}
						else {
							// this is just a click, change the value
							self.refresh( self.beforeStart == 0 ? 1 : 0 );
						}

					}

					self.mouseMoved = false;

					return false;
				}
			});

		slider.insertAfter( control );

		// Only add focus class to toggle switch, sliders get it automatically from ui-btn
		if( cType == 'select' ) {
			this.handle.bind({
				focus: function() {
					slider.addClass( $.mobile.focusClass );
				},

				blur: function() {
					slider.removeClass( $.mobile.focusClass );
				}
			});
		}

		this.handle.bind({
			// NOTE force focus on handle
			vmousedown: function() {
				$( this ).focus();
			},

			vclick: false,

			keydown: function( event ) {
				var index = val();

				if ( self.options.disabled ) {
					return;
				}

				// In all cases prevent the default and mark the handle as active
				switch ( event.keyCode ) {
					case $.mobile.keyCode.HOME:
					case $.mobile.keyCode.END:
					case $.mobile.keyCode.PAGE_UP:
					case $.mobile.keyCode.PAGE_DOWN:
					case $.mobile.keyCode.UP:
					case $.mobile.keyCode.RIGHT:
					case $.mobile.keyCode.DOWN:
					case $.mobile.keyCode.LEFT:
						event.preventDefault();

						if ( !self._keySliding ) {
							self._keySliding = true;
							$( this ).addClass( "ui-state-active" );
						}
						break;
				}

				// move the slider according to the keypress
				switch ( event.keyCode ) {
					case $.mobile.keyCode.HOME:
						self.refresh( min );
						break;
					case $.mobile.keyCode.END:
						self.refresh( max );
						break;
					case $.mobile.keyCode.PAGE_UP:
					case $.mobile.keyCode.UP:
					case $.mobile.keyCode.RIGHT:
						self.refresh( index + step );
						break;
					case $.mobile.keyCode.PAGE_DOWN:
					case $.mobile.keyCode.DOWN:
					case $.mobile.keyCode.LEFT:
						self.refresh( index - step );
						break;
				}
			}, // remove active mark

			keyup: function( event ) {
				if ( self._keySliding ) {
					self._keySliding = false;
					$( this ).removeClass( "ui-state-active" );
				}
			}
			});

		this.refresh(undefined, undefined, true);
	},

	refresh: function( val, isfromControl, preventInputUpdate ) {

		if ( this.options.disabled || this.element.attr('disabled')) {
			this.disable();
		}

		var control = this.element, percent,
			cType = control[0].nodeName.toLowerCase(),
			min = cType === "input" ? parseFloat( control.attr( "min" ) ) : 0,
			max = cType === "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length - 1,
			step = (cType === "input" && parseFloat( control.attr( "step" ) ) > 0) ? parseFloat(control.attr("step")) : 1;

		if ( typeof val === "object" ) {
			var data = val,
				// a slight tolerance helped get to the ends of the slider
				tol = 8;
			if ( !this.dragging ||
					data.pageX < this.slider.offset().left - tol ||
					data.pageX > this.slider.offset().left + this.slider.width() + tol ) {
				return;
			}
			percent = Math.round( ( ( data.pageX - this.slider.offset().left ) / this.slider.width() ) * 100 );
		} else {
			if ( val == null ) {
				val = cType === "input" ? parseFloat( control.val() || 0 ) : control[0].selectedIndex;
			}
			percent = ( parseFloat( val ) - min ) / ( max - min ) * 100;
		}

		if ( isNaN( percent ) ) {
			return;
		}

		if ( percent < 0 ) {
			percent = 0;
		}

		if ( percent > 100 ) {
			percent = 100;
		}

		var newval = ( percent / 100 ) * ( max - min ) + min;

		//from jQuery UI slider, the following source will round to the nearest step
		var valModStep = ( newval - min ) % step;
		var alignValue = newval - valModStep;

		if ( Math.abs( valModStep ) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}
		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see jQueryUI: #4124)
		newval = parseFloat( alignValue.toFixed(5) );

		if ( newval < min ) {
			newval = min;
		}

		if ( newval > max ) {
			newval = max;
		}

		this.handle.css( "left", percent + "%" );
		this.handle.attr( {
				"aria-valuenow": cType === "input" ? newval : control.find( "option" ).eq( newval ).attr( "value" ),
				"aria-valuetext": cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText(),
				title: cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText()
			});
		this.valuebg && this.valuebg.css( "width", percent + "%" );

		// drag the label widths
		if ( this._labels ) {
			var handlePercent = this.handle.width() / this.slider.width() * 100,
				aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100,
				bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

			this._labels.each(function(){
				var ab = $(this).is( ".ui-slider-label-a" );
				$( this ).width( ( ab ? aPercent : bPercent  ) + "%" );
			});
		}

		if ( !preventInputUpdate ) {
			var valueChanged = false;

			// update control"s value
			if ( cType === "input" ) {
				valueChanged = control.val() !== newval;
				control.val( newval );
			} else {
				valueChanged = control[ 0 ].selectedIndex !== newval;
				control[ 0 ].selectedIndex = newval;
			}
			if ( !isfromControl && valueChanged ) {
				control.trigger( "change" );
			}
		}
	},

	enable: function() {
		this.element.attr( "disabled", false );
		this.slider.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
		return this._setOption( "disabled", false );
	},

	disable: function() {
		this.element.attr( "disabled", true );
		this.slider.addClass( "ui-disabled" ).attr( "aria-disabled", true );
		return this._setOption( "disabled", true );
	}

});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.slider.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.selectmenu", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		icon: "arrow-d",
		iconpos: "right",
		inline: false,
		corners: true,
		shadow: true,
		iconshadow: true,
		overlayTheme: "a",
		hidePlaceholderMenuItems: true,
		closeText: "Close",
		nativeMenu: true,
		// This option defaults to true on iOS devices.
		preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
		initSelector: "select:not(:jqmData(role='slider'))",
		mini: false
	},

	_button: function(){
		return $( "<div/>" );
	},

	_setDisabled: function( value ) {
		this.element.attr( "disabled", value );
		this.button.attr( "aria-disabled", value );
		return this._setOption( "disabled", value );
	},

	_focusButton : function() {
		var self = this;

		setTimeout( function() {
			self.button.focus();
		}, 40);
	},

  _selectOptions: function() {
    return this.select.find( "option" );
  },

	// setup items that are generally necessary for select menu extension
	_preExtension: function(){
		var classes = "";
		// TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
		/* if( $el[0].className.length ) {
			classes = $el[0].className;
		} */
		if( !!~this.element[0].className.indexOf( "ui-btn-left" ) ) {
			classes =  " ui-btn-left";
		}
		
		if(  !!~this.element[0].className.indexOf( "ui-btn-right" ) ) {
			classes = " ui-btn-right";
		}
		
		this.select = this.element.wrap( "<div class='ui-select" + classes + "'>" );
		this.selectID  = this.select.attr( "id" );
		this.label = $( "label[for='"+ this.selectID +"']" ).addClass( "ui-select" );
		this.isMultiple = this.select[ 0 ].multiple;
		if ( !this.options.theme ) {
			this.options.theme = $.mobile.getInheritedTheme( this.select, "c" );
		}
	},

	_create: function() {
		this._preExtension();

 		// Allows for extension of the native select for custom selects and other plugins
		// see select.custom for example extension
		// TODO explore plugin registration
		this._trigger( "beforeCreate" );

		this.button = this._button();

		var self = this,

			options = this.options,

			inline = options.inline || this.select.jqmData( "inline" ),
			mini = options.mini || this.select.jqmData( "mini" ),			
			iconpos = options.icon ? ( options.iconpos || this.select.jqmData( "iconpos" ) ) : false,

			// IE throws an exception at options.item() function when
			// there is no selected item
			// select first in this case
			selectedIndex = this.select[ 0 ].selectedIndex == -1 ? 0 : this.select[ 0 ].selectedIndex,

			// TODO values buttonId and menuId are undefined here
			button = this.button
				.text( $( this.select[ 0 ].options.item( selectedIndex ) ).text() )
				.insertBefore( this.select )
				.buttonMarkup( {
					theme: options.theme,
					icon: options.icon,
					iconpos: iconpos,
					inline: inline,
					corners: options.corners,
					shadow: options.shadow,
					iconshadow: options.iconshadow,
					mini: mini
				});

		// Opera does not properly support opacity on select elements
		// In Mini, it hides the element, but not its text
		// On the desktop,it seems to do the opposite
		// for these reasons, using the nativeMenu option results in a full native select in Opera
		if ( options.nativeMenu && window.opera && window.opera.version ) {
			button.addClass( "ui-select-nativeonly" );
		}	

		// Add counter for multi selects
		if ( this.isMultiple ) {
			this.buttonCount = $( "<span>" )
				.addClass( "ui-li-count ui-btn-up-c ui-btn-corner-all" )
				.hide()
				.appendTo( button.addClass('ui-li-has-count') );
		}

		// Disable if specified
		if ( options.disabled || this.element.attr('disabled')) {
			this.disable();
		}

		// Events on native select
		this.select.change( function() {
			self.refresh();
		});

		this.build();
	},

	build: function() {
		var self = this;

		this.select
			.appendTo( self.button )
			.bind( "vmousedown", function() {
				// Add active class to button
				self.button.addClass( $.mobile.activeBtnClass );
			})
            .bind( "focus", function() {
                self.button.addClass( $.mobile.focusClass );
            })
            .bind( "blur", function() {
                self.button.removeClass( $.mobile.focusClass );
            })
			.bind( "focus vmouseover", function() {
				self.button.trigger( "vmouseover" );
			})
			.bind( "vmousemove", function() {
				// Remove active class on scroll/touchmove
				self.button.removeClass( $.mobile.activeBtnClass );
			})
			.bind( "change blur vmouseout", function() {
				self.button.trigger( "vmouseout" )
					.removeClass( $.mobile.activeBtnClass );
			})
			.bind( "change blur", function() {
				self.button.removeClass( "ui-btn-down-" + self.options.theme );
			});

		// In many situations, iOS will zoom into the select upon tap, this prevents that from happening
		self.button.bind( "vmousedown", function() {
			if( self.options.preventFocusZoom ){
				$.mobile.zoom.disable( true );
			}
		})
		.bind( "mouseup", function() {
			if( self.options.preventFocusZoom ){
				$.mobile.zoom.enable( true );
			}
		});
	},

	selected: function() {
		return this._selectOptions().filter( ":selected" );
	},

	selectedIndices: function() {
		var self = this;

		return this.selected().map( function() {
			return self._selectOptions().index( this );
		}).get();
	},

	setButtonText: function() {
		var self = this, selected = this.selected();

		this.button.find( ".ui-btn-text" ).text( function() {
			if ( !self.isMultiple ) {
				return selected.text();
			}

			return selected.length ? selected.map( function() {
				return $( this ).text();
			}).get().join( ", " ) : self.placeholder;
		});
	},

	setButtonCount: function() {
		var selected = this.selected();

		// multiple count inside button
		if ( this.isMultiple ) {
			this.buttonCount[ selected.length > 1 ? "show" : "hide" ]().text( selected.length );
		}
	},

	refresh: function() {
		this.setButtonText();
		this.setButtonCount();
	},

	// open and close preserved in native selects
	// to simplify users code when looping over selects
	open: $.noop,
	close: $.noop,

	disable: function() {
		this._setDisabled( true );
		this.button.addClass( "ui-disabled" );
	},

	enable: function() {
		this._setDisabled( false );
		this.button.removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.selectmenu.prototype.enhanceWithin( e.target, true );
});
})( jQuery );

/*
* custom "selectmenu" plugin
*/

(function( $, undefined ) {
	var extendSelect = function( widget ){

		var select = widget.select,
			selectID  = widget.selectID,
			label = widget.label,
			thisPage = widget.select.closest( ".ui-page" ),
			screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"} ).appendTo( thisPage ),
			selectOptions = widget._selectOptions(),
			isMultiple = widget.isMultiple = widget.select[ 0 ].multiple,
			buttonId = selectID + "-button",
			menuId = selectID + "-menu",
			menuPage = $( "<div data-" + $.mobile.ns + "role='dialog' data-" +$.mobile.ns + "theme='"+ widget.options.theme +"' data-" +$.mobile.ns + "overlay-theme='"+ widget.options.overlayTheme +"'>" +
				"<div data-" + $.mobile.ns + "role='header'>" +
				"<div class='ui-title'>" + label.getEncodedText() + "</div>"+
				"</div>"+
				"<div data-" + $.mobile.ns + "role='content'></div>"+
				"</div>" ),

			listbox =  $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + widget.options.overlayTheme + " " + $.mobile.defaultDialogTransition } ).insertAfter(screen),

			list = $( "<ul>", {
				"class": "ui-selectmenu-list",
				"id": menuId,
				"role": "listbox",
				"aria-labelledby": buttonId
			}).attr( "data-" + $.mobile.ns + "theme", widget.options.theme ).appendTo( listbox ),

			header = $( "<div>", {
				"class": "ui-header ui-bar-" + widget.options.theme
			}).prependTo( listbox ),

			headerTitle = $( "<h1>", {
				"class": "ui-title"
			}).appendTo( header ),

			menuPageContent,
			menuPageClose,
			headerClose;

		if( widget.isMultiple ) {
			headerClose = $( "<a>", {
				"text": widget.options.closeText,
				"href": "#",
				"class": "ui-btn-left"
			}).attr( "data-" + $.mobile.ns + "iconpos", "notext" ).attr( "data-" + $.mobile.ns + "icon", "delete" ).appendTo( header ).buttonMarkup();
		}

		$.extend( widget, {
			select: widget.select,
			selectID: selectID,
			buttonId: buttonId,
			menuId: menuId,
			thisPage: thisPage,
			menuPage: menuPage,
			label: label,
			screen: screen,
			selectOptions: selectOptions,
			isMultiple: isMultiple,
			theme: widget.options.theme,
			listbox: listbox,
			list: list,
			header: header,
			headerTitle: headerTitle,
			headerClose: headerClose,
			menuPageContent: menuPageContent,
			menuPageClose: menuPageClose,
			placeholder: "",

			build: function() {
				var self = this;

				// Create list from select, update state
				self.refresh();

				self.select.attr( "tabindex", "-1" ).focus(function() {
					$( this ).blur();
					self.button.focus();
				});

				// Button events
				self.button.bind( "vclick keydown" , function( event ) {
					if ( event.type == "vclick" ||
							 event.keyCode && ( event.keyCode === $.mobile.keyCode.ENTER ||
																	event.keyCode === $.mobile.keyCode.SPACE ) ) {

						self.open();
						event.preventDefault();
					}
				});

				// Events for list items
				self.list.attr( "role", "listbox" )
					.bind( "focusin", function( e ){
						$( e.target )
							.attr( "tabindex", "0" )
							.trigger( "vmouseover" );

					})
					.bind( "focusout", function( e ){
						$( e.target )
							.attr( "tabindex", "-1" )
							.trigger( "vmouseout" );
					})
					.delegate( "li:not(.ui-disabled, .ui-li-divider)", "click", function( event ) {

						// index of option tag to be selected
						var oldIndex = self.select[ 0 ].selectedIndex,
							newIndex = self.list.find( "li:not(.ui-li-divider)" ).index( this ),
							option = self._selectOptions().eq( newIndex )[ 0 ];

						// toggle selected status on the tag for multi selects
						option.selected = self.isMultiple ? !option.selected : true;

						// toggle checkbox class for multiple selects
						if ( self.isMultiple ) {
							$( this ).find( ".ui-icon" )
								.toggleClass( "ui-icon-checkbox-on", option.selected )
								.toggleClass( "ui-icon-checkbox-off", !option.selected );
						}

						// trigger change if value changed
						if ( self.isMultiple || oldIndex !== newIndex ) {
							self.select.trigger( "change" );
						}

						// hide custom select for single selects only - otherwise focus clicked item
						// We need to grab the clicked item the hard way, because the list may have been rebuilt
						if ( self.isMultiple ) {
							self.list.find( "li:not(.ui-li-divider)" ).eq( newIndex )
								.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
						}
						else {
							self.close();
						}

						event.preventDefault();
					})
					.keydown(function( event ) {  //keyboard events for menu items
						var target = $( event.target ),
							li = target.closest( "li" ),
							prev, next;

						// switch logic based on which key was pressed
						switch ( event.keyCode ) {
							// up or left arrow keys
						 case 38:
							prev = li.prev().not( ".ui-selectmenu-placeholder" );

							if( prev.is( ".ui-li-divider" ) ) {
								prev = prev.prev();
							}

							// if there's a previous option, focus it
							if ( prev.length ) {
								target
									.blur()
									.attr( "tabindex", "-1" );

								prev.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
							}

							return false;
							break;

							// down or right arrow keys
						 case 40:
							next = li.next();

							if( next.is( ".ui-li-divider" ) ) {
								next = next.next();
							}

							// if there's a next option, focus it
							if ( next.length ) {
								target
									.blur()
									.attr( "tabindex", "-1" );

								next.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
							}

							return false;
							break;

							// If enter or space is pressed, trigger click
						 case 13:
						 case 32:
							target.trigger( "click" );

							return false;
							break;
						}
					});

				// button refocus ensures proper height calculation
				// by removing the inline style and ensuring page inclusion
				self.menuPage.bind( "pagehide", function() {
					self.list.appendTo( self.listbox );
					self._focusButton();

					// TODO centralize page removal binding / handling in the page plugin.
					// Suggestion from @jblas to do refcounting
					//
					// TODO extremely confusing dependency on the open method where the pagehide.remove
					// bindings are stripped to prevent the parent page from disappearing. The way
					// we're keeping pages in the DOM right now sucks
					//
					// rebind the page remove that was unbound in the open function
					// to allow for the parent page removal from actions other than the use
					// of a dialog sized custom select
					//
					// doing this here provides for the back button on the custom select dialog
					$.mobile._bindPageRemove.call( self.thisPage );
				});

				// Events on "screen" overlay
				self.screen.bind( "vclick", function( event ) {
					self.close();
				});

				// Close button on small overlays
				if( self.isMultiple ){
					self.headerClose.click( function() {
						if ( self.menuType == "overlay" ) {
							self.close();
							return false;
						}
					});
				}

				// track this dependency so that when the parent page
				// is removed on pagehide it will also remove the menupage
				self.thisPage.addDependents( this.menuPage );
			},

			_isRebuildRequired: function() {
				var list = this.list.find( "li" ),
					options = this._selectOptions();

				// TODO exceedingly naive method to determine difference
				// ignores value changes etc in favor of a forcedRebuild
				// from the user in the refresh method
				return options.text() !== list.text();
			},

			selected: function() {
				return this._selectOptions().filter( ":selected:not(:jqmData(placeholder='true'))" );
			},

			refresh: function( forceRebuild , foo ){
				var self = this,
				select = this.element,
				isMultiple = this.isMultiple,
				indicies;

				if (  forceRebuild || this._isRebuildRequired() ) {
					self._buildList();
				}

				indicies = this.selectedIndices();

				self.setButtonText();
				self.setButtonCount();

				self.list.find( "li:not(.ui-li-divider)" )
					.removeClass( $.mobile.activeBtnClass )
					.attr( "aria-selected", false )
					.each(function( i ) {

						if ( $.inArray( i, indicies ) > -1 ) {
							var item = $( this );

							// Aria selected attr
							item.attr( "aria-selected", true );

							// Multiple selects: add the "on" checkbox state to the icon
							if ( self.isMultiple ) {
								item.find( ".ui-icon" ).removeClass( "ui-icon-checkbox-off" ).addClass( "ui-icon-checkbox-on" );
							} else {
								if( item.is( ".ui-selectmenu-placeholder" ) ) {
									item.next().addClass( $.mobile.activeBtnClass );
								} else {
									item.addClass( $.mobile.activeBtnClass );
								}
							}
						}
					});
			},

			close: function() {
				if ( this.options.disabled || !this.isOpen ) {
					return;
				}

				var self = this;

				if ( self.menuType == "page" ) {
					// doesn't solve the possible issue with calling change page
					// where the objects don't define data urls which prevents dialog key
					// stripping - changePage has incoming refactor
					window.history.back();
				} else {
					self.screen.addClass( "ui-screen-hidden" );
					self.listbox.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" ).removeClass( "in" );
					self.list.appendTo( self.listbox );
					self._focusButton();
				}

				// allow the dialog to be closed again
				self.isOpen = false;
			},

			open: function() {
				if ( this.options.disabled ) {
					return;
				}

				var self = this,
          $window = $( window ),
          selfListParent = self.list.parent(),
					menuHeight = selfListParent.outerHeight(),
					menuWidth = selfListParent.outerWidth(),
					activePage = $( ".ui-page-active" ),
					tScrollElem = activePage,
					scrollTop = $window.scrollTop(),
					btnOffset = self.button.offset().top,
					screenHeight = $window.height(),
					screenWidth = $window.width();

				//add active class to button
				self.button.addClass( $.mobile.activeBtnClass );

				//remove after delay
				setTimeout( function() {
					self.button.removeClass( $.mobile.activeBtnClass );
				}, 300);

				function focusMenuItem() {
					var selector = self.list.find( "." + $.mobile.activeBtnClass + " a" );
					if ( selector.length === 0 ) {
						selector = self.list.find( "li.ui-btn:not(:jqmData(placeholder='true')) a" );
					}
					selector.first().focus().closest( "li" ).addClass( "ui-btn-down-" + widget.options.theme );
				}

				if ( menuHeight > screenHeight - 80 || !$.support.scrollTop ) {

					self.menuPage.appendTo( $.mobile.pageContainer ).page();
					self.menuPageContent = menuPage.find( ".ui-content" );
					self.menuPageClose = menuPage.find( ".ui-header a" );

					// prevent the parent page from being removed from the DOM,
					// otherwise the results of selecting a list item in the dialog
					// fall into a black hole
					self.thisPage.unbind( "pagehide.remove" );

					//for WebOS/Opera Mini (set lastscroll using button offset)
					if ( scrollTop == 0 && btnOffset > screenHeight ) {
						self.thisPage.one( "pagehide", function() {
							$( this ).jqmData( "lastScroll", btnOffset );
						});
					}

					self.menuPage.one( "pageshow", function() {
						focusMenuItem();
						self.isOpen = true;
					});

					self.menuType = "page";
					self.menuPageContent.append( self.list );
					self.menuPage.find("div .ui-title").text(self.label.text());
					$.mobile.changePage( self.menuPage, {
						transition: $.mobile.defaultDialogTransition
					});
				} else {
					self.menuType = "overlay";

					self.screen.height( $(document).height() )
						.removeClass( "ui-screen-hidden" );

					// Try and center the overlay over the button
					var roomtop = btnOffset - scrollTop,
						roombot = scrollTop + screenHeight - btnOffset,
						halfheight = menuHeight / 2,
						maxwidth = parseFloat( self.list.parent().css( "max-width" ) ),
						newtop, newleft;

					if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
						newtop = btnOffset + ( self.button.outerHeight() / 2 ) - halfheight;
					} else {
						// 30px tolerance off the edges
						newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
					}

					// If the menuwidth is smaller than the screen center is
					if ( menuWidth < maxwidth ) {
						newleft = ( screenWidth - menuWidth ) / 2;
					} else {

						//otherwise insure a >= 30px offset from the left
						newleft = self.button.offset().left + self.button.outerWidth() / 2 - menuWidth / 2;

						// 30px tolerance off the edges
						if ( newleft < 30 ) {
							newleft = 30;
						} else if ( (newleft + menuWidth) > screenWidth ) {
							newleft = screenWidth - menuWidth - 30;
						}
					}

					self.listbox.append( self.list )
						.removeClass( "ui-selectmenu-hidden" )
						.css({
							top: newtop,
							left: newleft
						})
						.addClass( "in" );

					focusMenuItem();

					// duplicate with value set in page show for dialog sized selects
					self.isOpen = true;
				}
			},

			_buildList: function() {
				var self = this,
					o = this.options,
					placeholder = this.placeholder,
					needPlaceholder = true,
					optgroups = [],
					lis = [],
					dataIcon = self.isMultiple ? "checkbox-off" : "false";

				self.list.empty().filter( ".ui-listview" ).listview( "destroy" );

				var $options = self.select.find("option"),
					numOptions = $options.length,
					select = this.select[ 0 ],
					dataPrefix = 'data-' + $.mobile.ns,
					dataIndexAttr = dataPrefix + 'option-index',
					dataIconAttr = dataPrefix + 'icon',
					dataRoleAttr = dataPrefix + 'role',
					dataPlaceholderAttr = dataPrefix + 'placeholder',
					fragment = document.createDocumentFragment(),
					isPlaceholderItem = false,
					optGroup;

				for (var i = 0; i < numOptions;i++, isPlaceholderItem = false){
					var option = $options[i],
						$option = $(option),
						parent = option.parentNode,
						text = $option.text(),
						anchor  = document.createElement('a'),
						classes = [];

					anchor.setAttribute('href','#');
					anchor.appendChild(document.createTextNode(text));

					// Are we inside an optgroup?
					if (parent !== select && parent.nodeName.toLowerCase() === "optgroup"){
						var optLabel = parent.getAttribute('label');
						if ( optLabel != optGroup) {
							var divider = document.createElement('li');
							divider.setAttribute(dataRoleAttr,'list-divider');
							divider.setAttribute('role','option');
							divider.setAttribute('tabindex','-1');
							divider.appendChild(document.createTextNode(optLabel));
							fragment.appendChild(divider);
							optGroup = optLabel;
						}
					}

					if (needPlaceholder && (!option.getAttribute( "value" ) || text.length == 0 || $option.jqmData( "placeholder" ))) {
						needPlaceholder = false;
						isPlaceholderItem = true;

						// If we have identified a placeholder, mark it retroactively in the select as well
						option.setAttribute( dataPlaceholderAttr, true );
						if ( o.hidePlaceholderMenuItems ) {
							classes.push( "ui-selectmenu-placeholder" );
						}
						if (!placeholder) {
							placeholder = self.placeholder = text;
						}
					}

					var item = document.createElement('li');
					if ( option.disabled ) {
						classes.push( "ui-disabled" );
						item.setAttribute('aria-disabled',true);
					}
					item.setAttribute(dataIndexAttr,i);
					item.setAttribute(dataIconAttr,dataIcon);
					if ( isPlaceholderItem ) {
						item.setAttribute( dataPlaceholderAttr, true );
					}
					item.className = classes.join(" ");
					item.setAttribute('role','option');
					anchor.setAttribute('tabindex','-1');
					item.appendChild(anchor);
					fragment.appendChild(item);
				}

				self.list[0].appendChild(fragment);

				// Hide header if it's not a multiselect and there's no placeholder
				if ( !this.isMultiple && !placeholder.length ) {
					this.header.hide();
				} else {
					this.headerTitle.text( this.placeholder );
				}

				// Now populated, create listview
				self.list.listview();
			},

			_button: function(){
				return $( "<a>", {
					"href": "#",
					"role": "button",
					// TODO value is undefined at creation
					"id": this.buttonId,
					"aria-haspopup": "true",

					// TODO value is undefined at creation
					"aria-owns": this.menuId
				});
			}
		});
	};

	// issue #3894 - core doesn't triggered events on disabled delegates
	$( document ).bind( "selectmenubeforecreate", function( event ){
		var selectmenuWidget = $( event.target ).data( "selectmenu" );

		if( !selectmenuWidget.options.nativeMenu ){
			extendSelect( selectmenuWidget );
		}
	});
})( jQuery );

(function( $, undefined ) {


	$.widget( "mobile.fixedtoolbar", $.mobile.widget, {
		options: {
			visibleOnPageShow: true,
			disablePageZoom: true,
			transition: "slide", //can be none, fade, slide (slide maps to slideup or slidedown)
			fullscreen: false,
			tapToggle: true,
			tapToggleBlacklist: "a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed",
			hideDuringFocus: "input, textarea, select",
			updatePagePadding: true,
			trackPersistentToolbars: true,

			// Browser detection! Weeee, here we go...
			// Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
			// Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
			// Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
			// The following function serves to rule out some popular browsers with known fixed-positioning issues
			// This is a plugin option like any other, so feel free to improve or overwrite it
			supportBlacklist: function(){
				var w = window,
					ua = navigator.userAgent,
					platform = navigator.platform,
					// Rendering engine is Webkit, and capture major version
					wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
					wkversion = !!wkmatch && wkmatch[ 1 ],
					ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
					ffversion = !!ffmatch && ffmatch[ 1 ],
					operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
					omversion = !!operammobilematch && operammobilematch[ 1 ];

				if(
					// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
					( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 )
					||
					// Opera Mini
					( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" )
					||
					( operammobilematch && omversion < 7458 )
					||
					//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
					( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 )
					||
					// Firefox Mobile before 6.0 -
					( ffversion && ffversion < 6 )
					||
					// WebOS less than 3
					( "palmGetResource" in window && wkversion && wkversion < 534 )
					||
					// MeeGo
					( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 )
				){
					return true;
				}

				return false;
			},
			initSelector: ":jqmData(position='fixed')"
		},

		_create: function() {

			var self = this,
				o = self.options,
				$el = self.element,
				tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer",
				$page = $el.closest(".ui-page");

			// Feature detecting support for
			if( o.supportBlacklist() ){
				self.destroy();
				return;
			}

			$el.addClass( "ui-"+ tbtype +"-fixed" );

			// "fullscreen" overlay positioning
			if( o.fullscreen ){
				$el.addClass( "ui-"+ tbtype +"-fullscreen" );
				$page.addClass( "ui-page-" + tbtype + "-fullscreen" );
			}
			// If not fullscreen, add class to page to set top or bottom padding
			else{
				$page.addClass( "ui-page-" + tbtype + "-fixed" );
			}

			self._addTransitionClass();
			self._bindPageEvents();
			self._bindToggleHandlers();
		},

		_addTransitionClass: function(){
			var tclass = this.options.transition;

			if( tclass && tclass !== "none" ){
				// use appropriate slide for header or footer
				if( tclass === "slide" ){
					tclass = this.element.is( ".ui-header" ) ? "slidedown" : "slideup";
				}

				this.element.addClass( tclass );
			}
		},

		_bindPageEvents: function(){
			var self = this,
				o = self.options,
				$el = self.element;

			//page event bindings
			// Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
			// This method is meant to disable zoom while a fixed-positioned toolbar page is visible
			$el.closest( ".ui-page" )
				.bind( "pagebeforeshow", function(){
					if( o.disablePageZoom ){
						$.mobile.zoom.disable( true );
					}
					if( !o.visibleOnPageShow ){
						self.hide( true );
					}
				} )
				.bind( "webkitAnimationStart animationstart updatelayout", function(){
					var thisPage = this;
					if( o.updatePagePadding ){
						self.updatePagePadding( thisPage );
					}
				})
				.bind( "pageshow", function(){
					var thisPage = this;
					self.updatePagePadding( thisPage );
					if( o.updatePagePadding ){
						$( window ).bind( "throttledresize." + self.widgetName, function(){
						 	self.updatePagePadding( thisPage );
						});
					}
				})
				.bind( "pagebeforehide", function( e, ui ){
					if( o.disablePageZoom ){
						$.mobile.zoom.enable( true );
					}
					if( o.updatePagePadding ){
						$( window ).unbind( "throttledresize." + self.widgetName );
					}

					if( o.trackPersistentToolbars ){
						var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
							thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
							nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ),
							nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage );

						nextFooter = nextFooter || $();

							if( nextFooter.length || nextHeader.length ){

								nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );

								ui.nextPage.one( "pageshow", function(){
									nextFooter.add( nextHeader ).appendTo( this );
								});
							}
					}
				});
		},

		_visible: true,

		// This will set the content element's top or bottom padding equal to the toolbar's height
		updatePagePadding: function( tbPage ) {
			var $el = this.element,
				header = $el.is( ".ui-header" );

			// This behavior only applies to "fixed", not "fullscreen"
			if( this.options.fullscreen ){ return; }

			tbPage = tbPage || $el.closest( ".ui-page" );
			$( tbPage ).css( "padding-" + ( header ? "top" : "bottom" ), $el.outerHeight() );
		},
		
		_useTransition: function( notransition ){
			var $win = $( window ),
				$el = this.element,
				scroll = $win.scrollTop(),
				elHeight = $el.height(),
				pHeight = $el.closest( ".ui-page" ).height(),
				viewportHeight = $.mobile.getScreenHeight(),
				tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer";
				
			return !notransition &&
				( this.options.transition && this.options.transition !== "none" &&
				(
					( tbtype === "header" && !this.options.fullscreen && scroll > elHeight ) ||
					( tbtype === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight )
				) || this.options.fullscreen
				);
		},

		show: function( notransition ){
			var hideClass = "ui-fixed-hidden",
				$el = this.element;

				if( this._useTransition( notransition ) ){
				$el
					.removeClass( "out " + hideClass )
					.addClass( "in" );
			}
			else {
				$el.removeClass( hideClass );
			}
			this._visible = true;
		},

		hide: function( notransition ){
			var hideClass = "ui-fixed-hidden",
				$el = this.element,
				// if it's a slide transition, our new transitions need the reverse class as well to slide outward
				outclass = "out" + ( this.options.transition === "slide" ? " reverse" : "" );

			if( this._useTransition( notransition ) ){
				$el
					.addClass( outclass )
					.removeClass( "in" )
					.animationComplete( function(){
						$el.addClass( hideClass ).removeClass( outclass );
					});
			}
			else {
				$el.addClass( hideClass ).removeClass( outclass );
			}
			this._visible = false;
		},

		toggle: function(){
			this[ this._visible ? "hide" : "show" ]();
		},

		_bindToggleHandlers: function(){
			var self = this,
				o = self.options,
				$el = self.element;

			// tap toggle
			$el.closest( ".ui-page" )
				.bind( "vclick", function( e ){
					if( o.tapToggle && !$( e.target ).closest( o.tapToggleBlacklist ).length ){
						self.toggle();
					}
				})
				.bind( "focusin focusout", function( e ){
					if( screen.width < 500 && $( e.target ).is( o.hideDuringFocus ) && !$( e.target ).closest( ".ui-header-fixed, .ui-footer-fixed" ).length ){
						self[ ( e.type === "focusin" && self._visible ) ? "hide" : "show" ]();
					}
				});
		},

		destroy: function(){
			this.element.removeClass( "ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden" );
			this.element.closest( ".ui-page" ).removeClass( "ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen" );
		}

	});

	//auto self-init widgets
	$( document )
		.bind( "pagecreate create", function( e ){
			
			// DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
			// This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
			if( $( e.target ).jqmData( "fullscreen" ) ){
				$( $.mobile.fixedtoolbar.prototype.options.initSelector, e.target ).not( ":jqmData(fullscreen)" ).jqmData( "fullscreen", true );
			}
			
			$.mobile.fixedtoolbar.prototype.enhanceWithin( e.target );
		});

})( jQuery );

( function( $, window ) {
	
	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	if( !(/iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ){
		return;
	}
	
    var zoom = $.mobile.zoom,
		evt, x, y, z, aig;
	
    function checkTilt( e ){
		evt = e.originalEvent;
		aig = evt.accelerationIncludingGravity;
		
		x = Math.abs( aig.x );
		y = Math.abs( aig.y );
		z = Math.abs( aig.z );
				
		// If portrait orientation and in one of the danger zones
        if( !window.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
			if( zoom.enabled ){
				zoom.disable();
			}        	
        }
		else if( !zoom.enabled ){
			zoom.enable();
        }
    }

    $( window )
		.bind( "orientationchange.iosorientationfix", zoom.enable )
		.bind( "devicemotion.iosorientationfix", checkTilt );

}( jQuery, this ));

( function( $, window, undefined ) {
	var	$html = $( "html" ),
			$head = $( "head" ),
			$window = $( window );

	// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
	$( window.document ).trigger( "mobileinit" );

	// support conditions
	// if device support condition(s) aren't met, leave things as they are -> a basic, usable experience,
	// otherwise, proceed with the enhancements
	if ( !$.mobile.gradeA() ) {
		return;
	}

	// override ajaxEnabled on platforms that have known conflicts with hash history updates
	// or generally work better browsing in regular http for full page refreshes (BB5, Opera Mini)
	if ( $.mobile.ajaxBlacklist ) {
		$.mobile.ajaxEnabled = false;
	}

	// Add mobile, initial load "rendering" classes to docEl
	$html.addClass( "ui-mobile ui-mobile-rendering" );

	// This is a fallback. If anything goes wrong (JS errors, etc), or events don't fire,
	// this ensures the rendering class is removed after 5 seconds, so content is visible and accessible
	setTimeout( hideRenderingClass, 5000 );

	// loading div which appears during Ajax requests
	// will not appear if $.mobile.loadingMessage is false
	var loaderClass = "ui-loader",
		$loader = $( "<div class='" + loaderClass + "'><span class='ui-icon ui-icon-loading'></span><h1></h1></div>" );

	// For non-fixed supportin browsers. Position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top
	function fakeFixLoader(){
		var activeBtn = $( "." + $.mobile.activeBtnClass ).first();

		$loader
			.css({
				top: $.support.scrollTop && $window.scrollTop() + $window.height() / 2 ||
				activeBtn.length && activeBtn.offset().top || 100
			});
	}

	// check position of loader to see if it appears to be "fixed" to center
	// if not, use abs positioning
	function checkLoaderPosition(){
		var offset = $loader.offset(),
			scrollTop = $window.scrollTop(),
			screenHeight = $.mobile.getScreenHeight();

		if( offset.top < scrollTop || (offset.top - scrollTop) > screenHeight ) {
			$loader.addClass( "ui-loader-fakefix" );
			fakeFixLoader();
			$window
				.unbind( "scroll", checkLoaderPosition )
				.bind( "scroll", fakeFixLoader );
		}
	}

	//remove initial build class (only present on first pageshow)
	function hideRenderingClass(){
		$html.removeClass( "ui-mobile-rendering" );
	}

	$.extend($.mobile, {
		// turn on/off page loading message.
		showPageLoadingMsg: function( theme, msgText, textonly ) {
			$html.addClass( "ui-loading" );

			if ( $.mobile.loadingMessage ) {
				// text visibility from argument takes priority
				var textVisible = textonly || $.mobile.loadingMessageTextVisible;

				theme = theme || $.mobile.loadingMessageTheme,

				$loader
					.attr( "class", loaderClass + " ui-corner-all ui-body-" + ( theme || "a" ) + " ui-loader-" + ( textVisible ? "verbose" : "default" ) + ( textonly ? " ui-loader-textonly" : "" ) )
					.find( "h1" )
						.text( msgText || $.mobile.loadingMessage )
						.end()
					.appendTo( $.mobile.pageContainer );

				checkLoaderPosition();
				$window.bind( "scroll", checkLoaderPosition );
			}
		},

		hidePageLoadingMsg: function() {
			$html.removeClass( "ui-loading" );

			if( $.mobile.loadingMessage ){
				$loader.removeClass( "ui-loader-fakefix" );
			}

			$( window ).unbind( "scroll", fakeFixLoader );
			$( window ).unbind( "scroll", checkLoaderPosition );
		},

		// find and enhance the pages in the dom and transition to the first page.
		initializePage: function() {
			// find present pages
			var $pages = $( ":jqmData(role='page'), :jqmData(role='dialog')" );

			// if no pages are found, create one with body's inner html
			if ( !$pages.length ) {
				$pages = $( "body" ).wrapInner( "<div data-" + $.mobile.ns + "role='page'></div>" ).children( 0 );
			}

			// add dialogs, set data-url attrs
			$pages.each(function() {
				var $this = $(this);

				// unless the data url is already set set it to the pathname
				if ( !$this.jqmData("url") ) {
					$this.attr( "data-" + $.mobile.ns + "url", $this.attr( "id" ) || location.pathname + location.search );
				}
			});

			// define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
			$.mobile.firstPage = $pages.first();

			// define page container
			$.mobile.pageContainer = $pages.first().parent().addClass( "ui-mobile-viewport" );

			// alert listeners that the pagecontainer has been determined for binding
			// to events triggered on it
			$window.trigger( "pagecontainercreate" );

			// cue page loading message
			$.mobile.showPageLoadingMsg();

			//remove initial build class (only present on first pageshow)
			hideRenderingClass();

			// if hashchange listening is disabled, there's no hash deeplink,
			// the hash is not valid (contains more than one # or does not start with #)
			// or there is no page with that hash, change to the first page in the DOM
			// Remember, however, that the hash can also be a path!
			if ( ! ( $.mobile.hashListeningEnabled &&
			         $.mobile.path.isHashValid( location.hash ) &&
			         ( $( location.hash + ':jqmData(role="page")' ).length ||
			           $.mobile.path.isPath( location.hash ) ) ) ) {
				$.mobile.changePage( $.mobile.firstPage, { transition: "none", reverse: true, changeHash: false, fromHashChange: true } );
			}
			// otherwise, trigger a hashchange to load a deeplink
			else {
				$window.trigger( "hashchange", [ true ] );
			}
		}
	});

	// initialize events now, after mobileinit has occurred
	$.mobile.navreadyDeferred.resolve();

	// check which scrollTop value should be used by scrolling to 1 immediately at domready
	// then check what the scroll top is. Android will report 0... others 1
	// note that this initial scroll won't hide the address bar. It's just for the check.
	$(function() {
		window.scrollTo( 0, 1 );

		// if defaultHomeScroll hasn't been set yet, see if scrollTop is 1
		// it should be 1 in most browsers, but android treats 1 as 0 (for hiding addr bar)
		// so if it's 1, use 0 from now on
		$.mobile.defaultHomeScroll = ( !$.support.scrollTop || $(window).scrollTop() === 1 ) ? 0 : 1;


		// TODO: Implement a proper registration mechanism with dependency handling in order to not have exceptions like the one below
		//auto self-init widgets for those widgets that have a soft dependency on others
		if ( $.fn.controlgroup ) {
			$( document ).bind( "pagecreate create", function( e ){
				$( ":jqmData(role='controlgroup')", e.target )
					.jqmEnhanceable()
					.controlgroup({ excludeInvisible: false });
			});
		}

		//dom-ready inits
		if( $.mobile.autoInitializePage ){
			$.mobile.initializePage();
		}

		// window load event
		// hide iOS browser chrome on load
		$window.load( $.mobile.silentScroll );

		if ( !$.support.cssPointerEvents ) {
			// IE and Opera don't support CSS pointer-events: none that we use to disable link-based buttons
			// by adding the 'ui-disabled' class to them. Using a JavaScript workaround for those browser.
			// https://github.com/jquery/jquery-mobile/issues/3558

			$( document ).delegate( ".ui-disabled", "vclick",
				function( e ) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			);
		}
	});
}( jQuery, this ));


}));

/*
 Highcharts JS v2.3.3 (2012-10-04)

 (c) 2009-2011 Torstein Hønsi

 License: www.highcharts.com/license
*/
(function(){function r(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function ka(){for(var a=0,b=arguments,c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function w(a,b){return parseInt(a,b||10)}function la(a){return typeof a==="string"}function X(a){return typeof a==="object"}function Ha(a){return Object.prototype.toString.call(a)==="[object Array]"}function Aa(a){return typeof a==="number"}function ma(a){return J.log(a)/J.LN10}function ba(a){return J.pow(10,a)}function Ba(a,b){for(var c=a.length;c--;)if(a[c]===
b){a.splice(c,1);break}}function t(a){return a!==x&&a!==null}function z(a,b,c){var d,e;if(la(b))t(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(t(b)&&X(b))for(d in b)a.setAttribute(d,b[d]);return e}function na(a){return Ha(a)?a:[a]}function o(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function H(a,b){if(Ca&&b&&b.opacity!==x)b.filter="alpha(opacity="+b.opacity*100+")";r(a.style,b)}function Q(a,b,c,d,e){a=C.createElement(a);
b&&r(a,b);e&&H(a,{padding:0,border:R,margin:0});c&&H(a,c);d&&d.appendChild(a);return a}function ca(a,b){var c=function(){};c.prototype=new a;r(c.prototype,b);return c}function Ia(a,b,c,d){var e=M.lang,f=a;b===-1?(b=(a||0).toString(),a=b.indexOf(".")>-1?b.split(".")[1].length:0):a=isNaN(b=L(b))?2:b;var b=a,c=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=f<0?"-":"",a=String(w(f=L(+f||0).toFixed(b))),g=a.length>3?a.length%3:0;return e+(g?a.substr(0,g)+d:"")+a.substr(g).replace(/(\d{3})(?=\d)/g,
"$1"+d)+(b?c+L(f-a).toFixed(b).slice(2):"")}function sa(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function hb(a,b,c,d){var e,c=o(c,1);e=a/c;b||(b=[1,2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function Nb(a,b){var c=b||[[zb,[1,2,5,10,20,25,50,100,200,500]],[ib,[1,2,5,10,15,30]],[Ua,[1,2,5,10,15,30]],[Ja,[1,2,3,4,6,8,12]],[oa,[1,2]],[Va,[1,2]],[Ka,[1,2,3,4,6]],[ta,null]],d=
c[c.length-1],e=B[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=B[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+B[c[g+1][0]])/2)break;e===B[ta]&&a<5*e&&(f=[1,2,5]);e===B[ta]&&a<5*e&&(f=[1,2,5]);c=hb(a/e,f);return{unitRange:e,count:c,unitName:d[0]}}function Ob(a,b,c,d){var e=[],f={},g=M.global.useUTC,h,i=new Date(b),b=a.unitRange,j=a.count;b>=B[ib]&&(i.setMilliseconds(0),i.setSeconds(b>=B[Ua]?0:j*T(i.getSeconds()/j)));if(b>=B[Ua])i[Ab](b>=B[Ja]?0:j*T(i[jb]()/j));if(b>=B[Ja])i[Bb](b>=B[oa]?0:j*T(i[kb]()/
j));if(b>=B[oa])i[lb](b>=B[Ka]?1:j*T(i[La]()/j));b>=B[Ka]&&(i[Cb](b>=B[ta]?0:j*T(i[Wa]()/j)),h=i[Xa]());b>=B[ta]&&(h-=h%j,i[Db](h));if(b===B[Va])i[lb](i[La]()-i[mb]()+o(d,1));d=1;h=i[Xa]();for(var k=i.getTime(),l=i[Wa](),m=i[La](),i=g?0:(864E5+i.getTimezoneOffset()*6E4)%864E5;k<c;)e.push(k),b===B[ta]?k=Ya(h+d*j,0):b===B[Ka]?k=Ya(h,l+d*j):!g&&(b===B[oa]||b===B[Va])?k=Ya(h,l,m+d*j*(b===B[oa]?1:7)):(k+=b*j,b<=B[Ja]&&k%B[oa]===i&&(f[k]=oa)),d++;e.push(k);e.info=r(a,{higherRanks:f,totalRange:b*j});return e}
function Eb(){this.symbol=this.color=0}function Fb(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Ma(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Da(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Ea(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Na(a){Za||(Za=Q(ia));a&&Za.appendChild(a);Za.innerHTML=""}function $a(a,
b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else K.console&&console.log(c)}function ea(a){return parseFloat(a.toPrecision(14))}function ua(a,b){Oa=o(a,b.animation)}function Gb(){var a=M.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";Ya=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,o(c,1),o(g,0),o(h,0),o(i,0))).getTime()};jb=b+"Minutes";kb=b+"Hours";mb=b+"Day";La=b+"Date";Wa=b+"Month";Xa=b+"FullYear";Ab=c+"Minutes";Bb=c+"Hours";lb=c+"Date";Cb=c+"Month";
Db=c+"FullYear"}function va(){}function Pa(a,b,c){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;c||this.addLabel()}function nb(a,b){this.axis=a;if(b)this.options=b,this.id=b.id;return this}function Hb(a,b,c,d,e,f){var g=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.stack=e;this.percent=f==="percent";this.alignOptions={align:b.align||(g?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(g?"middle":c?"bottom":"top"),y:o(b.y,g?4:c?14:-6),x:o(b.x,g?c?-6:6:
0)};this.textAlign=b.textAlign||(g?c?"right":"left":"center")}function ob(){this.init.apply(this,arguments)}function pb(a,b){var c=b.borderWidth,d=b.style,e=w(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape,null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).hide().add();U||this.label.shadow(b.shadow);this.shared=b.shared}
function qb(a,b){var c=U?"":b.chart.zoomType;this.zoomX=/x/.test(c);this.zoomY=/y/.test(c);this.options=b;this.chart=a;this.init(a,b.tooltip)}function rb(a){this.init(a)}function sb(a,b){var c,d=a.series;a.series=null;c=A(M,a);c.series=a.series=d;var d=c.chart,e=d.margin,e=X(e)?e:[e,e,e,e];this.optionsMarginTop=o(d.marginTop,e[0]);this.optionsMarginRight=o(d.marginRight,e[1]);this.optionsMarginBottom=o(d.marginBottom,e[2]);this.optionsMarginLeft=o(d.marginLeft,e[3]);this.runChartClick=(e=d.events)&&
!!e.click;this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;this.init(e)}var x,C=document,K=window,J=Math,s=J.round,T=J.floor,wa=J.ceil,y=J.max,O=J.min,L=J.abs,V=J.cos,Y=J.sin,xa=J.PI,ab=xa*2/360,Fa=navigator.userAgent,Ib=K.opera,Ca=/msie/i.test(Fa)&&!Ib,Qa=C.documentMode===8,tb=/AppleWebKit/.test(Fa),bb=/Firefox/.test(Fa),pa="http://www.w3.org/2000/svg",Z=!!C.createElementNS&&!!C.createElementNS(pa,"svg").createSVGRect,Pb=bb&&parseInt(Fa.split("Firefox/")[1],
10)<4,U=!Z&&!Ca&&!!C.createElement("canvas").getContext,Ra,fa=C.documentElement.ontouchstart!==x,Jb={},ub=0,Za,M,cb,Oa,vb,B,ya=function(){},ia="div",R="none",wb="rgba(192,192,192,"+(Z?1.0E-6:0.0020)+")",zb="millisecond",ib="second",Ua="minute",Ja="hour",oa="day",Va="week",Ka="month",ta="year",Ya,jb,kb,mb,La,Wa,Xa,Ab,Bb,lb,Cb,Db,$={};K.Highcharts={};cb=function(a,b,c){if(!t(b)||isNaN(b))return"Invalid date";var a=o(a,"%Y-%m-%d %H:%M:%S"),d=new Date(b),e,f=d[kb](),g=d[mb](),h=d[La](),i=d[Wa](),j=d[Xa](),
k=M.lang,l=k.weekdays,b={a:l[g].substr(0,3),A:l[g],d:sa(h),e:h,b:k.shortMonths[i],B:k.months[i],m:sa(i+1),y:j.toString().substr(2,2),Y:j,H:sa(f),I:sa(f%12||12),l:f%12||12,M:sa(d[jb]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:sa(d.getSeconds()),L:sa(s(b%1E3),3)};for(e in b)a=a.replace("%"+e,b[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Eb.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};B=ka(zb,1,ib,1E3,Ua,6E4,Ja,36E5,
oa,864E5,Va,6048E5,Ka,2592E6,ta,31556952E3);vb={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,i,j=function(a){for(g=a.length;g--;)a[g]==="M"&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(j(b),j(c));a.isArea&&(h=b.splice(b.length-6,6),i=c.splice(c.length-6,6));if(d<=c.length/f)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-
1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){K.HighchartsAdapter=K.HighchartsAdapter||a&&{init:function(b){var c=a.fx,d=c.step,e,f=a.Tween,g=f&&f.propHooks;a.extend(a.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});a.each(["cur","_default","width","height"],function(a,b){var e=
d,k,l;b==="cur"?e=c.prototype:b==="_default"&&f&&(e=g[b],b="set");(k=e[b])&&(e[b]=function(c){c=a?c:this;l=c.elem;return l.attr?l.attr(c.prop,b==="cur"?x:c.now):k.apply(this,arguments)})});e=function(a){var c=a.elem,d;if(!a.started)d=b.init(c,c.d,c.toD),a.start=d[0],a.end=d[1],a.started=!0;c.attr("d",b.step(a.start,a.end,a.pos,c.toD))};f?g.d={set:e}:d.d=e;this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],
a[c],c,a)===!1)return c}},getScript:a.getScript,inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},merge:function(){var b=arguments;return a.extend(!0,null,b[0],b[1],b[2],b[3])},offset:function(b){return a(b).offset()},addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=C.removeEventListener?"removeEventListener":"detachEvent";C[e]&&!b[e]&&(b[e]=function(){});a(b).unbind(c,
d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!Ca&&d&&(delete d.layerX,delete d.layerY);r(f,d);b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){b==="preventDefault"&&(h=!0)}}});a(b).trigger(f);b[g]&&(b[c]=b[g],b[g]=null);e&&!f.isDefaultPrevented()&&!h&&e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;if(c.pageX===x)c.pageX=a.pageX,c.pageY=a.pageY;return c},animate:function(b,c,d){var e=
a(b);if(c.d)b.toD=c.d,c.d=1;e.stop();e.animate(c,d)},stop:function(b){a(b).stop()}}})(K.jQuery);var ga=K.HighchartsAdapter,G=ga||{};ga&&ga.init.call(ga,vb);var db=G.adapterRun,Qb=G.getScript,Rb=G.inArray,n=G.each,Kb=G.grep,Sb=G.offset,Sa=G.map,A=G.merge,I=G.addEvent,S=G.removeEvent,E=G.fireEvent,Lb=G.washMouseEvent,xb=G.animate,eb=G.stop,G={enabled:!0,align:"center",x:0,y:15,style:{color:"#666",fontSize:"11px",lineHeight:"14px"}};M={colors:"#4572A7,#AA4643,#89A54E,#80699B,#3D96AE,#DB843D,#92A8CD,#A47D7C,#B5CA92".split(","),
symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,
canvasToolsURL:"http://code.highcharts.com/2.3.3/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/2.3.3/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},
position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",y:15,style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#6D869F"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,shadow:!0,marker:{enabled:!0,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:A(G,{enabled:!1,formatter:function(){return this.y},
verticalAlign:"bottom",y:0}),cropThreshold:300,pointRange:0,showInLegend:!0,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:!0}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,navigation:{activeColor:"#3E576F",inactiveColor:"#CCC"},shadow:!1,itemStyle:{cursor:"pointer",color:"#3E576F",fontSize:"12px"},itemHoverStyle:{color:"#000"},
itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"1em"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",
hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',shadow:!0,shared:U,snap:fa?25:10,style:{color:"#333333",fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},
style:{cursor:"pointer",color:"#909090",fontSize:"10px"}}};var W=M.plotOptions,ga=W.line;Gb();var qa=function(a){var b=[],c;(function(a){(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a))?b=[w(c[1]),w(c[2]),w(c[3]),parseFloat(c[4],10)]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a))&&(b=[w(c[1],16),w(c[2],16),w(c[3],16),1])})(a);return{get:function(c){return b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?
b[3]:"rgba("+b.join(",")+")":a},brighten:function(a){if(Aa(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=w(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},setOpacity:function(a){b[3]=a;return this}}};va.prototype={init:function(a,b){this.element=b==="span"?Q(b):C.createElementNS(pa,b);this.renderer=a;this.attrSetters={}},animate:function(a,b,c){b=o(b,Oa,!0);eb(this);if(b){b=A(b);if(c)b.complete=c;xb(this,a,b)}else this.attr(a),c&&c()},attr:function(a,b){var c,d,e,f,g=this.element,h=g.nodeName.toLowerCase(),
i=this.renderer,j,k=this.attrSetters,l=this.shadows,m,p,u=this;la(a)&&t(b)&&(c=a,a={},a[c]=b);if(la(a))c=a,h==="circle"?c={x:"cx",y:"cy"}[c]||c:c==="strokeWidth"&&(c="stroke-width"),u=z(g,c)||this[c]||0,c!=="d"&&c!=="visibility"&&(u=parseFloat(u));else for(c in a)if(j=!1,d=a[c],e=k[c]&&k[c].call(this,d,c),e!==!1){e!==x&&(d=e);if(c==="d")d&&d.join&&(d=d.join(" ")),/(NaN| {2}|^$)/.test(d)&&(d="M 0 0");else if(c==="x"&&h==="text"){for(e=0;e<g.childNodes.length;e++)f=g.childNodes[e],z(f,"x")===z(g,"x")&&
z(f,"x",d);this.rotation&&z(g,"transform","rotate("+this.rotation+" "+d+" "+w(a.y||z(g,"y"))+")")}else if(c==="fill")d=i.color(d,g,c);else if(h==="circle"&&(c==="x"||c==="y"))c={x:"cx",y:"cy"}[c]||c;else if(h==="rect"&&c==="r")z(g,{rx:d,ry:d}),j=!0;else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="verticalAlign")j=p=!0;else if(c==="stroke")d=i.color(d,g,c);else if(c==="dashstyle")if(c="stroke-dasharray",d=d&&d.toLowerCase(),d==="solid")d=R;else{if(d){d=d.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot",
"3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(e=d.length;e--;)d[e]=w(d[e])*a["stroke-width"];d=d.join(",")}}else if(c==="isTracker")this[c]=d;else if(c==="width")d=w(d);else if(c==="align")c="text-anchor",d={left:"start",center:"middle",right:"end"}[d];else if(c==="title")e=g.getElementsByTagName("title")[0],e||(e=C.createElementNS(pa,"title"),g.appendChild(e)),e.textContent=
d;c==="strokeWidth"&&(c="stroke-width");tb&&c==="stroke-width"&&d===0&&(d=1.0E-6);this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(m||(this.symbolAttr(a),m=!0),j=!0);if(l&&/^(width|height|visibility|x|y|d|transform)$/.test(c))for(e=l.length;e--;)z(l[e],c,c==="height"?y(d-(l[e].cutHeight||0),0):d);if((c==="width"||c==="height")&&h==="rect"&&d<0)d=0;this[c]=d;p&&this.updateTransform();c==="text"?(d!==this.textStr&&delete this.bBox,this.textStr=d,this.added&&i.buildText(this)):
j||z(g,c,d)}return u},symbolAttr:function(a){var b=this;n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=o(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":R)},crisp:function(a,b,c,d,e){var f,g={},h={},i,a=a||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;i=s(a)%2/2;h.x=T(b||this.x||0)+i;h.y=T(c||this.y||0)+i;h.width=T((d||this.width||
0)-2*i);h.height=T((e||this.height||0)-2*i);h.strokeWidth=a;for(f in h)this[f]!==h[f]&&(this[f]=g[f]=h[f]);return g},css:function(a){var b=this.element,b=a&&a.width&&b.nodeName.toLowerCase()==="text",c,d="",e=function(a,b){return"-"+b.toLowerCase()};if(a&&a.color)a.fill=a.color;this.styles=a=r(this.styles,a);U&&b&&delete a.width;if(Ca&&!Z)b&&delete a.width,H(this.element,a);else{for(c in a)d+=c.replace(/([A-Z])/g,e)+":"+a[c]+";";this.attr({style:d})}b&&this.added&&this.renderer.buildText(this);return this},
on:function(a,b){var c=b;fa&&a==="click"&&(a="touchstart",c=function(a){a.preventDefault();b()});this.element["on"+a]=c;return this},setRadialReference:function(a){this.element.radialReference=a;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=r(this.styles,
a);H(this.element,a);return this},htmlGetBBox:function(){var a=this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position="absolute";b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=g&&g!=="left",j=this.shadows;if(c||d)H(b,{marginLeft:c,
marginTop:d}),j&&n(j,function(a){H(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&n(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var k,l,j=this.rotation,m,p=0,u=1,p=0,da;m=w(this.textWidth);var q=this.xCorr||0,D=this.yCorr||0,aa=[j,g,b.innerHTML,this.textWidth].join(",");k={};if(aa!==this.cTT){if(t(j))a.isSVG?(q=Ca?"-ms-transform":tb?"-webkit-transform":bb?"MozTransform":Ib?"-o-transform":"",k[q]=k.transform="rotate("+j+"deg)"):(p=j*ab,u=V(p),p=Y(p),k.filter=j?["progid:DXImageTransform.Microsoft.Matrix(M11=",
u,", M12=",-p,", M21=",p,", M22=",u,", sizingMethod='auto expand')"].join(""):R),H(b,k);k=o(this.elemWidth,b.offsetWidth);l=o(this.elemHeight,b.offsetHeight);k>m&&/[ \-]/.test(b.innerText)&&(H(b,{width:m+"px",display:"block",whiteSpace:"normal"}),k=m);m=a.fontMetrics(b.style.fontSize).b;q=u<0&&-k;D=p<0&&-l;da=u*p<0;q+=p*m*(da?1-h:h);D-=u*m*(j?da?h:1-h:1);i&&(q-=k*h*(u<0?-1:1),j&&(D-=l*h*(p<0?-1:1)),H(b,{textAlign:g}));this.xCorr=q;this.yCorr=D}H(b,{left:e+q+"px",top:f+D+"px"});this.cTT=aa}}else this.alignOnAdd=
!0},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.inverted,d=this.rotation,e=[];c&&(a+=this.attr("width"),b+=this.attr("height"));(a||b)&&e.push("translate("+a+","+b+")");c?e.push("rotate(90) scale(-1,1)"):d&&e.push("rotate("+d+" "+(this.x||0)+" "+(this.y||0)+")");e.length&&z(this.element,"transform",e.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){a?(this.alignOptions=a,this.alignByTranslate=b,c||
this.renderer.alignedObjects.push(this)):(a=this.alignOptions,b=this.alignByTranslate);var c=o(c,this.renderer),d=a.align,e=a.verticalAlign,f=(c.x||0)+(a.x||0),g=(c.y||0)+(a.y||0),h={};if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=s(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=s(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a=
this.bBox,b=this.renderer,c,d=this.rotation,e=this.element,f=this.styles,g=d*ab;if(!a){if(e.namespaceURI===pa||b.forExport){try{a=e.getBBox?r({},e.getBBox()):{width:e.offsetWidth,height:e.offsetHeight}}catch(h){}if(!a||a.width<0)a={width:0,height:0}}else a=this.htmlGetBBox();if(b.isSVG&&(b=a.width,c=a.height,d))a.width=L(c*Y(g))+L(b*V(g)),a.height=L(c*V(g))+L(b*Y(g));if(Ca&&f&&f.fontSize==="11px"&&c===22.700000762939453)a.height=14;this.bBox=a}return a},show:function(){return this.attr({visibility:"visible"})},
hide:function(){return this.attr({visibility:"hidden"})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=d.childNodes,f=this.element,g=z(f,"zIndex"),h;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(g)c.handleZ=!0,g=w(g);if(c.handleZ)for(c=0;c<e.length;c++)if(a=e[c],b=z(a,"zIndex"),a!==f&&(w(b)>g||!t(g)&&t(b))){d.insertBefore(f,a);h=!0;break}h||d.appendChild(f);this.added=!0;E(this,"add");return this},safeRemoveChild:function(a){var b=
a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d,e;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=null;eb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(e=0;e<a.stops.length;e++)a.stops[e]=a.stops[e].destroy();a.stops=null}a.safeRemoveChild(b);c&&n(c,function(b){a.safeRemoveChild(b)});Ba(a.renderer.alignedObjects,a);for(d in a)delete a[d];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},
shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,j,k;if(a){i=o(a.width,3);j=(a.opacity||0.15)/i;k=this.parentInverted?"(-1,-1)":"("+o(a.offsetX,1)+", "+o(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;z(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":j*e,"stroke-width":h,transform:"translate"+k,fill:R});if(c)z(f,"height",y(z(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this}};var ra=function(){this.init.apply(this,
arguments)};ra.prototype={Element:va,init:function(a,b,c,d){var e=location,f;f=this.createElement("svg").attr({xmlns:pa,version:"1.1"});a.appendChild(f.element);this.isSVG=!0;this.box=f.element;this.boxWrapper=f;this.alignedObjects=[];this.url=(bb||tb)&&C.getElementsByTagName("base").length?e.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.defs=this.createElement("defs").add();this.forExport=d;this.gradients={};this.setSize(b,c,!1);var g;if(bb&&a.getBoundingClientRect)this.subPixelFix=
b=function(){H(a,{left:0,top:0});g=a.getBoundingClientRect();H(a,{left:wa(g.left)-g.left+"px",top:wa(g.top)-g.top+"px"})},b(),I(K,"resize",b)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Ea(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&S(K,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,
a);return b},draw:function(){},buildText:function(a){for(var b=a.element,c=o(a.textStr,"").toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g),d=b.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,g=z(b,"x"),h=a.styles,i=h&&h.width&&w(h.width),j=h&&h.lineHeight,k,h=d.length,l=[];h--;)b.removeChild(d[h]);i&&!a.added&&this.box.appendChild(b);
c[c.length-1]===""&&c.pop();n(c,function(c,d){var h,da=0,q,c=c.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");h=c.split("|||");n(h,function(c){if(c!==""||h.length===1){var m={},o=C.createElementNS(pa,"tspan"),n;e.test(c)&&(n=c.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),z(o,"style",n));f.test(c)&&(z(o,"onclick",'location.href="'+c.match(f)[1]+'"'),H(o,{cursor:"pointer"}));c=(c.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");o.appendChild(C.createTextNode(c));
da?m.dx=3:m.x=g;if(!da){if(d){!Z&&a.renderer.forExport&&H(o,{display:"block"});q=K.getComputedStyle&&w(K.getComputedStyle(k,null).getPropertyValue("line-height"));if(!q||isNaN(q)){var F;if(!(F=j))if(!(F=k.offsetHeight))l[d]=b.getBBox?b.getBBox().height:a.renderer.fontMetrics(b.style.fontSize).h,F=s(l[d]-(l[d-1]||0))||18;q=F}z(o,"dy",q)}k=o}z(o,m);b.appendChild(o);da++;if(i)for(var c=c.replace(/([^\^])-/g,"$1- ").split(" "),t=[];c.length||t.length;)delete a.bBox,F=a.getBBox().width,m=F>i,!m||c.length===
1?(c=t,t=[],c.length&&(o=C.createElementNS(pa,"tspan"),z(o,{dy:j||16,x:g}),n&&z(o,"style",n),b.appendChild(o),F>i&&(i=F))):(o.removeChild(o.firstChild),t.unshift(c.pop())),c.length&&o.appendChild(C.createTextNode(c.join(" ").replace(/- /g,"-")))}})})},button:function(a,b,c,d,e,f,g){var h=this.label(a,b,c),i=0,j,k,l,m,p,a={x1:0,y1:0,x2:0,y2:1},e=A(ka("stroke-width",1,"stroke","#999","fill",ka("linearGradient",a,"stops",[[0,"#FFF"],[1,"#DDD"]]),"r",3,"padding",3,"style",ka("color","black")),e);l=e.style;
delete e.style;f=A(e,ka("stroke","#68A","fill",ka("linearGradient",a,"stops",[[0,"#FFF"],[1,"#ACF"]])),f);m=f.style;delete f.style;g=A(e,ka("stroke","#68A","fill",ka("linearGradient",a,"stops",[[0,"#9BD"],[1,"#CDF"]])),g);p=g.style;delete g.style;I(h.element,"mouseenter",function(){h.attr(f).css(m)});I(h.element,"mouseleave",function(){j=[e,f,g][i];k=[l,m,p][i];h.attr(j).css(k)});h.setState=function(a){(i=a)?a===2&&h.attr(g).css(p):h.attr(e).css(l)};return h.on("click",function(){d.call(h)}).attr(e).css(r({cursor:"default"},
l))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=s(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=s(a[2])+b%2/2);return a},path:function(a){var b={fill:R};Ha(a)?b.d=a:X(a)&&r(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=X(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){if(X(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;return this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){e=X(a)?
a.r:e;e=this.createElement("rect").attr({rx:e,ry:e,fill:R});return e.attr(X(a)?a:e.crisp(f,a,b,y(c,0),y(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[o(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return t(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:R};arguments.length>1&&r(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);
f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(s(b),s(c),d,e,f),i=/^url\((.*?)\)$/,j,k;h?(g=this.path(h),r(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&r(g,f)):i.test(a)&&(k=function(a,b){a.attr({width:b[0],height:b[1]});a.alignByTranslate||a.translate(-s(b[0]/2),-s(b[1]/2))},j=a.match(i)[1],a=Jb[j],g=this.image(j).attr({x:b,y:c}),a?k(g,a):(g.attr({width:0,
height:0}),Q("img",{onload:function(){k(g,Jb[j]=[this.width,this.height])},src:j})));return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+
c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-1.0E-6,d=e.innerR,h=e.open,i=V(f),j=Y(f),k=V(g),g=Y(g),e=e.end-f<xa?0:1;return["M",a+c*i,b+c*j,"A",c,c,0,e,1,a+c*k,b+c*g,h?"M":"L",a+d*k,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*j,h?"":"Z"]}},clipRect:function(a,b,c,d){var e="highcharts-"+ub++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},color:function(a,b,c){var d=this,e,f=/^rgba/,g;a&&a.linearGradient?
g="linearGradient":a&&a.radialGradient&&(g="radialGradient");if(g){var c=a[g],h=d.gradients,i,j,k,b=b.radialReference;if(!c.id||!h[c.id])Ha(c)&&(a[g]=c={x1:c[0],y1:c[1],x2:c[2],y2:c[3],gradientUnits:"userSpaceOnUse"}),g==="radialGradient"&&b&&!t(c.gradientUnits)&&r(c,{cx:b[0]-b[2]/2+c.cx*b[2],cy:b[1]-b[2]/2+c.cy*b[2],r:c.r*b[2],gradientUnits:"userSpaceOnUse"}),c.id="highcharts-"+ub++,h[c.id]=i=d.createElement(g).attr(c).add(d.defs),i.stops=[],n(a.stops,function(a){f.test(a[1])?(e=qa(a[1]),j=e.get("rgb"),
k=e.get("a")):(j=a[1],k=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":j,"stop-opacity":k}).add(i);i.stops.push(a)});return"url("+d.url+"#"+c.id+")"}else return f.test(a)?(e=qa(a),z(b,c+"-opacity",e.get("a")),e.get("rgb")):(b.removeAttribute(c+"-opacity"),a)},text:function(a,b,c,d){var e=M.chart.style,f=U||!Z&&this.forExport;if(d&&!this.forExport)return this.html(a,b,c);b=s(o(b,0));c=s(o(c,0));a=this.createElement("text").attr({x:b,y:c,text:a}).css({fontFamily:e.fontFamily,fontSize:e.fontSize});
f&&a.css({position:"absolute"});a.x=b;a.y=c;return a},html:function(a,b,c){var d=M.chart.style,e=this.createElement("span"),f=e.attrSetters,g=e.element,h=e.renderer;f.text=function(a){a!==g.innerHTML&&delete this.bBox;g.innerHTML=a;return!1};f.x=f.y=f.align=function(a,b){b==="align"&&(b="textAlign");e[b]=a;e.htmlUpdateTransform();return!1};e.attr({text:a,x:s(b),y:s(c)}).css({position:"absolute",whiteSpace:"nowrap",fontFamily:d.fontFamily,fontSize:d.fontSize});e.css=e.htmlCss;if(h.isSVG)e.add=function(a){var b,
c=h.box.parentNode,d=[];if(a){if(b=a.div,!b){for(;a;)d.push(a),a=a.parentGroup;n(d.reverse(),function(a){var d;b=a.div=a.div||Q(ia,{className:z(a.element,"class")},{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;r(a.attrSetters,{translateX:function(a){d.left=a+"px"},translateY:function(a){d.top=a+"px"},visibility:function(a,b){d[b]=a}})})}}else b=c;b.appendChild(g);e.added=!0;e.alignOnAdd&&e.htmlUpdateTransform();return e};return e},fontMetrics:function(a){var a=
w(a||11),a=a<24?a+4:s(a*1.2),b=s(a*0.8);return{h:a,b:b}},label:function(a,b,c,d,e,f,g,h,i){function j(){var a=p.styles,a=a&&a.textAlign,b=aa*(1-D),c;c=h?0:yb;if(t(Ga)&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(Ga-q.width);(b!==u.x||c!==u.y)&&u.attr({x:b,y:c});u.x=b;u.y=c}function k(a,b){o?o.attr(a,b):fb[a]=b}function l(){u.add(p);p.attr({text:a,x:b,y:c});t(e)&&p.attr({anchorX:e,anchorY:f})}var m=this,p=m.g(i),u=m.text("",0,0,g).attr({zIndex:1}),o,q,D=0,aa=3,Ga,v,F,y,P=0,fb={},yb,g=p.attrSetters;
I(p,"add",l);g.width=function(a){Ga=a;return!1};g.height=function(a){v=a;return!1};g.padding=function(a){t(a)&&a!==aa&&(aa=a,j());return!1};g.align=function(a){D={left:0,center:0.5,right:1}[a];return!1};g.text=function(a,b){u.attr(b,a);var c;c=u.element.style;q=(Ga===void 0||v===void 0||p.styles.textAlign)&&u.getBBox();p.width=(Ga||q.width||0)+2*aa;p.height=(v||q.height||0)+2*aa;yb=aa+m.fontMetrics(c&&c.fontSize).b;if(!o)c=h?-yb:0,p.box=o=d?m.symbol(d,-D*aa,c,p.width,p.height):m.rect(-D*aa,c,p.width,
p.height,0,fb["stroke-width"]),o.add(p);o.attr(A({width:p.width,height:p.height},fb));fb=null;j();return!1};g["stroke-width"]=function(a,b){P=a%2/2;k(b,a);return!1};g.stroke=g.fill=g.r=function(a,b){k(b,a);return!1};g.anchorX=function(a,b){e=a;k(b,a+P-F);return!1};g.anchorY=function(a,b){f=a;k(b,a-y);return!1};g.x=function(a){p.x=a;a-=D*((Ga||q.width)+aa);F=s(a);p.attr("translateX",F);return!1};g.y=function(a){y=p.y=s(a);p.attr("translateY",a);return!1};var w=p.css;return r(p,{css:function(a){if(a){var b=
{},a=A({},a);n("fontSize,fontWeight,fontFamily,color,lineHeight,width".split(","),function(c){a[c]!==x&&(b[c]=a[c],delete a[c])});u.css(b)}return w.call(p,a)},getBBox:function(){return o.getBBox()},shadow:function(a){o.shadow(a);return p},destroy:function(){S(p,"add",l);S(p.element,"mouseenter");S(p.element,"mouseleave");u&&(u=u.destroy());o&&(o=o.destroy());va.prototype.destroy.call(p)}})}};Ra=ra;var ja;if(!Z&&!U){ja={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",
";"];(b==="shape"||b===ia)&&d.push("left:0;top:0;width:1px;height:1px;");Qa&&d.push("visibility: ",b===ia?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=b===ia||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=Q(c);this.renderer=a;this.attrSetters={}},add:function(a){var b=this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();E(this,"add");
return this},updateTransform:va.prototype.htmlUpdateTransform,attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,h=f.nodeName,i=this.renderer,j=this.symbolName,k,l=this.shadows,m,p=this.attrSetters,u=this;la(a)&&t(b)&&(c=a,a={},a[c]=b);if(la(a))c=a,u=c==="strokeWidth"||c==="stroke-width"?this.strokeweight:this[c];else for(c in a)if(d=a[c],m=!1,e=p[c]&&p[c].call(this,d,c),e!==!1&&d!==null){e!==x&&(d=e);if(j&&/^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c))k||(this.symbolAttr(a),
k=!0),m=!0;else if(c==="d"){d=d||[];this.d=d.join(" ");e=d.length;for(m=[];e--;)m[e]=Aa(d[e])?s(d[e]*10)-5:d[e]==="Z"?"x":d[e];d=m.join(" ")||"x";f.path=d;if(l)for(e=l.length;e--;)l[e].path=l[e].cutOff?this.cutOffPath(d,l[e].cutOff):d;m=!0}else if(c==="visibility"){if(l)for(e=l.length;e--;)l[e].style[c]=d;h==="DIV"&&(d=d==="hidden"?"-999em":0,c="top");g[c]=d;m=!0}else if(c==="zIndex")d&&(g[c]=d),m=!0;else if(c==="width"||c==="height")d=y(0,d),this[c]=d,this.updateClipping?(this[c]=d,this.updateClipping()):
g[c]=d,m=!0;else if(c==="x"||c==="y")this[c]=d,g[{x:"left",y:"top"}[c]]=d;else if(c==="class")f.className=d;else if(c==="stroke")d=i.color(d,f,c),c="strokecolor";else if(c==="stroke-width"||c==="strokeWidth")f.stroked=d?!0:!1,c="strokeweight",this[c]=d,Aa(d)&&(d+="px");else if(c==="dashstyle")(f.getElementsByTagName("stroke")[0]||Q(i.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid",this.dashstyle=d,m=!0;else if(c==="fill")h==="SPAN"?g.color=d:(f.filled=d!==R?!0:!1,d=i.color(d,f,c,this),c="fillcolor");
else if(h==="shape"&&c==="rotation")this[c]=d,f.style.left=-s(Y(d*ab)+1)+"px",f.style.top=s(V(d*ab))+"px";else if(c==="translateX"||c==="translateY"||c==="rotation")this[c]=d,this.updateTransform(),m=!0;else if(c==="text")this.bBox=null,f.innerHTML=d,m=!0;m||(Qa?f[c]=d:z(f,c,d))}return u},clip:function(a){var b=this,c,d=b.element,e=d.parentNode;a?(c=a.members,c.push(b),b.destroyClip=function(){Ba(c,b)},e&&e.className==="highcharts-tracker"&&!Qa&&H(d,{visibility:"hidden"}),a=a.getCSS(b)):(b.destroyClip&&
b.destroyClip(),a={clip:Qa?"inherit":"rect(auto)"});return b.css(a)},css:va.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Na(a)},destroy:function(){this.destroyClip&&this.destroyClip();return va.prototype.destroy.apply(this)},empty:function(){for(var a=this.element.childNodes,b=a.length,c;b--;)c=a[b],c.parentNode.removeChild(c)},on:function(a,b){this.element["on"+a]=function(){var a=K.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;
if(c===9||c===11)a[c-4]=a[c-2]=w(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,j,k=f.path,l,m,p,u;k&&typeof k.value!=="string"&&(k="x");m=k;if(a){p=o(a.width,3);u=(a.opacity||0.15)/p;for(e=1;e<=3;e++){l=p*2+1-2*e;c&&(m=this.cutOffPath(k.value,l+0.5));j=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',m,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=Q(g.prepVML(j),null,{left:w(i.left)+o(a.offsetX,1),top:w(i.top)+
o(a.offsetY,1)});if(c)h.cutOff=l+1;j=['<stroke color="',a.color||"black",'" opacity="',u*e,'"/>'];Q(g.prepVML(j),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this}};ja=ca(va,ja);var ha={Element:ja,isIE8:Fa.indexOf("MSIE 8.0")>-1,init:function(a,b,c){var d,e;this.alignedObjects=[];d=this.createElement(ia);e=d.element;e.style.position="relative";a.appendChild(d.element);this.box=e;this.boxWrapper=d;this.setSize(b,c,!1);if(!C.namespaces.hcv)C.namespaces.add("hcv",
"urn:schemas-microsoft-com:vml"),C.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "},isHidden:function(){return!this.box.offsetWidth},clipRect:function(a,b,c,d){var e=this.createElement(),f=X(a);return r(e,{members:[],left:f?a.x:a,top:f?a.y:b,width:f?a.width:c,height:f?a.height:d,getCSS:function(a){var b=a.inverted,c=this.top,d=this.left,e=d+this.width,f=c+this.height,c={clip:"rect("+s(b?d:c)+"px,"+s(b?f:e)+"px,"+
s(b?e:f)+"px,"+s(b?c:d)+"px)"};!b&&Qa&&a.element.nodeName!=="IMG"&&r(c,{width:e+"px",height:f+"px"});return c},updateClipping:function(){n(e.members,function(a){a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,f,g=/^rgba/,h,i,j=R;a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var k,l,m=a.linearGradient||a.radialGradient,p,u,o,q,D,t="",a=a.stops,s,v=[],F=function(){h=['<fill colors="'+v.join(",")+'" opacity="',o,'" o:opacity2="',u,'" type="',i,'" ',t,'focus="100%" method="any" />'];
Q(e.prepVML(h),null,null,b)};p=a[0];s=a[a.length-1];p[0]>0&&a.unshift([0,p[1]]);s[0]<1&&a.push([1,s[1]]);n(a,function(a,b){g.test(a[1])?(f=qa(a[1]),k=f.get("rgb"),l=f.get("a")):(k=a[1],l=1);v.push(a[0]*100+"% "+k);b?(o=l,q=k):(u=l,D=k)});if(c==="fill")if(i==="gradient")c=m.x1||m[0]||0,a=m.y1||m[1]||0,p=m.x2||m[2]||0,m=m.y2||m[3]||0,t='angle="'+(90-J.atan((m-a)/(p-c))*180/xa)+'"',F();else{var j=m.r,r=j*2,P=j*2,y=m.cx,x=m.cy,A=b.radialReference,w,j=function(){A&&(w=d.getBBox(),y+=(A[0]-w.x)/w.width-
0.5,x+=(A[1]-w.y)/w.height-0.5,r*=A[2]/w.width,P*=A[2]/w.height);t='src="'+M.global.VMLRadialGradientURL+'" size="'+r+","+P+'" origin="0.5,0.5" position="'+y+","+x+'" color2="'+D+'" ';F()};d.added?j():I(d,"add",j);j=q}else j=k}else if(g.test(a)&&b.tagName!=="IMG")f=qa(a),h=["<",c,' opacity="',f.get("a"),'"/>'],Q(this.prepVML(h),null,null,b),j=f.get("rgb");else{j=b.getElementsByTagName(c);if(j.length)j[0].opacity=1;j=a}return j},prepVML:function(a){var b=this.isIE8,a=a.join("");b?(a=a.replace("/>",
' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:ra.prototype.html,path:function(a){var b={coordsize:"10 10"};Ha(a)?b.d=a:X(a)&&r(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){return this.symbol("circle").attr({x:a-c,y:b-c,width:2*c,height:2*c})},g:function(a){var b;
a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(ia).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(X(a))b=a.y,c=a.width,d=a.height,f=a.strokeWidth,a=a.x;var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,y(c,0),y(d,0)))},invertChild:function(a,b){var c=b.style;H(a,{flip:"x",left:w(c.width)-1,top:w(c.height)-1,rotation:-90})},
symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||d,c=V(f),d=Y(f),i=V(g),j=Y(g),k=e.innerR,l=0.08/h,m=k&&0.1/k||0;if(g-f===0)return["x"];else 2*xa-g+f<l?i=-l:g-f<m&&(i=V(f+m));f=["wa",a-h,b-h,a+h,b+h,a+h*c,b+h*d,a+h*i,b+h*j];e.open&&!k&&f.push("e","M",a,b);f.push("at",a-k,b-k,a+k,b+k,a+k*i,b+k*j,a+k*c,b+k*d,"x","e");return f},circle:function(a,b,c,d){return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){var f=a+c,g=b+d,h;!t(e)||!e.r?f=ra.prototype.symbols.square.apply(0,
arguments):(h=O(e.r,c,d),f=["M",a+h,b,"L",f-h,b,"wa",f-2*h,b,f,b+2*h,f-h,b,f,b+h,"L",f,g-h,"wa",f-2*h,g-2*h,f,g,f,g-h,f-h,g,"L",a+h,g,"wa",a,g-2*h,a+2*h,g,a+h,g,a,g-h,"L",a,b+h,"wa",a,b,a+2*h,b+2*h,a,b+h,a+h,b,"x","e"]);return f}}};ja=function(){this.init.apply(this,arguments)};ja.prototype=A(ra.prototype,ha);Ra=ja}var gb,Mb;if(U)gb=function(){pa="http://www.w3.org/1999/xhtml"},gb.prototype.symbols={},Mb=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,
d){b.length===0&&Qb(d,a);b.push(c)}}}();Ra=ja||gb||ra;Pa.prototype={addLabel:function(){var a=this.axis,b=a.options,c=a.chart,d=a.horiz,e=a.categories,f=this.pos,g=b.labels,h=a.tickPositions,d=e&&d&&e.length&&!g.step&&!g.staggerLines&&!g.rotation&&c.plotWidth/h.length||!d&&c.plotWidth/2,i=f===h[0],j=f===h[h.length-1],k=e&&t(e[f])?e[f]:f,e=this.label,h=h.info,l;a.isDatetimeAxis&&h&&(l=b.dateTimeLabelFormats[h.higherRanks[f]||h.unitName]);this.isFirst=i;this.isLast=j;b=a.labelFormatter.call({axis:a,
chart:c,isFirst:i,isLast:j,dateTimeLabelFormat:l,value:a.isLog?ea(ba(k)):k});f=d&&{width:y(1,s(d-2*(g.padding||10)))+"px"};f=r(f,g.style);if(t(e))e&&e.attr({text:b}).css(f);else{d={align:g.align};if(Aa(g.rotation))d.rotation=g.rotation;this.label=t(b)&&g.enabled?c.renderer.text(b,0,0,g.useHTML).attr(d).css(f).add(a.labelGroup):null}},getLabelSize:function(){var a=this.label,b=this.axis;return a?(this.labelBBox=a.getBBox())[b.horiz?"height":"width"]:0},getLabelSides:function(){var a=this.axis.options.labels,
b=this.labelBBox.width,a=b*{left:0,center:0.5,right:1}[a.align]-a.x;return[-a,b-a]},handleOverflow:function(a,b){var c=!0,d=this.axis,e=d.chart,f=this.isFirst,g=this.isLast,h=b.x,i=d.reversed,j=d.tickPositions;if(f||g){var k=this.getLabelSides(),l=k[0],k=k[1],e=e.plotLeft,m=e+d.len,j=(d=d.ticks[j[a+(f?1:-1)]])&&d.label.xy&&d.label.xy.x+d.getLabelSides()[f?0:1];f&&!i||g&&i?h+l<e&&(h=e-l,d&&h+k>j&&(c=!1)):h+k>m&&(h=m-k,d&&h+l<j&&(c=!1));b.x=h}return c},getPosition:function(a,b,c,d){var e=this.axis,
f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=this.axis,j=i.transA,k=i.reversed,i=i.staggerLines,a=a+e.x-(f&&d?f*j*(k?-1:1):0),b=b+e.y-(f&&!d?f*j*(k?1:-1):0);t(e.y)||(b+=w(c.styles.lineHeight)*0.9-c.getBBox().height/2);i&&(b+=g/(h||
1)%i*16);return{x:a,y:b}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b){var c=this.axis,d=c.options,e=c.chart.renderer,f=c.horiz,g=this.type,h=this.label,i=this.pos,j=d.labels,k=this.gridLine,l=g?g+"Grid":"grid",m=g?g+"Tick":"tick",p=d[l+"LineWidth"],u=d[l+"LineColor"],n=d[l+"LineDashStyle"],q=d[m+"Length"],l=d[m+"Width"]||0,D=d[m+"Color"],t=d[m+"Position"],m=this.mark,s=j.step,v=!0,F=c.tickmarkOffset,r=this.getPosition(f,i,F,b),P=
r.x,r=r.y,y=c.staggerLines;if(p){i=c.getPlotLinePath(i+F,p,b);if(k===x){k={stroke:u,"stroke-width":p};if(n)k.dashstyle=n;if(!g)k.zIndex=1;this.gridLine=k=p?e.path(i).attr(k).add(c.gridGroup):null}if(!b&&k&&i)k[this.isNew?"attr":"animate"]({d:i})}if(l&&q)t==="inside"&&(q=-q),c.opposite&&(q=-q),g=this.getMarkPath(P,r,q,l,f,e),m?m.animate({d:g}):this.mark=e.path(g).attr({stroke:D,"stroke-width":l}).add(c.axisGroup);if(h&&!isNaN(P))h.xy=r=this.getLabelPosition(P,r,h,f,j,F,a,s),this.isFirst&&!o(d.showFirstLabel,
1)||this.isLast&&!o(d.showLastLabel,1)?v=!1:!y&&f&&j.overflow==="justify"&&!this.handleOverflow(a,r)&&(v=!1),s&&a%s&&(v=!1),v?(h[this.isNew?"attr":"animate"](r),h.show(),this.isNew=!1):h.hide()},destroy:function(){Ea(this,this.axis)}};nb.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=(b.pointRange||0)/2,e=a.options,f=e.label,g=a.label,h=e.width,i=e.to,j=e.from,k=t(j)&&t(i),l=e.value,m=e.dashStyle,p=a.svgElem,u=[],n,q=e.color,D=e.zIndex,s=e.events,r=b.chart.renderer;b.isLog&&(j=ma(j),
i=ma(i),l=ma(l));if(h){if(u=b.getPlotLinePath(l,h),d={stroke:q,"stroke-width":h},m)d.dashstyle=m}else if(k){if(j=y(j,b.min-d),i=O(i,b.max+d),u=b.getPlotBandPath(j,i,e),d={fill:q},e.borderWidth)d.stroke=e.borderColor,d["stroke-width"]=e.borderWidth}else return;if(t(D))d.zIndex=D;if(p)u?p.animate({d:u},null,p.onGetPath):(p.hide(),p.onGetPath=function(){p.show()});else if(u&&u.length&&(a.svgElem=p=r.path(u).attr(d).add(),s))for(n in e=function(b){p.on(b,function(c){s[b].apply(a,[c])})},s)e(n);if(f&&
t(f.text)&&u&&u.length&&b.width>0&&b.height>0){f=A({align:c&&k&&"center",x:c?!k&&4:10,verticalAlign:!c&&k&&"middle",y:c?k?16:10:k?6:-4,rotation:c&&!k&&90},f);if(!g)a.label=g=r.text(f.text,0,0).attr({align:f.textAlign||f.align,rotation:f.rotation,zIndex:D}).css(f.style).add();b=[u[1],u[4],o(u[6],u[1])];u=[u[2],u[5],o(u[7],u[2])];c=Ma(b);k=Ma(u);g.align(f,!1,{x:c,y:k,width:Da(b)-c,height:Da(u)-k});g.show()}else g&&g.hide();return a},destroy:function(){Ba(this.axis.plotLinesAndBands,this);Ea(this,this.axis)}};
Hb.prototype={destroy:function(){Ea(this,this.axis)},setTotal:function(a){this.cum=this.total=a},render:function(a){var b=this.options.formatter.call(this);this.label?this.label.attr({text:b,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(b,0,0).css(this.options.style).attr({align:this.textAlign,rotation:this.options.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=this.isNegative,g=c.translate(this.percent?100:this.total,0,0,0,
1),c=c.translate(0),c=L(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e.attr({visibility:this.options.crop===!1||d.isInsidePlot(f.x,f.y)?Z?"inherit":"visible":"hidden"})}};ob.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",
labels:G,lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#6D869F",fontWeight:"bold"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,
labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,tickWidth:0,title:{rotation:270,text:"Y-values"},stackLabels:{enabled:!1,formatter:function(){return this.total},style:G.style}},defaultLeftAxisOptions:{labels:{align:"right",x:-8,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{align:"left",x:8,y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{align:"center",x:0,y:14},title:{rotation:0}},defaultTopAxisOptions:{labels:{align:"center",
x:0,y:-5},title:{rotation:0}},init:function(a,b){var c=b.isX;this.horiz=a.inverted?!c:c;this.xOrY=(this.isXAxis=c)?"x":"y";this.opposite=b.opposite;this.side=this.horiz?this.opposite?0:2:this.opposite?1:3;this.setOptions(b);var d=this.options,e=d.type,f=e==="datetime";this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.staggerLines=this.horiz&&d.labels.staggerLines;this.userOptions=b;this.minPixelPadding=0;this.chart=a;this.reversed=d.reversed;this.categories=d.categories;this.isLog=
e==="logarithmic";this.isLinked=t(d.linkedTo);this.isDatetimeAxis=f;this.tickmarkOffset=d.categories&&d.tickmarkPlacement==="between"?0.5:0;this.ticks={};this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.min=this.max=null;var g,d=this.options.events;a.axes.push(this);a[c?"xAxis":"yAxis"].push(this);this.series=[];if(a.inverted&&c&&this.reversed===x)this.reversed=
!0;this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;this.addPlotLine=this.addPlotBand=this.addPlotBandOrLine;for(g in d)I(this,g,d[g]);if(this.isLog)this.val2lin=ma,this.lin2val=ba},setOptions:function(a){this.options=A(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],A(M[this.isXAxis?"xAxis":"yAxis"],a))},defaultLabelFormatter:function(){var a=
this.axis,b=this.value,c=this.dateTimeLabelFormat,d=M.lang.numericSymbols,e=d&&d.length,f,g=a.isLog?b:a.tickInterval;if(a.categories)f=b;else if(c)f=cb(c,b);else if(e&&g>=1E3)for(;e--&&f===x;)a=Math.pow(1E3,e+1),g>=a&&d[e]!==null&&(f=Ia(b/a,-1)+d[e]);f===x&&(f=b>=1E3?Ia(b,0):Ia(b,-1));return f},getSeriesExtremes:function(){var a=this,b=a.chart,c=a.stacks,d=[],e=[],f;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=null;n(a.series,function(g){if(g.visible||!b.options.chart.ignoreHiddenSeries){var h=g.options,
i,j,k,l,m,p,u,n,q,D=h.threshold,s,r=[],v=0;a.hasVisibleSeries=!0;if(a.isLog&&D<=0)D=h.threshold=null;if(a.isXAxis){if(h=g.xData,h.length)a.dataMin=O(o(a.dataMin,h[0]),Ma(h)),a.dataMax=y(o(a.dataMax,h[0]),Da(h))}else{var F,w,P,A=g.cropped,z=g.xAxis.getExtremes(),C=!!g.modifyValue;i=h.stacking;a.usePercentage=i==="percent";if(i)m=h.stack,l=g.type+o(m,""),p="-"+l,g.stackKey=l,j=d[l]||[],d[l]=j,k=e[p]||[],e[p]=k;if(a.usePercentage)a.dataMin=0,a.dataMax=99;h=g.processedXData;u=g.processedYData;s=u.length;
for(f=0;f<s;f++)if(n=h[f],q=u[f],i&&(w=(F=q<D)?k:j,P=F?p:l,q=w[n]=t(w[n])?ea(w[n]+q):q,c[P]||(c[P]={}),c[P][n]||(c[P][n]=new Hb(a,a.options.stackLabels,F,n,m,i)),c[P][n].setTotal(q)),q!==null&&q!==x&&(C&&(q=g.modifyValue(q)),A||(h[f+1]||n)>=z.min&&(h[f-1]||n)<=z.max))if(n=q.length)for(;n--;)q[n]!==null&&(r[v++]=q[n]);else r[v++]=q;if(!a.usePercentage&&r.length)a.dataMin=O(o(a.dataMin,r[0]),Ma(r)),a.dataMax=y(o(a.dataMax,r[0]),Da(r));if(t(D))if(a.dataMin>=D)a.dataMin=D,a.ignoreMinPadding=!0;else if(a.dataMax<
D)a.dataMax=D,a.ignoreMaxPadding=!0}}})},translate:function(a,b,c,d,e,f){var g=this.len,h=1,i=0,j=d?this.oldTransA:this.transA,d=d?this.oldMin:this.min,e=this.options.ordinal||this.isLog&&e;if(!j)j=this.transA;c&&(h*=-1,i=g);this.reversed&&(h*=-1,i-=h*g);b?(this.reversed&&(a=g-a),a=a/j+d,e&&(a=this.lin2val(a))):(e&&(a=this.val2lin(a)),a=h*(a-d)*j+i+h*this.minPixelPadding+(f?j*this.pointRange/2:0));return a},getPlotLinePath:function(a,b,c){var d=this.chart,e=this.left,f=this.top,g,h,i,a=this.translate(a,
null,null,c),j=c&&d.oldChartHeight||d.chartHeight,k=c&&d.oldChartWidth||d.chartWidth,l;g=this.transB;c=h=s(a+g);g=i=s(j-a-g);if(isNaN(a))l=!0;else if(this.horiz){if(g=f,i=j-this.bottom,c<e||c>e+this.width)l=!0}else if(c=e,h=k-this.right,g<f||g>f+this.height)l=!0;return l?null:d.renderer.crispLine(["M",c,g,"L",h,i],b||0)},getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a);d&&c?d.push(c[4],c[5],c[1],c[2]):d=null;return d},getLinearTickPositions:function(a,b,c){for(var d,
b=ea(T(b/a)*a),c=ea(wa(c/a)*a),e=[];b<=c;){e.push(b);b=ea(b+a);if(b===d)break;d=b}return e},getLogTickPositions:function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=s(a),g=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=T(b),h,i,j,k,l,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!l;f++){i=e.length;for(h=0;h<i&&!l;h++)j=ma(ba(f)*e[h]),j>b&&g.push(k),k>c&&(l=!0),k=j}else if(b=ba(b),c=ba(c),a=e[d?"minorTickInterval":"tickInterval"],
a=o(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=hb(a,null,J.pow(10,T(J.log(a)/J.LN10))),g=Sa(this.getLinearTickPositions(a,b,c),ma),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return g},getMinorTickPositions:function(){var a=this.tickPositions,b=this.minorTickInterval,c=[],d,e;if(this.isLog){e=a.length;for(d=1;d<e;d++)c=c.concat(this.getLogTickPositions(b,a[d-1],a[d],!0))}else for(a=this.min+(a[0]-this.min)%b;a<=
this.max;a+=b)c.push(a);return c},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,j;if(this.isXAxis&&this.minRange===x&&!this.isLog)t(a.min)||t(a.max)?this.minRange=null:(n(this.series,function(a){i=a.xData;for(g=j=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===x||h<f)f=h}),this.minRange=O(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){var k=this.minRange;d=(k-c+b)/2;d=[b-d,o(a.min,b-d)];if(e)d[2]=this.dataMin;
b=Da(d);c=[b+k,o(a.max,b+k)];if(e)c[2]=this.dataMax;c=Ma(c);c-b<k&&(d[0]=c-k,d[1]=o(a.min,c-k),b=Da(d))}this.min=b;this.max=c},setAxisTranslation:function(){var a=this.max-this.min,b=0,c,d=0,e=0,f=this.linkedParent,g=this.transA;if(this.isXAxis)f?(d=f.minPointOffset,e=f.pointRangePadding):n(this.series,function(a){var f=a.pointRange,g=a.options.pointPlacement,k=a.closestPointRange;b=y(b,f);d=y(d,g?0:f/2);e=y(e,g==="on"?0:f);!a.noSharedTooltip&&t(k)&&(c=t(c)?O(c,k):k)}),this.minPointOffset=d,this.pointRangePadding=
e,this.pointRange=b,this.closestPointRange=c;this.oldTransA=g;this.translationSlope=this.transA=g=this.len/(a+e||1);this.transB=this.horiz?this.left:this.bottom;this.minPixelPadding=g*d},setTickPositions:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=b.options.tickPositioner,j=d.maxPadding,k=d.minPadding,l=d.tickInterval,m=d.minTickInterval,p=d.tickPixelInterval,u=b.categories;h?(b.linkedParent=c[g?"xAxis":"yAxis"][d.linkedTo],c=b.linkedParent.getExtremes(),
b.min=o(c.min,c.dataMin),b.max=o(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&$a(11,1)):(b.min=o(b.userMin,d.min,b.dataMin),b.max=o(b.userMax,d.max,b.dataMax));if(e)!a&&O(b.min,o(b.dataMin,b.min))<=0&&$a(10,1),b.min=ea(ma(b.min)),b.max=ea(ma(b.max));if(b.range&&(b.userMin=b.min=y(b.min,b.max-b.range),b.userMax=b.max,a))b.range=null;b.adjustForMinRange();if(!u&&!b.usePercentage&&!h&&t(b.min)&&t(b.max)){c=b.max-b.min||1;if(!t(d.min)&&!t(b.userMin)&&k&&(b.dataMin<0||!b.ignoreMinPadding))b.min-=
c*k;if(!t(d.max)&&!t(b.userMax)&&j&&(b.dataMax>0||!b.ignoreMaxPadding))b.max+=c*j}b.tickInterval=b.min===b.max||b.min===void 0||b.max===void 0?1:h&&!l&&p===b.linkedParent.options.tickPixelInterval?b.linkedParent.tickInterval:o(l,u?1:(b.max-b.min)*p/(b.len||1));g&&!a&&n(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(a);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);
if(!l&&b.tickInterval<m)b.tickInterval=m;if(!f&&!e&&(a=J.pow(10,T(J.log(b.tickInterval)/J.LN10)),!l))b.tickInterval=hb(b.tickInterval,null,a,d);b.minorTickInterval=d.minorTickInterval==="auto"&&b.tickInterval?b.tickInterval/5:d.minorTickInterval;b.tickPositions=i=d.tickPositions||i&&i.apply(b,[b.min,b.max]);if(!i)i=f?(b.getNonLinearTimeTicks||Ob)(Nb(b.tickInterval,d.units),b.min,b.max,d.startOfWeek,b.ordinalPositions,b.closestPointRange,!0):e?b.getLogTickPositions(b.tickInterval,b.min,b.max):b.getLinearTickPositions(b.tickInterval,
b.min,b.max),b.tickPositions=i;if(!h)e=i[0],f=i[i.length-1],h=b.minPointOffset||0,d.startOnTick?b.min=e:b.min-h>e&&i.shift(),d.endOnTick?b.max=f:b.max+h<f&&i.pop()},setMaxTicks:function(){var a=this.chart,b=a.maxTicks,c=this.tickPositions,d=this.xOrY;b||(b={x:0,y:0});if(!this.isLinked&&!this.isDatetimeAxis&&c.length>b[d]&&this.options.alignTicks!==!1)b[d]=c.length;a.maxTicks=b},adjustTickAmount:function(){var a=this.xOrY,b=this.tickPositions,c=this.chart.maxTicks;if(c&&c[a]&&!this.isDatetimeAxis&&
!this.categories&&!this.isLinked&&this.options.alignTicks!==!1){var d=this.tickAmount,e=b.length;this.tickAmount=a=c[a];if(e<a){for(;b.length<a;)b.push(ea(b[b.length-1]+this.tickInterval));this.transA*=(e-1)/(a-1);this.max=b[b.length-1]}if(t(d)&&a!==d)this.isDirty=!0}},setScale:function(){var a=this.stacks,b,c,d,e;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();e=this.len!==this.oldAxisLength;n(this.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)d=
!0});if(e||d||this.isLinked||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax)if(this.getSeriesExtremes(),this.setTickPositions(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,!this.isDirty)this.isDirty=e||this.min!==this.oldMin||this.max!==this.oldMax;if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total;this.setMaxTicks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=o(c,!0),e=r(e,{min:a,max:b});E(f,"setExtremes",e,function(){f.userMin=a;f.userMax=
b;f.isDirtyExtremes=!0;c&&g.redraw(d)})},zoom:function(a,b){this.setExtremes(a,b,!1,x,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=b.offsetRight||0;this.left=o(b.left,a.plotLeft+c);this.top=o(b.top,a.plotTop);this.width=o(b.width,a.plotWidth-c+d);this.height=o(b.height,a.plotHeight);this.bottom=a.chartHeight-this.height-this.top;this.right=a.chartWidth-this.width-this.left;this.len=y(this.horiz?this.width:this.height,0)},getExtremes:function(){var a=
this.isLog;return{min:a?ea(ba(this.min)):this.min,max:a?ea(ba(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?ba(this.min):this.min,b=b?ba(this.max):this.max;c>a||a===null?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},addPlotBandOrLine:function(a){a=(new nb(this,a)).render();this.plotLinesAndBands.push(a);return a},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.tickPositions,
f=a.ticks,g=a.horiz,h=a.side,i,j=0,k,l=0,m=d.title,p=d.labels,u=0,da=b.axisOffset,q=[-1,1,1,-1][h],D;a.hasData=b=a.hasVisibleSeries||t(a.min)&&t(a.max)&&!!e;a.showAxis=i=b||o(d.showEmpty,!0);if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(),a.labelGroup=c.g("axis-labels").attr({zIndex:p.zIndex||7}).add();if(b||a.isLinked)n(e,function(b){f[b]?f[b].addLabel():f[b]=new Pa(a,b)}),n(e,function(a){if(h===0||h===2||{1:"left",
3:"right"}[h]===p.align)u=y(f[a].getLabelSize(),u)}),a.staggerLines&&(u+=(a.staggerLines-1)*16);else for(D in f)f[D].destroy(),delete f[D];if(m&&m.text){if(!a.axisTitle)a.axisTitle=c.text(m.text,0,0,m.useHTML).attr({zIndex:7,rotation:m.rotation||0,align:m.textAlign||{low:"left",middle:"center",high:"right"}[m.align]}).css(m.style).add(a.axisGroup),a.axisTitle.isNew=!0;if(i)j=a.axisTitle.getBBox()[g?"height":"width"],l=o(m.margin,g?5:10),k=m.offset;a.axisTitle[i?"show":"hide"]()}a.offset=q*o(d.offset,
da[h]);a.axisTitleMargin=o(k,u+l+(h!==2&&u&&q*d.labels[g?"y":"x"]));da[h]=y(da[h],a.axisTitleMargin+j+q*a.offset)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d;this.lineTop=c=b.chartHeight-this.bottom-(c?this.height:0)+d;return b.renderer.crispLine(["M",e?this.left:f,e?c:this.top,"L",e?b.chartWidth-this.right:f,e?c:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,
f=a?b:c,g=this.opposite,h=this.offset,i=w(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?i:0);return{x:a?d:b+(g?this.width:0)+h+(e.x||0),y:a?b-(g?this.height:0)+h:d+(e.y||0)}},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.isLog,f=a.isLinked,g=a.tickPositions,h=a.axisTitle,i=a.stacks,j=a.ticks,k=a.minorTicks,l=a.alternateBands,m=d.stackLabels,p=d.alternateGridColor,u=a.tickmarkOffset,
o=d.lineWidth,q,D=b.hasRendered&&t(a.oldMin)&&!isNaN(a.oldMin),r=a.showAxis,s,v;if(a.hasData||f)if(a.minorTickInterval&&!a.categories&&n(a.getMinorTickPositions(),function(b){k[b]||(k[b]=new Pa(a,b,"minor"));D&&k[b].isNew&&k[b].render(null,!0);k[b].isActive=!0;k[b].render()}),n(g.slice(1).concat([g[0]]),function(b,c){c=c===g.length-1?0:c+1;if(!f||b>=a.min&&b<=a.max)j[b]||(j[b]=new Pa(a,b)),D&&j[b].isNew&&j[b].render(c,!0),j[b].isActive=!0,j[b].render(c)}),p&&n(g,function(b,c){if(c%2===0&&b<a.max)l[b]||
(l[b]=new nb(a)),s=b+u,v=g[c+1]!==x?g[c+1]+u:a.max,l[b].options={from:e?ba(s):s,to:e?ba(v):v,color:p},l[b].render(),l[b].isActive=!0}),!a._addedPlotLB)n((d.plotLines||[]).concat(d.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0;n([j,k,l],function(a){for(var b in a)a[b].isActive?a[b].isActive=!1:(a[b].destroy(),delete a[b])});if(o)q=a.getLinePath(o),a.axisLine?a.axisLine.animate({d:q}):a.axisLine=c.path(q).attr({stroke:d.lineColor,"stroke-width":o,zIndex:7}).add(a.axisGroup),
a.axisLine[r?"show":"hide"]();if(h&&r)h[h.isNew?"attr":"animate"](a.getTitlePosition()),h.isNew=!1;if(m&&m.enabled){var F,w,d=a.stackTotalGroup;if(!d)a.stackTotalGroup=d=c.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();d.translate(b.plotLeft,b.plotTop);for(F in i)for(w in b=i[F],b)b[w].render(d)}a.isDirty=!1},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=b.length;c--;)b[c].id===a&&b[c].destroy()},setTitle:function(a,b){var c=this.chart,d=this.options,e=this.axisTitle;
d.title=A(d.title,a);this.axisTitle=e&&e.destroy();this.isDirty=!0;o(b,!0)&&c.redraw()},redraw:function(){var a=this.chart;a.tracker.resetTracker&&a.tracker.resetTracker(!0);this.render();n(this.plotLinesAndBands,function(a){a.render()});n(this.series,function(a){a.isDirty=!0})},setCategories:function(a,b){var c=this.chart;this.categories=this.userOptions.categories=a;n(this.series,function(a){a.translate();a.setTooltipPoints(!0)});this.isDirty=!0;o(b,!0)&&c.redraw()},destroy:function(){var a=this,
b=a.stacks,c;S(a);for(c in b)Ea(b[c]),b[c]=null;n([a.ticks,a.minorTicks,a.alternateBands,a.plotLinesAndBands],function(a){Ea(a)});n("stackTotalGroup,axisLine,axisGroup,gridGroup,labelGroup,axisTitle".split(","),function(b){a[b]&&(a[b]=a[b].destroy())})}};pb.prototype={destroy:function(){n(this.crosshairs,function(a){a&&a.destroy()});if(this.label)this.label=this.label.destroy()},move:function(a,b,c,d){var e=this,f=e.now,g=e.options.animation!==!1&&!e.isHidden;r(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:
b,anchorX:g?(2*f.anchorX+c)/3:c,anchorY:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g&&(L(a-f.x)>1||L(b-f.y)>1))clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(){if(!this.isHidden){var a=this.chart.hoverPoints;this.label.hide();a&&n(a,function(a){a.setState()});this.chart.hoverPoints=null;this.isHidden=!0}},hideCrosshairs:function(){n(this.crosshairs,function(a){a&&a.hide()})},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=
0,g=0,h,a=na(a);c=a[0].tooltipPos;c||(n(a,function(a){h=a.series.yAxis;f+=a.plotX;g+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&h?h.top-d.plotTop:0)}),f/=a.length,g/=a.length,c=[e?d.plotWidth-g:f,this.shared&&!e&&a.length>1&&b?b.chartY-d.plotTop:e?d.plotHeight-f:g]);return Sa(c,s)},getPosition:function(a,b,c){var d=this.chart,e=d.plotLeft,f=d.plotTop,g=d.plotWidth,h=d.plotHeight,i=o(this.options.distance,12),j=c.plotX,c=c.plotY,d=j+e+(d.inverted?i:-a-i),k=c-b+f+15,l;d<7&&(d=e+y(j,0)+i);d+a>
e+g&&(d-=d+a-(e+g),k=c-b+f-i,l=!0);k<f+5&&(k=f+5,l&&c>=k&&c<=k+b&&(k=c+f+i));k+b>f+h&&(k=y(f,f+h-b-i));return{x:d,y:k}},refresh:function(a,b){function c(){var a=this.points||na(this),b=a[0].series,c;c=[b.tooltipHeaderFormatter(a[0].key)];n(a,function(a){b=a.series;c.push(b.tooltipFormatter&&b.tooltipFormatter(a)||a.point.tooltipFormatter(b.tooltipOptions.pointFormat))});c.push(f.footerFormat||"");return c.join("")}var d=this.chart,e=this.label,f=this.options,g,h,i,j={},k,l=[];k=f.formatter||c;var j=
d.hoverPoints,m,p=f.crosshairs;i=this.shared;h=this.getAnchor(a,b);g=h[0];h=h[1];i&&(!a.series||!a.series.noSharedTooltip)?(d.hoverPoints=a,j&&n(j,function(a){a.setState()}),n(a,function(a){a.setState("hover");l.push(a.getLabelConfig())}),j={x:a[0].category,y:a[0].y},j.points=l,a=a[0]):j=a.getLabelConfig();k=k.call(j);j=a.series;i=i||!j.isCartesian||j.tooltipOutsidePlot||d.isInsidePlot(g,h);k===!1||!i?this.hide():(this.isHidden&&e.show(),e.attr({text:k}),m=f.borderColor||a.color||j.color||"#606060",
e.attr({stroke:m}),e=(f.positioner||this.getPosition).call(this,e.width,e.height,{plotX:g,plotY:h}),this.move(s(e.x),s(e.y),g+d.plotLeft,h+d.plotTop),this.isHidden=!1);if(p){p=na(p);for(e=p.length;e--;)if(i=a.series[e?"yAxis":"xAxis"],p[e]&&i)if(i=i.getPlotLinePath(e?o(a.stackY,a.y):a.x,1),this.crosshairs[e])this.crosshairs[e].attr({d:i,visibility:"visible"});else{j={"stroke-width":p[e].width||1,stroke:p[e].color||"#C0C0C0",zIndex:p[e].zIndex||2};if(p[e].dashStyle)j.dashstyle=p[e].dashStyle;this.crosshairs[e]=
d.renderer.path(i).attr(j).add()}}E(d,"tooltipRefresh",{text:k,x:g+d.plotLeft,y:h+d.plotTop,borderColor:m})}};qb.prototype={normalizeMouseEvent:function(a){var b,c,d,a=a||K.event;if(!a.target)a.target=a.srcElement;a=Lb(a);d=a.touches?a.touches.item(0):a;this.chartPosition=b=Sb(this.chart.container);d.pageX===x?(c=a.x,b=a.y):(c=d.pageX-b.left,b=d.pageY-b.top);return r(a,{chartX:s(c),chartY:s(b)})},getMouseCoordinates:function(a){var b={xAxis:[],yAxis:[]},c=this.chart;n(c.axes,function(d){var e=d.isXAxis;
b[e?"xAxis":"yAxis"].push({axis:d,value:d.translate(((c.inverted?!e:e)?a.chartX-c.plotLeft:d.top+d.len-a.chartY)-d.minPixelPadding,!0)})});return b},getIndex:function(a){var b=this.chart;return b.inverted?b.plotHeight+b.plotTop-a.chartY:a.chartX-b.plotLeft},onmousemove:function(a){var b=this.chart,c=b.series,d=b.tooltip,e,f=b.hoverPoint,g=b.hoverSeries,h,i,j=b.chartWidth,k=this.getIndex(a);if(d&&this.options.tooltip.shared&&(!g||!g.noSharedTooltip)){e=[];h=c.length;for(i=0;i<h;i++)if(c[i].visible&&
c[i].options.enableMouseTracking!==!1&&!c[i].noSharedTooltip&&c[i].tooltipPoints.length)b=c[i].tooltipPoints[k],b._dist=L(k-b[c[i].xAxis.tooltipPosName||"plotX"]),j=O(j,b._dist),e.push(b);for(h=e.length;h--;)e[h]._dist>j&&e.splice(h,1);if(e.length&&e[0].plotX!==this.hoverX)d.refresh(e,a),this.hoverX=e[0].plotX}if(g&&g.tracker&&(b=g.tooltipPoints[k])&&b!==f)b.onMouseOver()},resetTracker:function(a){var b=this.chart,c=b.hoverSeries,d=b.hoverPoint,e=b.tooltip,b=e&&e.shared?b.hoverPoints:d;(a=a&&e&&b)&&
na(b)[0].plotX===x&&(a=!1);if(a)e.refresh(b);else{if(d)d.onMouseOut();if(c)c.onMouseOut();e&&(e.hide(),e.hideCrosshairs());this.hoverX=null}},setDOMEvents:function(){function a(){if(b.selectionMarker){var f={xAxis:[],yAxis:[]},g=b.selectionMarker.getBBox(),h=g.x-c.plotLeft,l=g.y-c.plotTop,m;e&&(n(c.axes,function(a){if(a.options.zoomEnabled!==!1){var b=a.isXAxis,d=c.inverted?!b:b,e=a.translate(d?h:c.plotHeight-l-g.height,!0,0,0,1),d=a.translate((d?h+g.width:c.plotHeight-l)-2*a.minPixelPadding,!0,0,
0,1);!isNaN(e)&&!isNaN(d)&&(f[b?"xAxis":"yAxis"].push({axis:a,min:O(e,d),max:y(e,d)}),m=!0)}}),m&&E(c,"selection",f,function(a){c.zoom(a)}));b.selectionMarker=b.selectionMarker.destroy()}if(c)H(d,{cursor:"auto"}),c.cancelClick=e,c.mouseIsDown=e=!1;S(C,fa?"touchend":"mouseup",a)}var b=this,c=b.chart,d=c.container,e,f=b.zoomX&&!c.inverted||b.zoomY&&c.inverted,g=b.zoomY&&!c.inverted||b.zoomX&&c.inverted;b.hideTooltipOnMouseMove=function(a){a=Lb(a);b.chartPosition&&c.hoverSeries&&c.hoverSeries.isCartesian&&
!c.isInsidePlot(a.pageX-b.chartPosition.left-c.plotLeft,a.pageY-b.chartPosition.top-c.plotTop)&&b.resetTracker()};b.hideTooltipOnMouseLeave=function(){b.resetTracker();b.chartPosition=null};d.onmousedown=function(d){d=b.normalizeMouseEvent(d);!fa&&d.preventDefault&&d.preventDefault();c.mouseIsDown=!0;c.cancelClick=!1;c.mouseDownX=b.mouseDownX=d.chartX;b.mouseDownY=d.chartY;I(C,fa?"touchend":"mouseup",a)};var h=function(a){if(!a||!(a.touches&&a.touches.length>1)){a=b.normalizeMouseEvent(a);if(!fa)a.returnValue=
!1;var d=a.chartX,h=a.chartY,l=!c.isInsidePlot(d-c.plotLeft,h-c.plotTop);fa&&a.type==="touchstart"&&(z(a.target,"isTracker")?c.runTrackerClick||a.preventDefault():!c.runChartClick&&!l&&a.preventDefault());if(l)d<c.plotLeft?d=c.plotLeft:d>c.plotLeft+c.plotWidth&&(d=c.plotLeft+c.plotWidth),h<c.plotTop?h=c.plotTop:h>c.plotTop+c.plotHeight&&(h=c.plotTop+c.plotHeight);if(c.mouseIsDown&&a.type!=="touchstart"&&(e=Math.sqrt(Math.pow(b.mouseDownX-d,2)+Math.pow(b.mouseDownY-h,2)),e>10)){var m=c.isInsidePlot(b.mouseDownX-
c.plotLeft,b.mouseDownY-c.plotTop);if(c.hasCartesianSeries&&(b.zoomX||b.zoomY)&&m&&!b.selectionMarker)b.selectionMarker=c.renderer.rect(c.plotLeft,c.plotTop,f?1:c.plotWidth,g?1:c.plotHeight,0).attr({fill:b.options.chart.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();if(b.selectionMarker&&f){var p=d-b.mouseDownX;b.selectionMarker.attr({width:L(p),x:(p>0?0:p)+b.mouseDownX})}b.selectionMarker&&g&&(h-=b.mouseDownY,b.selectionMarker.attr({height:L(h),y:(h>0?0:h)+b.mouseDownY}));m&&!b.selectionMarker&&
b.options.chart.panning&&c.pan(d)}if(!l)b.onmousemove(a);return l||!c.hasCartesianSeries}};d.onmousemove=h;I(d,"mouseleave",b.hideTooltipOnMouseLeave);I(C,"mousemove",b.hideTooltipOnMouseMove);d.ontouchstart=function(a){if(b.zoomX||b.zoomY)d.onmousedown(a);h(a)};d.ontouchmove=h;d.ontouchend=function(){e&&b.resetTracker()};d.onclick=function(a){var d=c.hoverPoint,e,f,a=b.normalizeMouseEvent(a);a.cancelBubble=!0;if(!c.cancelClick)d&&(z(a.target,"isTracker")||z(a.target.parentNode,"isTracker"))?(e=d.plotX,
f=d.plotY,r(d,{pageX:b.chartPosition.left+c.plotLeft+(c.inverted?c.plotWidth-f:e),pageY:b.chartPosition.top+c.plotTop+(c.inverted?c.plotHeight-e:f)}),E(d.series,"click",r(a,{point:d})),d.firePointEvent("click",a)):(r(a,b.getMouseCoordinates(a)),c.isInsidePlot(a.chartX-c.plotLeft,a.chartY-c.plotTop)&&E(c,"click",a))}},destroy:function(){var a=this.chart,b=a.container;if(a.trackerGroup)a.trackerGroup=a.trackerGroup.destroy();S(b,"mouseleave",this.hideTooltipOnMouseLeave);S(C,"mousemove",this.hideTooltipOnMouseMove);
b.onclick=b.onmousedown=b.onmousemove=b.ontouchstart=b.ontouchend=b.ontouchmove=null;clearInterval(this.tooltipTimeout)},init:function(a,b){if(!a.trackerGroup)a.trackerGroup=a.renderer.g("tracker").attr({zIndex:9}).add();if(b.enabled)a.tooltip=new pb(a,b);this.setDOMEvents()}};rb.prototype={init:function(a){var b=this,c=b.options=a.options.legend;if(c.enabled){var d=c.itemStyle,e=o(c.padding,8),f=c.itemMarginTop||0;b.baseline=w(d.fontSize)+3+f;b.itemStyle=d;b.itemHiddenStyle=A(d,c.itemHiddenStyle);
b.itemMarginTop=f;b.padding=e;b.initialItemX=e;b.initialItemY=e-5;b.maxItemWidth=0;b.chart=a;b.itemHeight=0;b.lastLineHeight=0;b.render();I(b.chart,"endResize",function(){b.positionCheckboxes()})}},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.color:g,g=a.options&&a.options.marker,i={stroke:h,fill:h},j;d&&d.css({fill:c});e&&e.attr({stroke:h});if(f){if(g)for(j in g=a.convertAttribs(g),g)d=g[j],
d!==x&&(i[j]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;a.legendGroup&&a.legendGroup.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;n(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&a[b].destroy()});b&&Na(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();if(a)this.group=a.destroy()},positionCheckboxes:function(){var a=
this;n(a.allItems,function(b){var c=b.checkbox,d=a.group.alignAttr;c&&H(c,{left:d.translateX+b.legendItemWidth+c.x-20+"px",top:d.translateY+c.y+3+"px"})})},renderItem:function(a){var u;var b=this,c=b.chart,d=c.renderer,e=b.options,f=e.layout==="horizontal",g=e.symbolWidth,h=e.symbolPadding,i=b.itemStyle,j=b.itemHiddenStyle,k=b.padding,l=!e.rtl,m=e.width,p=e.itemMarginBottom||0,o=b.itemMarginTop,n=b.initialItemX,q=a.legendItem,t=a.series||a,r=t.options,s=r.showCheckbox;if(!q&&(a.legendGroup=d.g("legend-item").attr({zIndex:1}).add(b.scrollGroup),
t.drawLegendSymbol(b,a),a.legendItem=q=d.text(e.labelFormatter.call(a),l?g+h:-h,b.baseline,e.useHTML).css(A(a.visible?i:j)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup),a.legendGroup.on("mouseover",function(){a.setState("hover");q.css(b.options.itemHoverStyle)}).on("mouseout",function(){q.css(a.visible?i:j);a.setState()}).on("click",function(b){var c=function(){a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):E(a,"legendItemClick",b,c)}),b.colorizeItem(a,
a.visible),r&&s))a.checkbox=Q("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},e.itemCheckboxStyle,c.container),I(a.checkbox,"click",function(b){E(a,"checkboxClick",{checked:b.target.checked},function(){a.select()})});d=q.getBBox();u=a.legendItemWidth=e.itemWidth||g+h+d.width+k+(s?20:0),e=u;b.itemHeight=g=d.height;if(f&&b.itemX-n+e>(m||c.chartWidth-2*k-n))b.itemX=n,b.itemY+=o+b.lastLineHeight+p,b.lastLineHeight=0;b.maxItemWidth=y(b.maxItemWidth,e);b.lastItemY=o+b.itemY+p;b.lastLineHeight=
y(g,b.lastLineHeight);a._legendItemPos=[b.itemX,b.itemY];f?b.itemX+=e:(b.itemY+=o+g+p,b.lastLineHeight=g);b.offsetWidth=m||y(f?b.itemX-n:e,b.offsetWidth)},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,j=a.options,k=a.padding,l=j.borderWidth,m=j.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup),
a.clipRect=c.clipRect(0,0,9999,b.chartHeight),a.contentGroup.clip(a.clipRect);e=[];n(b.series,function(a){var b=a.options;b.showInLegend&&(e=e.concat(a.legendItems||(b.legendType==="point"?a.data:a)))});Fb(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});j.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;n(e,function(b){a.renderItem(b)});g=j.width||a.offsetWidth;h=a.lastItemY+a.lastLineHeight;h=a.handleOverflow(h);if(l||m){g+=k;h+=k;if(i){if(g>
0&&h>0)i[i.isNew?"attr":"animate"](i.crisp(null,null,null,g,h)),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,j.borderRadius,l||0).attr({stroke:j.borderColor,"stroke-width":l||0,fill:m||R}).add(d).shadow(j.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;n(e,function(b){a.positionItem(b)});f&&d.align(r({width:g,height:h},j),!0,b.spacingBox);b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+
(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h=this.clipRect,i=e.navigation,j=o(i.animation,!0),k=i.arrowSize||12,l=this.nav;e.layout==="horizontal"&&(f/=2);g&&(f=O(f,g));if(a>f){this.clipHeight=c=f-20;this.pageCount=wa(a/c);this.currentPage=o(this.currentPage,1);this.fullHeight=a;h.attr({height:c});if(!l)this.nav=l=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,k,k).on("click",function(){b.scroll(-1,j)}).add(l),this.pager=d.text("",15,10).css(i.style).add(l),
this.down=d.symbol("triangle-down",0,0,k,k).on("click",function(){b.scroll(1,j)}).add(l);b.scroll(0);a=f}else l&&(h.attr({height:c.chartHeight}),l.hide(),this.scrollGroup.attr({translateY:1}));return a},scroll:function(a,b){var c=this.pageCount,d=this.currentPage+a,e=this.clipHeight,f=this.options.navigation,g=f.activeColor,f=f.inactiveColor,h=this.pager,i=this.padding;d>c&&(d=c);if(d>0)b!==x&&ua(b,this.chart),this.nav.attr({translateX:i,translateY:e+7,visibility:"visible"}),this.up.attr({fill:d===
1?f:g}).css({cursor:d===1?"default":"pointer"}),h.attr({text:d+"/"+this.pageCount}),this.down.attr({x:18+this.pager.getBBox().width,fill:d===c?f:g}).css({cursor:d===c?"default":"pointer"}),this.scrollGroup.animate({translateY:-O(e*(d-1),this.fullHeight-e+i)+1}),h.attr({text:d+"/"+c}),this.currentPage=d}};sb.prototype={initSeries:function(a){var b=this.options.chart,b=new $[a.type||b.type||b.defaultSeriesType];b.init(this,a);return b},addSeries:function(a,b,c){var d,e=this;a&&(ua(c,e),b=o(b,!0),E(e,
"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;b&&e.redraw()}));return d},isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},adjustTickAmounts:function(){this.options.chart.alignTicks!==!1&&n(this.axes,function(a){a.adjustTickAmount()});this.maxTicks=null},redraw:function(a){var b=this.axes,c=this.series,d=this.tracker,e=this.legend,f=this.isDirtyLegend,g,h=this.isDirtyBox,i=c.length,j=i,k=this.renderer,l=k.isHidden(),
m=[];ua(a,this);for(l&&this.cloneRenderTo();j--;)if(a=c[j],a.isDirty&&a.options.stacking){g=!0;break}if(g)for(j=i;j--;)if(a=c[j],a.options.stacking)a.isDirty=!0;n(c,function(a){a.isDirty&&a.options.legendType==="point"&&(f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;if(this.hasCartesianSeries){if(!this.isResizing)this.maxTicks=null,n(b,function(a){a.setScale()});this.adjustTickAmounts();this.getMargins();n(b,function(a){if(a.isDirtyExtremes)a.isDirtyExtremes=!1,m.push(function(){E(a,
"afterSetExtremes",a.getExtremes())});if(a.isDirty||h||g)a.redraw(),h=!0})}h&&this.drawChartBox();n(c,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.resetTracker&&d.resetTracker(!0);k.draw();E(this,"redraw");l&&this.cloneRenderTo(!0);n(m,function(a){a.call()})},showLoading:function(a){var b=this.options,c=this.loadingDiv,d=b.loading;if(!c)this.loadingDiv=c=Q(ia,{className:"highcharts-loading"},r(d.style,{left:this.plotLeft+"px",top:this.plotTop+"px",width:this.plotWidth+
"px",height:this.plotHeight+"px",zIndex:10,display:R}),this.container),this.loadingSpan=Q("span",null,d.labelStyle,c);this.loadingSpan.innerHTML=a||b.lang.loading;if(!this.loadingShown)H(c,{opacity:0,display:""}),xb(c,{opacity:d.style.opacity},{duration:d.showDuration||0}),this.loadingShown=!0},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&xb(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){H(b,{display:R})}});this.loadingShown=!1},get:function(a){var b=this.axes,
c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis||{},b=b.yAxis||{},c=na(c);n(c,function(a,b){a.index=b;a.isX=!0});b=na(b);n(b,function(a,b){a.index=b});c=c.concat(b);n(c,function(b){new ob(a,b)});a.adjustTickAmounts()},getSelectedPoints:function(){var a=[];
n(this.series,function(b){a=a.concat(Kb(b.points,function(a){return a.selected}))});return a},getSelectedSeries:function(){return Kb(this.series,function(a){return a.selected})},showResetZoom:function(){var a=this,b=M.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,a[f]);
this.resetZoomButton.alignTo=f},zoomOut:function(){var a=this,b=a.resetZoomButton;E(a,"selection",{resetSelection:!0},function(){a.zoom()});if(b)a.resetZoomButton=b.destroy()},zoom:function(a){var b=this,c;!a||a.resetSelection?n(b.axes,function(a){c=a.zoom()}):n(a.xAxis.concat(a.yAxis),function(a){var e=a.axis;if(b.tracker[e.isXAxis?"zoomX":"zoomY"])c=e.zoom(a.min,a.max)});b.resetZoomButton||b.showResetZoom();c&&b.redraw(o(b.options.chart.animation,b.pointCount<100))},pan:function(a){var b=this.xAxis[0],
c=this.mouseDownX,d=b.pointRange/2,e=b.getExtremes(),f=b.translate(c-a,!0)+d,c=b.translate(c+this.plotWidth-a,!0)-d;(d=this.hoverPoints)&&n(d,function(a){a.setState()});b.series.length&&f>O(e.dataMin,e.min)&&c<y(e.dataMax,e.max)&&b.setExtremes(f,c,!0,!1,{trigger:"pan"});this.mouseDownX=a;H(this.container,{cursor:"move"})},setTitle:function(a,b){var c=this,d=c.options,e;c.chartTitleOptions=e=A(d.title,a);c.chartSubtitleOptions=d=A(d.subtitle,b);n([["title",a,e],["subtitle",b,d]],function(a){var b=
a[0],d=c[b],e=a[1],a=a[2];d&&e&&(c[b]=d=d.destroy());a&&a.text&&!d&&(c[b]=c.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add().align(a,!1,c.spacingBox))})},getChartSize:function(){var a=this.options.chart,b=this.renderToClone||this.renderTo;this.containerWidth=db(b,"width");this.containerHeight=db(b,"height");this.chartWidth=a.width||this.containerWidth||600;this.chartHeight=a.height||(this.containerHeight>19?this.containerHeight:
400)},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;a?b&&(this.renderTo.appendChild(c),Na(b),delete this.renderToClone):(c&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),H(b,{position:"absolute",top:"-9999px",display:"block"}),C.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options.chart,c,d,e;this.renderTo=a=b.renderTo;e="highcharts-"+ub++;if(la(a))this.renderTo=a=C.getElementById(a);a||$a(13,!0);a.innerHTML="";
a.offsetWidth||this.cloneRenderTo();this.getChartSize();c=this.chartWidth;d=this.chartHeight;this.container=a=Q(ia,{className:"highcharts-container"+(b.className?" "+b.className:""),id:e},r({position:"relative",overflow:"hidden",width:c+"px",height:d+"px",textAlign:"left",lineHeight:"normal",zIndex:0},b.style),this.renderToClone||a);this.renderer=b.forExport?new ra(a,c,d,!0):new Ra(a,c,d);U&&this.renderer.create(this,a,c,d)},getMargins:function(){var a=this.options.chart,b=a.spacingTop,c=a.spacingRight,
d=a.spacingBottom,a=a.spacingLeft,e,f=this.legend,g=this.optionsMarginTop,h=this.optionsMarginLeft,i=this.optionsMarginRight,j=this.optionsMarginBottom,k=this.chartTitleOptions,l=this.chartSubtitleOptions,m=this.options.legend,p=o(m.margin,10),u=m.x,r=m.y,q=m.align,s=m.verticalAlign;this.resetMargins();e=this.axisOffset;if((this.title||this.subtitle)&&!t(this.optionsMarginTop))if(l=y(this.title&&!k.floating&&!k.verticalAlign&&k.y||0,this.subtitle&&!l.floating&&!l.verticalAlign&&l.y||0))this.plotTop=
y(this.plotTop,l+o(k.margin,15)+b);if(f.display&&!m.floating)if(q==="right"){if(!t(i))this.marginRight=y(this.marginRight,f.legendWidth-u+p+c)}else if(q==="left"){if(!t(h))this.plotLeft=y(this.plotLeft,f.legendWidth+u+p+a)}else if(s==="top"){if(!t(g))this.plotTop=y(this.plotTop,f.legendHeight+r+p+b)}else if(s==="bottom"&&!t(j))this.marginBottom=y(this.marginBottom,f.legendHeight-r+p+d);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);
this.hasCartesianSeries&&n(this.axes,function(a){a.getOffset()});t(h)||(this.plotLeft+=e[3]);t(g)||(this.plotTop+=e[0]);t(j)||(this.marginBottom+=e[2]);t(i)||(this.marginRight+=e[1]);this.setChartSize()},initReflow:function(){function a(a){var g=c.width||db(d,"width"),h=c.height||db(d,"height"),a=a?a.target:K;if(g&&h&&(a===K||a===C)){if(g!==b.containerWidth||h!==b.containerHeight)clearTimeout(e),b.reflowTimeout=e=setTimeout(function(){b.container&&b.resize(g,h,!1)},100);b.containerWidth=g;b.containerHeight=
h}}var b=this,c=b.options.chart,d=b.renderTo,e;I(K,"resize",a);I(b,"destroy",function(){S(K,"resize",a)})},resize:function(a,b,c){var d=this,e,f,g=d.resetZoomButton,h=d.title,i=d.subtitle,j;d.isResizing+=1;j=function(){d&&E(d,"endResize",null,function(){d.isResizing-=1})};ua(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(t(a))d.chartWidth=e=s(a);if(t(b))d.chartHeight=f=s(b);H(d.container,{width:e+"px",height:f+"px"});d.renderer.setSize(e,f,c);d.plotWidth=e-d.plotLeft-d.marginRight;
d.plotHeight=f-d.plotTop-d.marginBottom;d.maxTicks=null;n(d.axes,function(a){a.isDirty=!0;a.setScale()});n(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.getMargins();a=d.spacingBox;h&&h.align(null,null,a);i&&i.align(null,null,a);g&&g.align&&g.align(null,null,d[g.alignTo]);d.redraw(c);d.oldChartHeight=null;E(d,"resize");Oa===!1?j():setTimeout(j,Oa&&Oa.duration||500)},setChartSize:function(){var a=this.inverted,b=this.chartWidth,c=this.chartHeight,d=this.options.chart,e=d.spacingTop,
f=d.spacingRight,g=d.spacingBottom,h=d.spacingLeft,i,j,k,l;this.plotLeft=i=s(this.plotLeft);this.plotTop=j=s(this.plotTop);this.plotWidth=k=s(b-i-this.marginRight);this.plotHeight=l=s(c-j-this.marginBottom);this.plotSizeX=a?l:k;this.plotSizeY=a?k:l;this.plotBorderWidth=a=d.plotBorderWidth||0;this.spacingBox={x:h,y:e,width:b-h-f,height:c-e-g};this.plotBox={x:i,y:j,width:k,height:l};this.clipBox={x:a/2,y:a/2,width:this.plotSizeX-a,height:this.plotSizeY-a};n(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},
resetMargins:function(){var a=this.options.chart,b=a.spacingRight,c=a.spacingBottom,d=a.spacingLeft;this.plotTop=o(this.optionsMarginTop,a.spacingTop);this.marginRight=o(this.optionsMarginRight,b);this.marginBottom=o(this.optionsMarginBottom,c);this.plotLeft=o(this.optionsMarginLeft,d);this.axisOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||
0,j=a.backgroundColor,k=a.plotBackgroundColor,l=a.plotBackgroundImage,m=a.plotBorderWidth||0,p,o=this.plotLeft,n=this.plotTop,q=this.plotWidth,r=this.plotHeight,t=this.plotBox,s=this.clipRect,v=this.clipBox;p=i+(a.shadow?8:0);if(i||j)if(e)e.animate(e.crisp(null,null,null,c-p,d-p));else{e={fill:j||R};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(p/2,p/2,c-p,d-p,a.borderRadius,i).attr(e).add().shadow(a.shadow)}if(k)f?f.animate(t):this.plotBackground=b.rect(o,n,q,r,0).attr({fill:k}).add().shadow(a.plotShadow);
if(l)h?h.animate(t):this.plotBGImage=b.image(l,o,n,q,r).add();s?s.animate({width:v.width,height:v.height}):this.clipRect=b.clipRect(v);if(m)g?g.animate(g.crisp(null,o,n,q,r)):this.plotBorder=b.rect(o,n,q,r,0,m).attr({stroke:a.plotBorderColor,"stroke-width":m,zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;n(["inverted","angular","polar"],function(g){c=$[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];for(e=d&&d.length;!f&&
e--;)(c=$[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},render:function(){var a=this,b=a.axes,c=a.renderer,d=a.options,e=d.labels,d=d.credits,f;a.setTitle();a.legend=new rb(a);n(b,function(a){a.setScale()});a.getMargins();a.maxTicks=null;n(b,function(a){a.setTickPositions(!0);a.setMaxTicks()});a.adjustTickAmounts();a.getMargins();a.drawChartBox();a.hasCartesianSeries&&n(b,function(a){a.render()});if(!a.seriesGroup)a.seriesGroup=c.g("series-group").attr({zIndex:3}).add();n(a.series,function(a){a.translate();
a.setTooltipPoints();a.render()});e.items&&n(e.items,function(b){var d=r(e.style,b.style),f=w(d.left)+a.plotLeft,j=w(d.top)+a.plotTop+12;delete d.left;delete d.top;c.text(b.html,f,j).attr({zIndex:2}).css(d).add()});if(d.enabled&&!a.credits)f=d.href,a.credits=c.text(d.text,0,0).on("click",function(){if(f)location.href=f}).attr({align:d.position.align,zIndex:8}).css(d.style).add().align(d.position);a.hasRendered=!0},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;
E(a,"destroy");S(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,tracker,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",S(d),f&&Na(d);for(e in a)delete a[e]},firstRender:function(){var a=this,b=a.options,c=a.callback;if(!Z&&K==K.top&&C.readyState!=="complete"||
U&&!K.canvg)U?Mb.push(function(){a.firstRender()},b.global.canvasToolsURL):C.attachEvent("onreadystatechange",function(){C.detachEvent("onreadystatechange",a.firstRender);C.readyState==="complete"&&a.firstRender()});else{a.getContainer();E(a,"init");if(Highcharts.RangeSelector&&b.rangeSelector.enabled)a.rangeSelector=new Highcharts.RangeSelector(a);a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();n(b.series||[],function(b){a.initSeries(b)});if(Highcharts.Scroller&&(b.navigator.enabled||
b.scrollbar.enabled))a.scroller=new Highcharts.Scroller(a);a.tracker=new qb(a,b);a.render();a.renderer.draw();c&&c.apply(a,[a]);n(a.callbacks,function(b){b.apply(a,[a])});a.cloneRenderTo(!0);E(a,"load")}},init:function(a){var b=this.options.chart,c;b.reflow!==!1&&I(this,"load",this.initReflow);if(a)for(c in a)I(this,c,a[c]);this.xAxis=[];this.yAxis=[];this.animation=U?!1:o(b.animation,!0);this.setSize=this.resize;this.pointCount=0;this.counters=new Eb;this.firstRender()}};sb.prototype.callbacks=[];
var Ta=function(){};Ta.prototype={init:function(a,b,c){var d=a.chart.counters;this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint)b=a.chart.options.colors,this.color=this.color||b[d.color++],d.wrapColor(b.length);a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=typeof a;this.config=a;if(d==="number"||a===null)this.y=a;else if(typeof a[0]==="number")this.x=a[0],this.y=a[1];else if(d==="object"&&typeof a.length!=="number"){r(this,a);this.options=
a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}else if(typeof a[0]==="string")this.name=a[0],this.y=a[1];if(this.x===x)this.x=b===x?c.autoIncrement():b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;if(b&&(this.setState(),Ba(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)S(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a=
"graphic,tracker,dataLabel,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},select:function(a,b){var c=this,d=c.series.chart,a=o(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=a;c.setState(a&&"select");b||n(d.getSelectedPoints(),function(a){if(a.selected&&
a!==c)a.selected=!1,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(){var a=this.series,b=a.chart,c=b.tooltip,d=b.hoverPoint;if(d&&d!==this)d.onMouseOut();this.firePointEvent("mouseOver");c&&(!c.shared||a.noSharedTooltip)&&c.refresh(this);this.setState("hover");b.hoverPoint=this},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;if(!b||Rb(this,b)===-1)this.firePointEvent("mouseOut"),this.setState(),a.hoverPoint=null},tooltipFormatter:function(a){var b=this.series,
c=b.tooltipOptions,d=a.match(/\{(series|point)\.[a-zA-Z]+\}/g),e=/[{\.}]/,f,g,h,i,j={y:0,open:0,high:0,low:0,close:0,percentage:1,total:1};c.valuePrefix=c.valuePrefix||c.yPrefix;c.valueDecimals=c.valueDecimals||c.yDecimals;c.valueSuffix=c.valueSuffix||c.ySuffix;for(i in d)g=d[i],la(g)&&g!==a&&(h=(" "+g).split(e),f={point:this,series:b}[h[1]],h=h[2],f===this&&j.hasOwnProperty(h)?(f=j[h]?h:"value",f=(c[f+"Prefix"]||"")+Ia(this[h],o(c[f+"Decimals"],-1))+(c[f+"Suffix"]||"")):f=f[h],a=a.replace(g,f));
return a},update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,i=h.length,j=e.chart,b=o(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);X(a)&&(e.getAttribs(),f&&f.attr(d.pointAttr[e.state]));for(g=0;g<i;g++)if(h[g]===d){e.xData[g]=d.x;e.yData[g]=d.y;e.options.data[g]=a;break}e.isDirty=!0;e.isDirtyData=!0;b&&j.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.chart,f,g=d.data,h=g.length;ua(b,e);a=o(a,!0);c.firePointEvent("remove",null,function(){for(f=
0;f<h;f++)if(g[f]===c){g.splice(f,1);d.options.data.splice(f,1);d.xData.splice(f,1);d.yData.splice(f,1);break}c.destroy();d.isDirty=!0;d.isDirtyData=!0;a&&e.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});E(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=A(this.series.options.point,
this.options).events,b;this.events=a;for(b in a)I(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a){var b=this.plotX,c=this.plotY,d=this.series,e=d.options.states,f=W[d.type].marker&&d.options.marker,g=f&&!f.enabled,h=f&&f.states[a],i=h&&h.enabled===!1,j=d.stateMarkerGraphic,k=d.chart,l=this.pointAttr,a=a||"";if(!(a===this.state||this.selected&&a!=="select"||e[a]&&e[a].enabled===!1||a&&(i||g&&!h.enabled))){if(this.graphic)e=f&&this.graphic.symbolName&&l[a].r,this.graphic.attr(A(l[a],e?
{x:b-e,y:c-e,width:2*e,height:2*e}:{}));else{if(a&&h)e=h.radius,j?j.attr({x:b-e,y:c-e}):d.stateMarkerGraphic=j=k.renderer.symbol(d.symbol,b-e,c-e,2*e,2*e).attr(l[a]).add(d.markerGroup);if(j)j[a&&k.isInsidePlot(b,c)?"show":"hide"]()}this.state=a}}};var N=function(){};N.prototype={isCartesian:!0,type:"line",pointClass:Ta,sorted:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(a,b){var c,d;this.chart=a;this.options=b=this.setOptions(b);this.bindAxes();
r(this,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(U)b.animation=!1;d=b.events;for(c in d)I(this,c,d[c]);if(d&&d.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;this.getColor();this.getSymbol();this.setData(b.data,!1);if(this.isCartesian)a.hasCartesianSeries=!0;a.series.push(this);Fb(a.series,function(a,b){return(a.options.index||0)-(b.options.index||0)});n(a.series,function(a,b){a.index=b;a.name=a.name||"Series "+
(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;a.isCartesian&&n(["xAxis","yAxis"],function(e){n(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]===x&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0})})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=o(b,a.pointStart,0);this.pointInterval=o(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=
e;c--;)d[c].y===null&&d.splice(c,1);d.length&&(b=[d])}else n(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart.options,c=b.plotOptions,d=c[this.type],e=a.data;a.data=null;c=A(d,c.series,a);c.data=a.data=e;this.tooltipOptions=A(b.tooltip,c.tooltip);d.marker===null&&delete c.marker;return c},getColor:function(){var a=this.options,b=this.chart.options.colors,c=this.chart.counters;this.color=a.color||
!a.colorByPoint&&b[c.color++]||"gray";c.wrapColor(b.length)},getSymbol:function(){var a=this.options.marker,b=this.chart,c=b.options.symbols,b=b.counters;this.symbol=a.symbol||c[b.symbol++];if(/^url/.test(this.symbol))a.radius=0;b.wrapSymbol(c.length)},drawLegendSymbol:function(a){var b=this.options,c=b.marker,d=a.options.symbolWidth,e=this.chart.renderer,f=this.legendGroup,a=a.baseline,g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=e.path(["M",
0,a-4,"L",d,a-4]).attr(g).add(f)}if(c&&c.enabled)b=c.radius,this.legendSymbol=e.symbol(this.symbol,d/2-b,a-4-b,2*b,2*b).add(f)},addPoint:function(a,b,c,d){var e=this.data,f=this.graph,g=this.area,h=this.chart,i=this.xData,j=this.yData,k=f&&f.shift||0,l=this.options.data,m=this.pointClass.prototype;ua(d,h);if(f&&c)f.shift=k+1;if(g){if(c)g.shift=k+1;g.isArea=!0}b=o(b,!0);d={series:this};m.applyOptions.apply(d,[a]);i.push(d.x);j.push(m.toYData?m.toYData.call(d):d.y);l.push(a);c&&(e[0]&&e[0].remove?e[0].remove(!1):
(e.shift(),i.shift(),j.shift(),l.shift()));this.getAttribs();this.isDirtyData=this.isDirty=!0;b&&h.redraw()},setData:function(a,b){var c=this.points,d=this.options,e=this.initialColor,f=this.chart,g=null,h=this.xAxis,i,j=this.pointClass.prototype;this.xIncrement=null;this.pointRange=h&&h.categories?1:d.pointRange;if(t(e))f.counters.color=e;var e=[],k=[],l=a?a.length:[],m=(i=this.pointArrayMap)&&i.length;if(l>(d.turboThreshold||1E3)){for(i=0;g===null&&i<l;)g=a[i],i++;if(Aa(g)){j=o(d.pointStart,0);
d=o(d.pointInterval,1);for(i=0;i<l;i++)e[i]=j,k[i]=a[i],j+=d;this.xIncrement=j}else if(Ha(g))if(m)for(i=0;i<l;i++)d=a[i],e[i]=d[0],k[i]=d.slice(1,m+1);else for(i=0;i<l;i++)d=a[i],e[i]=d[0],k[i]=d[1]}else for(i=0;i<l;i++)d={series:this},j.applyOptions.apply(d,[a[i]]),e[i]=d.x,k[i]=j.toYData?j.toYData.call(d):d.y;la(k[0])&&$a(14,!0);this.data=[];this.options.data=a;this.xData=e;this.yData=k;for(i=c&&c.length||0;i--;)c[i]&&c[i].destroy&&c[i].destroy();if(h)h.minRange=h.userMinRange;this.isDirty=this.isDirtyData=
f.isDirtyBox=!0;o(b,!0)&&f.redraw(!1)},remove:function(a,b){var c=this,d=c.chart,a=o(a,!0);if(!c.isRemoving)c.isRemoving=!0,E(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;a&&d.redraw(b)});c.isRemoving=!1},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e=0,f=d,g,h,i=this.xAxis,j=this.options,k=j.cropThreshold,l=this.isCartesian;if(l&&!this.isDirty&&!i.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(l&&this.sorted&&(!k||d>k||this.forceCrop))if(a=i.getExtremes(),
i=a.min,k=a.max,b[d-1]<i||b[0]>k)b=[],c=[];else if(b[0]<i||b[d-1]>k){for(a=0;a<d;a++)if(b[a]>=i){e=y(0,a-1);break}for(;a<d;a++)if(b[a]>k){f=a+1;break}b=b.slice(e,f);c=c.slice(e,f);g=!0}for(a=b.length-1;a>0;a--)if(d=b[a]-b[a-1],d>0&&(h===x||d<h))h=d;this.cropped=g;this.cropStart=e;this.processedXData=b;this.processedYData=c;if(j.pointRange===null)this.pointRange=h||1;this.closestPointRange=h},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,
f=this.pointClass,g=d.length,h=this.cropStart||0,i,j=this.hasGroupedData,k,l=[],m;if(!b&&!j)b=[],b.length=a.length,b=this.data=b;for(m=0;m<g;m++)i=h+m,j?l[m]=(new f).init(this,[d[m]].concat(na(e[m]))):(b[i]?k=b[i]:a[i]!==x&&(b[i]=k=(new f).init(this,a[i],d[m])),l[m]=k);if(b&&(g!==(c=b.length)||j))for(m=0;m<c;m++)if(m===h&&!j&&(m+=g),b[m])b[m].destroyElements(),b[m].plotX=x;this.data=b;this.points=l},translate:function(){this.processedXData||this.processData();this.generatePoints();for(var a=this.chart,
b=this.options,c=b.stacking,d=this.xAxis,e=d.categories,f=this.yAxis,g=this.points,h=g.length,i=!!this.modifyValue,j,k=f.series,l=k.length,m=b.pointPlacement==="between";l--;)if(k[l].visible){k[l]===this&&(j=!0);break}for(l=0;l<h;l++){var k=g[l],p=k.x,n=k.y,r=k.low,q=f.stacks[(n<b.threshold?"-":"")+this.stackKey];k.plotX=d.translate(p,0,0,0,1,m);if(c&&this.visible&&q&&q[p])r=q[p],p=r.total,r.cum=r=r.cum-n,n=r+n,j&&(r=o(b.threshold,f.min)),f.isLog&&r<=0&&(r=null),c==="percent"&&(r=p?r*100/p:0,n=p?
n*100/p:0),k.percentage=p?k.y*100/p:0,k.total=k.stackTotal=p,k.stackY=n;k.yBottom=t(r)?f.translate(r,0,1,0,1):null;i&&(n=this.modifyValue(n,k));k.plotY=typeof n==="number"?s(f.translate(n,0,1,0,1)*10)/10:x;k.clientX=a.inverted?a.plotHeight-k.plotX:k.plotX;k.category=e&&e[k.x]!==x?e[k.x]:k.x}this.getSegments()},setTooltipPoints:function(a){var b=[],c,d,e=(c=this.xAxis)?c.tooltipLen||c.len:this.chart.plotSizeX,f=c&&c.tooltipPosName||"plotX",g,h,i=[];if(this.options.enableMouseTracking!==!1){if(a)this.tooltipPoints=
null;n(this.segments||this.points,function(a){b=b.concat(a)});c&&c.reversed&&(b=b.reverse());a=b.length;for(h=0;h<a;h++){g=b[h];c=b[h-1]?d+1:0;for(d=b[h+1]?y(0,T((g[f]+(b[h+1]?b[h+1][f]:e))/2)):e;c>=0&&c<=d;)i[c++]=g}this.tooltipPoints=i}},tooltipHeaderFormatter:function(a){var b=this.tooltipOptions,c=b.xDateFormat,d=this.xAxis,e=d&&d.options.type==="datetime",f;if(e&&!c)for(f in B)if(B[f]>=d.closestPointRange){c=b.dateTimeLabelFormats[f];break}return b.headerFormat.replace("{point.key}",e&&Aa(a)?
cb(c,a):a).replace("{series.name}",this.name).replace("{series.color}",this.color)},onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&E(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;if(d)d.onMouseOut();this&&a.events.mouseOut&&E(this,"mouseOut");c&&!a.stickyTracking&&!c.shared&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=
this,c=b.chart,d=c.renderer,e;e=b.options.animation;var f=c.clipBox,g=c.inverted,h;if(e&&!X(e))e=W[b.type].animation;h="_sharedClip"+e.duration+e.easing;if(a)a=c[h],e=c[h+"m"],a||(c[h]=a=d.clipRect(r(f,{width:0})),c[h+"m"]=e=d.clipRect(-99,g?-c.plotLeft:-c.plotTop,99,g?c.chartWidth:c.chartHeight)),b.group.clip(a),b.markerGroup.clip(e),b.sharedClipKey=h;else{if(a=c[h])a.animate({width:c.plotSizeX},e),c[h+"m"].animate({width:c.plotSizeX+99},e);b.animate=null;b.animationTimeout=setTimeout(function(){b.afterAnimate()},
e.duration)}},afterAnimate:function(){var a=this.chart,b=this.sharedClipKey,c=this.group;c&&this.options.clip!==!1&&(c.clip(a.clipRect),this.markerGroup.clip());setTimeout(function(){b&&a[b]&&(a[b]=a[b].destroy(),a[b+"m"]=a[b+"m"].destroy())},100)},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,j,k,l=this.options.marker,m,p=this.markerGroup;if(l.enabled||this._hasPointMarkers)for(f=b.length;f--;)if(g=b[f],d=g.plotX,e=g.plotY,k=g.graphic,i=g.marker||{},a=l.enabled&&i.enabled===
x||i.enabled,m=c.isInsidePlot(d,e,c.inverted),a&&e!==x&&!isNaN(e))if(a=g.pointAttr[g.selected?"select":""],h=a.r,i=o(i.symbol,this.symbol),j=i.indexOf("url")===0,k)k.attr({visibility:m?Z?"inherit":"visible":"hidden"}).animate(r({x:d-h,y:e-h},k.symbolName?{width:2*h,height:2*h}:{}));else{if(m&&(h>0||j))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(p)}else if(k)g.graphic=k.destroy()},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};
for(f in e)g=e[f],h[f]=o(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=W[a.type].marker?a.options.marker:a.options,c=b.states,d=c.hover,e,f=a.color,g={stroke:f,fill:f},h=a.points||[],i=[],j,k=a.pointAttrToOptions,l;a.options.marker?(d.radius=d.radius||b.radius+2,d.lineWidth=d.lineWidth||b.lineWidth+1):d.color=d.color||qa(d.color||f).brighten(d.brightness).get();i[""]=a.convertAttribs(b,g);n(["hover","select"],function(b){i[b]=a.convertAttribs(c[b],i[""])});a.pointAttr=i;for(f=
h.length;f--;){g=h[f];if((b=g.options&&g.options.marker||g.options)&&b.enabled===!1)b.radius=0;e=a.options.colorByPoint;if(g.options)for(l in k)t(b[k[l]])&&(e=!0);if(e){b=b||{};j=[];c=b.states||{};e=c.hover=c.hover||{};if(!a.options.marker)e.color=qa(e.color||g.color).brighten(e.brightness||d.brightness).get();j[""]=a.convertAttribs(r({color:g.color},b),i[""]);j.hover=a.convertAttribs(c.hover,i.hover,j[""]);j.select=a.convertAttribs(c.select,i.select,j[""])}else j=i;g.pointAttr=j}},destroy:function(){var a=
this,b=a.chart,c=/AppleWebKit\/533/.test(Fa),d,e,f=a.data||[],g,h,i;E(a,"destroy");S(a);n(["xAxis","yAxis"],function(b){if(i=a[b])Ba(i.series,a),i.isDirty=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(e=f.length;e--;)(g=f[e])&&g.destroy&&g.destroy();a.points=null;clearTimeout(a.animationTimeout);n("area,graph,dataLabelsGroup,group,markerGroup,tracker,trackerGroup".split(","),function(b){a[b]&&(d=c&&b==="group"?"hide":"destroy",a[b][d]())});if(b.hoverSeries===a)b.hoverSeries=null;Ba(b.series,
a);for(h in a)delete a[h]},drawDataLabels:function(){var a=this,b=a.options.dataLabels,c=a.points,d,e,f,g;if(b.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(b),g=a.plotGroup("dataLabelsGroup","data-labels",a.visible?"visible":"hidden",6),e=b,n(c,function(c){var i,j=c.dataLabel,k,l=!0;d=c.options&&c.options.dataLabels;i=e.enabled||d&&d.enabled;if(j&&!i)c.dataLabel=j.destroy();else if(i){i=b.rotation;b=A(e,d);f=b.formatter.call(c.getLabelConfig(),b);b.style.color=o(b.color,b.style.color,
a.color,"black");if(j)j.attr({text:f}),l=!1;else if(t(f)){j={fill:b.backgroundColor,stroke:b.borderColor,"stroke-width":b.borderWidth,r:b.borderRadius||0,rotation:i,padding:b.padding,zIndex:1};for(k in j)j[k]===x&&delete j[k];j=c.dataLabel=a.chart.renderer[i?"text":"label"](f,0,-999,null,null,null,b.useHTML).attr(j).css(b.style).add(g).shadow(b.shadow)}j&&a.alignDataLabel(c,j,b,null,l)}})},alignDataLabel:function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=o(a.plotX,-999),a=o(a.plotY,-999),i=b.getBBox(),
d=r({x:g?f.plotWidth-a:h,y:s(g?f.plotHeight-h:a),width:0,height:0},d);r(c,{width:i.width,height:i.height});c.rotation?(d={align:c.align,x:d.x+c.x+d.width/2,y:d.y+c.y+d.height/2},b[e?"attr":"animate"](d)):(b.align(c,null,d),d=b.alignAttr);b.attr({visibility:c.crop===!1||f.isInsidePlot(d.x,d.y)||f.isInsidePlot(h,a,g)?Z?"inherit":"visible":"hidden"})},getSegmentPath:function(a){var b=this,c=[];n(a,function(d,e){b.getPointSpline?c.push.apply(c,b.getPointSpline(a,d,e)):(c.push(e?"L":"M"),e&&b.options.step&&
c.push(d.plotX,a[e-1].plotY),c.push(d.plotX,d.plotY))});return c},getGraphPath:function(){var a=this,b=[],c,d=[];n(a.segments,function(e){c=a.getSegmentPath(e);e.length>1?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this.options,b=this.graph,c=this.group,d=a.lineColor||this.color,e=a.lineWidth,f=a.dashStyle,g=this.getGraphPath();if(b)eb(b),b.animate({d:g});else if(e){b={stroke:d,"stroke-width":e,zIndex:1};if(f)b.dashstyle=f;this.graph=this.chart.renderer.path(g).attr(b).add(c).shadow(a.shadow)}},
invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};n(["group","trackerGroup","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;I(c,"resize",a);I(b,"destroy",function(){S(c,"resize",a)});a();b.invertGroups=a},plotGroup:function(a,b,c,d,e){var f=this[a],g=this.chart,h=this.xAxis,i=this.yAxis;f||(this[a]=f=g.renderer.g(b).attr({visibility:c,zIndex:d||0.1}).add(e));f.translate(h?h.left:g.plotLeft,i?i.top:g.plotTop);return f},render:function(){var a=
this.chart,b,c=this.options,d=c.animation&&!!this.animate,e=this.visible?"visible":"hidden",f=c.zIndex,g=this.hasRendered,h=a.seriesGroup;b=this.plotGroup("group","series",e,f,h);this.markerGroup=this.plotGroup("markerGroup","markers",e,f,h);d&&this.animate(!0);this.getAttribs();b.inverted=a.inverted;this.drawGraph&&this.drawGraph();this.drawPoints();this.drawDataLabels();this.options.enableMouseTracking!==!1&&this.drawTracker();a.inverted&&this.invertGroups();c.clip!==!1&&!this.sharedClipKey&&!g&&
(b.clip(a.clipRect),this.trackerGroup&&this.trackerGroup.clip(a.clipRect));d?this.animate():g||this.afterAnimate();this.isDirty=this.isDirtyData=!1;this.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:this.xAxis.left,translateY:this.yAxis.top}));this.translate();this.setTooltipPoints(!0);this.render();b&&E(this,"updatedData")},setState:function(a){var b=this.options,c=this.graph,
d=b.states,b=b.lineWidth,a=a||"";if(this.state!==a)this.state=a,d[a]&&d[a].enabled===!1||(a&&(b=d[a].lineWidth||b+1),c&&!c.dashstyle&&c.attr({"stroke-width":b},a?0:500))},setVisible:function(a,b){var c=this.chart,d=this.legendItem,e=this.group,f=this.tracker,g=this.dataLabelsGroup,h=this.markerGroup,i,j=this.points,k=c.options.chart.ignoreHiddenSeries;i=this.visible;i=(this.visible=a=a===x?!i:a)?"show":"hide";if(e)e[i]();if(h)h[i]();if(f)f[i]();else if(j)for(e=j.length;e--;)if(f=j[e],f.tracker)f.tracker[i]();
if(g)g[i]();d&&c.legend.colorizeItem(this,a);this.isDirty=!0;this.options.stacking&&n(c.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});if(k)c.isDirtyBox=!0;b!==!1&&c.redraw();E(this,i)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===x?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;E(this,a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:a.graphPath),
e=d.length,f=a.chart,g=f.renderer,h=f.options.tooltip.snap,i=a.tracker,j=b.cursor,j=j&&{cursor:j},k=a.singlePoints,l=this.isCartesian&&this.plotGroup("trackerGroup",null,"visible",b.zIndex||1,f.trackerGroup),m;if(e&&!c)for(m=e+1;m--;)d[m]==="M"&&d.splice(m+1,0,d[m+1]-h,d[m+2],"L"),(m&&d[m]==="M"||m===e)&&d.splice(m,0,"L",d[m-2]+h,d[m-1]);for(m=0;m<k.length;m++)e=k[m],d.push("M",e.plotX-h,e.plotY,"L",e.plotX+h,e.plotY);i?i.attr({d:d}):a.tracker=g.path(d).attr({isTracker:!0,"stroke-linejoin":"bevel",
visibility:a.visible?"visible":"hidden",stroke:wb,fill:c?wb:R,"stroke-width":b.lineWidth+(c?0:2*h)}).on(fa?"touchstart":"mouseover",function(){if(f.hoverSeries!==a)a.onMouseOver()}).on("mouseout",function(){if(!b.stickyTracking)a.onMouseOut()}).css(j).add(l)}};G=ca(N);$.line=G;W.area=A(ga,{threshold:0});G=ca(N,{type:"area",getSegmentPath:function(a){var b=N.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;b.length===3&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=
a.length-1;d>=0;d--)d<a.length-1&&e.step&&c.push(a[d+1].plotX,a[d].yBottom),c.push(a[d].plotX,a[d].yBottom);else this.closeSegment(c,a);this.areaPath=this.areaPath.concat(c);return b},closeSegment:function(a,b){var c=this.yAxis.getThreshold(this.options.threshold);a.push("L",b[b.length-1].plotX,c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];N.prototype.drawGraph.apply(this);var a=this.areaPath,b=this.options,c=this.area;c?c.animate({d:a}):this.area=this.chart.renderer.path(a).attr({fill:o(b.fillColor,
qa(this.color).setOpacity(b.fillOpacity||0.75).get()),zIndex:0}).add(this.group)},drawLegendSymbol:function(a,b){b.legendSymbol=this.chart.renderer.rect(0,a.baseline-11,a.options.symbolWidth,12,2).attr({zIndex:3}).add(b.legendGroup)}});$.area=G;W.spline=A(ga);ha=ca(N,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,j,k;if(f&&g){a=f.plotY;j=g.plotX;var g=g.plotY,l;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;j=(1.5*d+j)/2.5;k=(1.5*e+g)/2.5;l=(k-i)*(j-d)/(j-h)+e-
k;i+=l;k+=l;i>a&&i>e?(i=y(a,e),k=2*e-i):i<a&&i<e&&(i=O(a,e),k=2*e-i);k>g&&k>e?(k=y(g,e),i=2*e-k):k<g&&k<e&&(k=O(g,e),i=2*e-k);b.rightContX=j;b.rightContY=k}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e],f.rightContX=f.rightContY=null):b=["M",d,e];return b}});$.spline=ha;W.areaspline=A(W.area);var za=G.prototype,ha=ca(ha,{type:"areaspline",closedStacks:!0,getSegmentPath:za.getSegmentPath,closeSegment:za.closeSegment,drawGraph:za.drawGraph});$.areaspline=ha;W.column=A(ga,{borderColor:"#FFFFFF",
borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},threshold:0});ha=ca(N,{type:"column",tooltipOutsidePlot:!0,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){N.prototype.init.apply(this,arguments);var a=this,b=
a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},translate:function(){var a=this,b=a.chart,c=a.options,d=c.stacking,e=c.borderWidth,f=0,g=a.xAxis,h=g.reversed,i={},j,k;N.prototype.translate.apply(a);c.grouping===!1?f=1:n(b.series,function(b){var c=b.options;if(b.type===a.type&&b.visible&&a.options.group===c.group)c.stacking?(j=b.stackKey,i[j]===x&&(i[j]=f++),k=i[j]):c.grouping!==!1&&(k=f++),b.columnIndex=k});var l=a.points,g=L(g.transA)*(g.ordinalSlope||c.pointRange||
g.closestPointRange||1),m=g*c.groupPadding,p=(g-2*m)/f,u=c.pointWidth,r=t(u)?(p-u)/2:p*c.pointPadding,q=o(u,p-2*r),s=wa(y(q,1+2*e)),w=r+(m+((h?f-a.columnIndex:a.columnIndex)||0)*p-g/2)*(h?-1:1),z=a.translatedThreshold=a.yAxis.getThreshold(c.threshold),v=o(c.minPointLength,5);n(l,function(c){var f=c.plotY,g=o(c.yBottom,z),h=c.plotX+w,i=wa(O(f,g)),j=wa(y(f,g)-i),k=a.yAxis.stacks[(c.y<0?"-":"")+a.stackKey];d&&a.visible&&k&&k[c.x]&&k[c.x].setOffset(w,s);L(j)<v&&v&&(j=v,i=L(i-z)>v?g-v:z-(f<=z?v:0));c.barX=
h;c.pointWidth=q;c.shapeType="rect";c.shapeArgs=f=b.renderer.Element.prototype.crisp.call(0,e,h,i,s,j);e%2&&(f.y-=1,f.height+=1);c.trackerArgs=L(j)<3&&A(c.shapeArgs,{height:6,y:i-3})})},getSymbol:ya,drawLegendSymbol:G.prototype.drawLegendSymbol,drawGraph:ya,drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d;n(a.points,function(e){var f=e.plotY,g=e.graphic;if(f!==x&&!isNaN(f)&&e.y!==null)d=e.shapeArgs,g?(eb(g),g.animate(A(d))):e.graphic=c[e.shapeType](d).attr(e.pointAttr[e.selected?
"select":""]).add(a.group).shadow(b.shadow,null,b.stacking&&!b.borderRadius);else if(g)e.graphic=g.destroy()})},drawTracker:function(){var a=this,b=a.chart,c=b.renderer,d,e,f=+new Date,g=a.options,h=g.cursor,i=h&&{cursor:h},j=a.isCartesian&&a.plotGroup("trackerGroup",null,"visible",g.zIndex||1,b.trackerGroup),k,l,m;n(a.points,function(h){e=h.tracker;d=h.trackerArgs||h.shapeArgs;l=h.plotY;m=!a.isCartesian||l!==x&&!isNaN(l);delete d.strokeWidth;if(h.y!==null&&m)e?e.attr(d):h.tracker=c[h.shapeType](d).attr({isTracker:f,
fill:wb,visibility:a.visible?"visible":"hidden"}).on(fa?"touchstart":"mouseover",function(c){k=c.relatedTarget||c.fromElement;if(b.hoverSeries!==a&&z(k,"isTracker")!==f)a.onMouseOver();h.onMouseOver()}).on("mouseout",function(b){if(!g.stickyTracking&&(k=b.relatedTarget||b.toElement,z(k,"isTracker")!==f))a.onMouseOut()}).css(i).add(h.group||j)})},alignDataLabel:function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=a.below||a.plotY>(this.translatedThreshold||f.plotSizeY),i=this.options.stacking||c.inside;
if(a.shapeArgs&&(d=A(a.shapeArgs),g&&(d={x:f.plotWidth-d.y-d.height,y:f.plotHeight-d.x-d.width,width:d.height,height:d.width}),!i))g?(d.x+=h?0:d.width,d.width=0):(d.y+=h?d.height:0,d.height=0);c.align=o(c.align,!g||i?"center":h?"right":"left");c.verticalAlign=o(c.verticalAlign,g||i?"middle":h?"top":"bottom");N.prototype.alignDataLabel.call(this,a,b,c,d,e)},animate:function(a){var b=this,c=b.points,d=b.options;if(!a)n(c,function(a){var c=a.graphic,a=a.shapeArgs,g=b.yAxis,h=d.threshold;c&&(c.attr({height:0,
y:t(h)?g.getThreshold(h):g.translate(g.getExtremes().min,0,1,0,1)}),c.animate({height:a.height,y:a.y},d.animation))}),b.animate=null},remove:function(){var a=this,b=a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0});N.prototype.remove.apply(a,arguments)}});$.column=ha;W.bar=A(W.column);za=ca(ha,{type:"bar",inverted:!0});$.bar=za;W.scatter=A(ga,{lineWidth:0,states:{hover:{lineWidth:0}},tooltip:{headerFormat:'<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});za=ca(N,{type:"scatter",sorted:!1,translate:function(){var a=this;N.prototype.translate.apply(a);n(a.points,function(b){b.shapeType="circle";b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},drawTracker:function(){for(var a=this,b=a.options.cursor,b=b&&{cursor:b},c=a.points,d=c.length,e;d--;)if(e=c[d].graphic)e.element._i=d;a._hasTracking?a._hasTracking=!0:a.markerGroup.attr({isTracker:!0}).on(fa?"touchstart":"mouseover",
function(b){a.onMouseOver();if(b.target._i!==x)c[b.target._i].onMouseOver()}).on("mouseout",function(){if(!a.options.stickyTracking)a.onMouseOut()}).css(b)}});$.scatter=za;W.pie=A(ga,{borderColor:"#FFFFFF",borderWidth:1,center:["50%","50%"],colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.point.name}},legendType:"point",marker:null,size:"75%",showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}}});ya={type:"pie",isCartesian:!1,pointClass:ca(Ta,
{init:function(){Ta.prototype.init.apply(this,arguments);var a=this,b;r(a,{visible:a.visible!==!1,name:o(a.name,"Slice")});b=function(){a.slice()};I(a,"select",b);I(a,"unselect",b);return a},setVisible:function(a){var b=this.series,c=b.chart,d=this.tracker,e=this.dataLabel,f=this.connector,g=this.shadowGroup,h;h=(this.visible=a=a===x?!this.visible:a)?"show":"hide";this.group[h]();if(d)d[h]();if(e)e[h]();if(f)f[h]();if(g)g[h]();this.legendItem&&c.legend.colorizeItem(this,a);if(!b.isDirty&&b.options.ignoreHiddenPoint)b.isDirty=
!0,c.redraw()},slice:function(a,b,c){var d=this.series.chart,e=this.slicedTranslation;ua(c,d);o(b,!0);a=this.sliced=t(a)?a:!this.sliced;a={translateX:a?e[0]:d.plotLeft,translateY:a?e[1]:d.plotTop};this.group.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)}}),pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=this.chart.counters.color},animate:function(){var a=this;n(a.points,function(b){var c=b.graphic,b=b.shapeArgs,d=
-xa/2;c&&(c.attr({r:0,start:d,end:d}),c.animate({r:b.r,start:b.start,end:b.end},a.options.animation))});a.animate=null},setData:function(a,b){N.prototype.setData.call(this,a,!1);this.processData();this.generatePoints();o(b,!0)&&this.chart.redraw()},getCenter:function(){var a=this.options,b=this.chart,c=b.plotWidth,d=b.plotHeight,a=a.center.concat([a.size,a.innerSize||0]),e=O(c,d),f;return Sa(a,function(a,b){return(f=/%$/.test(a))?[c,d,e,e][b]*w(a)/100:a})},translate:function(){this.generatePoints();
var a=0,b=-0.25,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g=this.chart,h,i,j,k=this.points,l=2*xa,m=c.dataLabels.distance,o=c.ignoreHiddenPoint,n,r=k.length,q;this.center=f=this.getCenter();this.getX=function(a,b){j=J.asin((a-f[1])/(f[2]/2+m));return f[0]+(b?-1:1)*V(j)*(f[2]/2+m)};for(n=0;n<r;n++)q=k[n],a+=o&&!q.visible?0:q.y;for(n=0;n<r;n++){q=k[n];c=a?q.y/a:0;h=s(b*l*1E3)/1E3;if(!o||q.visible)b+=c;i=s(b*l*1E3)/1E3;q.shapeType="arc";q.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:h,
end:i};j=(i+h)/2;q.slicedTranslation=Sa([V(j)*d+g.plotLeft,Y(j)*d+g.plotTop],s);h=V(j)*f[2]/2;i=Y(j)*f[2]/2;q.tooltipPos=[f[0]+h*0.7,f[1]+i*0.7];q.labelPos=[f[0]+h+V(j)*m,f[1]+i+Y(j)*m,f[0]+h+V(j)*e,f[1]+i+Y(j)*e,f[0]+h,f[1]+i,m<0?"center":j<l/4?"left":"right",j];q.percentage=c*100;q.total=a}this.setTooltipPoints()},render:function(){this.getAttribs();this.drawPoints();this.options.enableMouseTracking!==!1&&this.drawTracker();this.drawDataLabels();this.options.animation&&this.animate&&this.animate();
this.isDirty=!1},drawPoints:function(){var a=this,b=a.chart,c=b.renderer,d,e,f,g=a.options.shadow,h,i;n(a.points,function(j){e=j.graphic;i=j.shapeArgs;f=j.group;h=j.shadowGroup;if(g&&!h)h=j.shadowGroup=c.g("shadow").attr({zIndex:4}).add();if(!f)f=j.group=c.g("point").attr({zIndex:5}).add();d=j.sliced?j.slicedTranslation:[b.plotLeft,b.plotTop];f.translate(d[0],d[1]);h&&h.translate(d[0],d[1]);e?e.animate(i):j.graphic=e=c.arc(i).setRadialReference(a.center).attr(r(j.pointAttr[""],{"stroke-linejoin":"round"})).add(j.group).shadow(g,
h);j.visible===!1&&j.setVisible(!1)})},drawDataLabels:function(){var a=this.data,b,c=this.chart,d=this.options.dataLabels,e=o(d.connectorPadding,10),f=o(d.connectorWidth,1),g,h,i=o(d.softConnector,!0),j=d.distance,k=this.center,l=k[2]/2,m=k[1],p=j>0,r=[[],[]],s,q,t,w,y=2,v;if(d.enabled||this._hasPointLabels){N.prototype.drawDataLabels.apply(this);n(a,function(a){a.dataLabel&&r[a.labelPos[7]<xa/2?0:1].push(a)});r[1].reverse();w=function(a,b){return b.y-a.y};for(a=r[0][0]&&r[0][0].dataLabel&&(r[0][0].dataLabel.getBBox().height||
21);y--;){var x=[],A=[],z=r[y],C=z.length,B;if(j>0){for(v=m-l-j;v<=m+l+j;v+=a)x.push(v);t=x.length;if(C>t){h=[].concat(z);h.sort(w);for(v=C;v--;)h[v].rank=v;for(v=C;v--;)z[v].rank>=t&&z.splice(v,1);C=z.length}for(v=0;v<C;v++){b=z[v];h=b.labelPos;b=9999;for(q=0;q<t;q++)g=L(x[q]-h[1]),g<b&&(b=g,B=q);if(B<v&&x[v]!==null)B=v;else for(t<C-v+B&&x[v]!==null&&(B=t-C+v);x[B]===null;)B++;A.push({i:B,y:x[B]});x[B]=null}A.sort(w)}for(v=0;v<C;v++){b=z[v];h=b.labelPos;g=b.dataLabel;t=b.visible===!1?"hidden":"visible";
s=h[1];if(j>0){if(q=A.pop(),B=q.i,q=q.y,s>q&&x[B+1]!==null||s<q&&x[B-1]!==null)q=s}else q=s;s=d.justify?k[0]+(y?-1:1)*(l+j):this.getX(B===0||B===x.length-1?s:q,y);g.attr({visibility:t,align:h[6]})[g.moved?"animate":"attr"]({x:s+d.x+({left:e,right:-e}[h[6]]||0),y:q+d.y-10});g.moved=!0;if(p&&f)g=b.connector,h=i?["M",s+(h[6]==="left"?5:-5),q,"C",s,q,2*h[2]-h[4],2*h[3]-h[5],h[2],h[3],"L",h[4],h[5]]:["M",s+(h[6]==="left"?5:-5),q,"L",h[2],h[3],"L",h[4],h[5]],g?(g.animate({d:h}),g.attr("visibility",t)):
b.connector=g=this.chart.renderer.path(h).attr({"stroke-width":f,stroke:d.connectorColor||b.color||"#606060",visibility:t,zIndex:3}).translate(c.plotLeft,c.plotTop).add()}}}},alignDataLabel:ya,drawTracker:ha.prototype.drawTracker,drawLegendSymbol:G.prototype.drawLegendSymbol,getSymbol:function(){}};ya=ca(N,ya);$.pie=ya;r(Highcharts,{Axis:ob,CanVGRenderer:gb,Chart:sb,Color:qa,Legend:rb,MouseTracker:qb,Point:Ta,Tick:Pa,Tooltip:pb,Renderer:Ra,Series:N,SVGRenderer:ra,VMLRenderer:ja,dateFormat:cb,pathAnim:vb,
getOptions:function(){return M},hasBidiBug:Pb,numberFormat:Ia,seriesTypes:$,setOptions:function(a){M=A(M,a);Gb();return M},addEvent:I,removeEvent:S,createElement:Q,discardElement:Na,css:H,each:n,extend:r,map:Sa,merge:A,pick:o,splat:na,extendClass:ca,pInt:w,wrap:function(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}},svg:Z,canvas:U,vml:!Z&&!U,product:"Highcharts",version:"2.3.3"})})();
