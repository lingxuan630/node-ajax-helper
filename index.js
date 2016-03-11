/**
 * http helper
 * you can use http request like jquery ajax
 * 
 */
var request = require('request');
var Q = require('q');
var extend = require('extend');
var utils = require('./lib/utils');

var Ajax = function(options){
	this.defaults = {
		method: 'GET',
		json: true,
		headers : {
			"Content-Type" : 'application/x-www-form-urlencoded'
		},
		data: {}
	}
	return this;
}

Ajax.prototype.setup = function(options){
	this.defaults = extend(this.defaults, options);
}

Ajax.prototype._bulidUrlParam = function(data){
	var params = {};
	var paramStr = null;

	params = this.defaults.data ? extend(params, this.defaults.data) : params;
	params = extend(params, data);
	paramStr = utils.param(data);

	return paramStr;
}

Ajax.prototype.get = function(url, data){
	var options = {
		uri: url,
		method: 'GET'
	}

	var urlParam = this._bulidUrlParam(data);
	if(urlParam){
		if(url.indexOf('?') != '-1'){
			options.uri = url + '&' + urlParam;
		}else{
			options.uri = url + '?' + urlParam;
		}
	}

	return this.request(options);
}

Ajax.prototype.post = function(url, data){
	var options = {
		uri: url,
		method: 'POST',
		data: data,
	}

	return this.request(options);
}

Ajax.prototype.put = function(url, data){
	var options = {
		uri: url,
		method: 'PUT',
		data: data
	}

	return this.request(options);
}

Ajax.prototype.del = function(url, data){
	var options = {
		uri: url,
		method: 'DELETE'
	}

	var urlParam = this._bulidUrlParam(data);
	if(urlParam){
		options.uri = url + '?' + urlParam;
	}

	return this.request(options);
}

	// send request
Ajax.prototype.request = function(options){
	var deferred = Q.defer();
	var $this = this;

	var reqOptions = extend($this.defaults, options);
	if((typeof options.data) != 'undefined' && reqOptions.json === true){
		reqOptions.body = options.data;
	}

	delete reqOptions.data;

	request(
		reqOptions,
		function(error, response, body){
			if(!error && Number(response.statusCode) < 400){
				if(body.statusCode){
					if(body.statusCode < 400){
						deferred.resolve(body, response);
					}else{
						if(!error){
							deferred.reject(body);
						}else{
							deferred.reject(error, response, body);
						}
					}
				}else{
					deferred.resolve(body, response);
				}
			}else{
				deferred.reject(body);
			}
		}
	)
	return deferred.promise; 
}


module.exports = Ajax;