'use strict';

/**
 * Debug Websocket's Angular module
 * Decorator for provider $websocket
 * Mainly, log message before any onXYZ WebSocket's method
 */
websocketModule
    .constant('CssImage', 'background: url(%url%) 0 0; background-size: contain; font-size: 15px;')
    .constant('GifHeader', 'data:image/gif;base64,R0lGODlhFAAUAPABAAAAAAAAACH/C1hNUCBEYXRhWE1QAz94cAAh+QQFAAABACwAAAAAFAAUA')
    .constant('ImageClose', 'AACNYyPeQCKDANszsxLFZ7VbtZJH9iNWQKOqJhui8tGHibGD82Rr1mZJ6oK8XpBx5BI4Qh/oUMBADs=')
    .constant('ImageConnect', 'AACNIyPacDqx9oLkkbwrq5p3+l9DhZyUFOOkeV1GvueG2ymIlKSmJpmPd/yoW6K2wpkmsiUjgIAOw==')
    .constant('ImageError', 'AACMwx+oauY5gBrkdYVX9bb7o99HSNeU/lMXqaeY7uaKirNdB3euO7EHAuRjYCki6yI8MCUBQA7')
    .constant('ImageMessageReceived', 'AACPwwMecGa1o5bE0U5HaJqV+1hWnU9Iwh9ohmFJXaFKmdm6yu7+Nk1bt3h6FQxW/DhkQFpyybjd+w9iaQnTscoAAA7')
    .constant('ImageMessageSend', 'EACP4yBGJpq22Bs4DA6XZK47sV54laF4aiZF2mhmNSuZARSj/rY2cedsmVSlYSy4U73KcZEuWOw10EBbcImz+ooAAA7')
    .constant('ImageWebSocket', 'EACMoyPqQHd7F5csVZj51LZwr4h2uclHmg64cq2Yae6xxXPMfzY+MfRZUrC1HQ4wKaYkyEKADs=')
    .config(['$provide', function ($provide) {
        $provide.decorator('$websocket',
            ['$delegate', '$log', 'CssImage', 'GifHeader', 'ImageClose', 'ImageConnect', 'ImageError', 'ImageMessageReceived', 'ImageMessageSend',
                function ($delegate, $log, CssImage, GifHeader, ImageClose, ImageConnect, ImageError, ImageMessageReceived, ImageMessageSend) {

                    /**
                     * Keep original method
                     */
                    var connectionOnopen = $delegate.getConnection().onopen,
                        connectionOnclose = $delegate.getConnection().onclose,
                        connectionOnmessage = $delegate.getConnection().onmessage,
                        connectionOnerror = $delegate.getConnection().onerror,
                        connectionToSend = $delegate.getConnection().toSend;

                    /**
                     * Show the current time
                     *
                     * @return string HH:mm:ss
                     */
                    function printTime() {
                        var today = new Date();
                        return today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    }

                    /**
                     * Add log to the onopen
                     */
                    $delegate.getConnection().onopen = function () {
                        $log.log(
                            '%c  %c %s Websocket connected to %s',
                            CssImage.replace('%url%', GifHeader + ImageConnect),
                            '',
                            printTime(),
                            $delegate.path
                        );

                        connectionOnopen.apply(null, arguments);
                    };

                    /**
                     * Add log to the onclose
                     */
                    $delegate.getConnection().onclose = function () {
                        $log.log(
                            '%c  %c %s Websocket closed',
                            CssImage.replace('%url%', GifHeader + ImageClose),
                            '',
                            printTime()
                        );

                        connectionOnclose.apply(null, arguments);
                    };

                    /**
                     * Add log to the onmessage
                     */
                    $delegate.getConnection().onmessage = function () {
                        var args = [].slice.call(arguments);

                        $log.log(
                            '%c  %c %s %o from %s',
                            CssImage.replace('%url%', GifHeader + ImageMessageReceived),
                            '',
                            printTime(),
                            JSON.parse(args[0].data),
                            $delegate.path
                        );

                        connectionOnmessage.apply(null, args);
                    };

                    /**
                     * Add log to the onerror
                     */
                    $delegate.getConnection().onerror = function () {
                        $log.error(
                            '%c  %c %s Websocket error !',
                            CssImage.replace('%url%', GifHeader + ImageError),
                            '',
                            printTime()
                        );

                        connectionOnerror.apply(null, arguments);
                    };

                    /**
                     * Add log on toSend
                     */
                    $delegate.getConnection().toSend = function () {
                        var args = [].slice.call(arguments);

                        $log.log(
                            '%c  %c %s %o to %s',
                            CssImage.replace('%url%', GifHeader + ImageMessageSend),
                            '',
                            printTime(),
                            args[0],
                            $delegate.path
                        );

                        connectionToSend.apply(null, args);
                    };

                    return $delegate;
                }
            ]
        );
    }])
    .run(['$log', 'CssImage', 'GifHeader', 'ImageWebSocket', function ($log, CssImage, GifHeader, ImageWebSocket) {
        /**
         * Show the start message
         */
        $log.log(
            '%c  %c Angular-Websocket',
            CssImage.replace('%url%', GifHeader + ImageWebSocket) + 'font-size: 20px;',
            ''
        );
    }]);
