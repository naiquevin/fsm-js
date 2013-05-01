var fsm = function (callbacks) {
    "use strict";

    var isFunction = function (obj) {
        return typeof (obj) === 'function';
    };

    var deepCopy = function (obj) {
        return $.extend(true, {}, obj);
    };

    if (!isFunction(callbacks.init) || !isFunction(callbacks.handleAll)) {
        throw new Error('FSM Error. One or more required callbacks not defined');
    }

    var getFunc = function (name) {
        var fn = callbacks[name];
        if (typeof (fn) !== 'function') {
            throw new Error('Callback "' + name + '" not found');
        }
        return fn;
    };

    return {
        start: function (initArgs) {
            var fn = getFunc('init');
            var result = fn.apply(null, initArgs);

            return {

                _stateName: result[1],

                _state: result[2],

                send: function (msg, data) {
                    var fn = getFunc(this._stateName);
                    var result = fn.apply(null, [msg, data, deepCopy(this._state)]);
                    return this._result(result);
                },
                send_all: function (msg, data) {
                    var fn = getFunc('handleAll');
                    var result = fn.apply(null, [msg, data, this._stateName, deepCopy(this._state)]);
                    return this._result(result);
                },
                _result: function (result) {
                    switch (result[0]) {
                    case 'reply':
                        var reply = result[1];
                        this._stateName = result[2];
                        $.extend(this._state, result[3]);
                        return reply;
                    case 'next_state':
                        this._stateName = result[1];
                        $.extend(this._state, result[2]);
                        return null;
                    default:
                        throw new Error('Invalid reply');
                    }
                }
            };
        }
    };
};
