var fsm = {
    
    start: function (callbacks, initArgs) {

        var result = callbacks.init.apply(null, initArgs);
        var _stateName = result[1];
        var _state = result[2];

        return {
            _stateName: _stateName,
            _state: _state,
            send: function (msg, data) {
                var fn = callbacks[this._stateName]
                var result = fn.apply(null, [msg, data, this._state]);
                if (result[0] === 'reply') {
                    var reply = result[1];
                    this._stateName = result[2];
                    _.extend(this._state, result[3]);
                    return reply;
                } else if (result[0] === 'next_state') {
                    this._stateName = result[1];
                    _.extend(this._state, result[2]);
                    return null;
                }
            }
        }
    }
};
