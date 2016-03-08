/**
 * utils
 */
var r20 = /%20/g;
var utils = {
	buildParams : function(prefix, obj, traditional, add ){
		var name;
		var $this = this;
		if ( _.isArray( obj ) ) {
			// Serialize array item.
			_.each( obj, function( v , i) {
				if ( traditional || rbracket.test( prefix ) ) {
					// Treat each array item as a scalar.
					add( prefix, v );

				} else {
					// Item is non-scalar (array or object), encode its numeric index.
					$this.buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				}
			});

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
			// Serialize object item.
			for ( name in obj ) {
				$this.buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	},

	param : function(a, traditional ){
		var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = _.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = true;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( _.isArray( a ) || ( !_.isObject( a ) ) ) {
			// Serialize the form elements
			_.each( a, function(item, index) {
				add( index, item );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				this.buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
};

module.exports = utils;