'use strict';

/**
 * Websocket's Angular module
 * Provider $websocket
 * Establish a connection to a websocket
 *
 * @event websocket.connected When the connection is ready
 * @event websocket.closed When the connection is closed
 * @event websocket.message When a message occurs
 * @event websocket.{method} When a message occurs
 * @event websocket.error When a error occurs
 * @event websocket.send When a request is send
 */
var websocketModule = angular
    .module('websocket', [])
    .constant('JSONRPC_VERSION', '2.0')
    .provider('$websocket', ['JSONRPC_VERSION',
        function (JSONRPC_VERSION) {
            var _this = this;

            // Websocket path connection
            _this.path = null;

            /**
             * angular's provider $get method
             *
             * @return $websocket The websocket provider
             */
            _this.$get = ['$rootScope', '$q',
                function ($rootScope, $q) {

                    /**
                     * Contain all request sended
                     *
                     * @type Object
                     */
                    _this.requestSended = {};

                    /**
                     * Request identifier
                     *
                     * @type Integer
                     */
                    _this.request_id = 0;

                    /**
                     * Connection to the websocket
                     */
                    var connection = new WebSocket(_this.path);

                    /**
                     * When the connection is ready
                     *
                     * @event websocket.connected
                     */
                    connection.onopen = function (event) {
                        $rootScope.$emit('websocket.connected', event);
                    };

                    /**
                     * When the connection is closed
                     *
                     * @event websocket.closed
                     */
                    connection.onclose = function (event) {
                        $rootScope.$emit('websocket.closed', event);
                    };

                    /**
                     * When a message occurs
                     *
                     * @event websocket.message When a message occurs
                     * @event websocket.{method} When a message occurs
                     */
                    connection.onmessage = function (event) {

                        var data = JSON.parse(event.data);

                        // Message was response if the data contain an id
                        if (_this.requestSended.hasOwnProperty(data.id)) {
                            var defer = _this.requestSended[data.id].defer,
                                callback = (data.error ? defer.reject(data.error) : defer.resolve(data));

                            $rootScope.$apply(callback);
                        }

                        $rootScope.$emit('websocket.' + data.method, data);
                        $rootScope.$emit('websocket.message', data);
                    };

                    /**
                     * When a error occurs
                     *
                     * @event websocket.error When a error occurs
                     */
                    connection.onerror = function (event) {
                        $rootScope.$emit('websocket.error', event);
                    };

                    /**
                     * When a request is send
                     *
                     * @event websocket.send When a request is send
                     */
                    connection.toSend = function (request) {
                        connection.send(JSON.stringify(request));
                        $rootScope.$emit('websocket.send', request);
                    };

                    /**
                     * Get the connection
                     *
                     * @returns {WebSocket}
                     */
                    _this.getConnection = function () {
                        return connection;
                    }

                    /**
                     * Do a request throught the connection
                     *
                     * @param request
                     *
                     * @returns {promise}
                     */
                    _this.request = function (request) {
                        var defer = $q.defer();

                        ++_this.request_id;

                        _this.requestSended[_this.request_id] = {
                            defer  : defer,
                            request: request,
                            time   : new Date()
                        };

                        request.id = _this.request_id;
                        request.jsonrpc = JSONRPC_VERSION;

                        connection.toSend(request);

                        return defer.promise;
                    };

                    /**
                     * Close the connection to the WebSocket
                     */
                    _this.close = function () {
                        connection.close();
                    };

                    return _this;
                }
            ];
        }
    ]);
