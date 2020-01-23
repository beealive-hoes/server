
let _socket_handler = [];

/** Handler needs to be a function that takes (key, value) => ... */
function onSocket(handler) {
    if (typeof handler != 'function') console.warn('onSocket(...) was called without providing a handler')
    _socket_handler.push(handler);
}

function initSocket() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var connection = new WebSocket(`ws://${window.location.host}`);
    window.websocket = connection || { send: function() {} };

    connection.onopen = function () {
        console.log("Websocket connected");
    };

    connection.onerror = function (error) {
        console.log(error);
        return null;
    };

    connection.onclose = function (c) {
        app.problem = 'Websocket disconnected!';
    }

    connection.onmessage = function (message) {
        console.log('%c>%c' + message.data.split('=')[0] + '%c=' + message.data.split('=').splice(1).join('='),
            'background: #ffffff22;padding: 2px 5px;margin: 0 5px 0 0;border-radius: 3px;color: orange',
            'background: #ffffff22;padding: 2px 0 2px 5px;margin: 0;border-radius: 3px 0 0 3px;font-weight: 600;color: orange',
            'background: #ffffff22;padding: 2px 5px 2px 0;margin: 0;border-radius: 0 3px 3px 0'
        );

        var mes = message.data;
        var data = '';
        if(mes.includes('=')) {
            mes = mes.split('=')[0];
            data = message.data.substring(mes.length + 1);
        }

        _socket_handler.forEach(h => h(mes, data));
    }
}
initSocket();