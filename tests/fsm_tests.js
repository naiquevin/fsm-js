
module("FSM Tests", {

    setup: function () {

        // a test impl of FSM
        this.airplane = fsm({
            init: function (name, from, to) {
                return ['next_state', 'onland', {seatbelt: 'off', doors: 'closed'}];
            },
            onland: function (msg, data, state) {
                switch (msg) {
                case 'boarding':
                    return ['reply', 'good morning', 'onland', {doors: 'open'}];
                    break;
                case 'takeoff':
                    return ['next_state', 'inair', {seatbelt: 'on', doors: 'closed'}];
                    break;
                case 'arrival':
                    return ['reply', 'bye', 'onland', {seatbelt: 'off', doors: 'open'}];
                    break;
                default:
                    console.log('Unexpected message ' + msg + 'in state onland');
                    return ['next_state', 'onland', state];
                }
            },
            inair: function (msg, data, state) {
                switch (msg) {
                case 'cruising':
                    return ['next_state', 'inair', {seatbelt: 'off'}];
                    break;
                case 'land':
                    return ['next_state', 'onland', {seatbelt: 'on'}];
                    break;
                case 'turbulence':
                    return ['reply', 'butterflies in stomach', 'inair', {seatbelt: 'on'}];
                    break;
                }
            },
            handleAll: function (msg, data, stateName, state) {
                switch (msg) {
                case 'announcement':
                    return ['reply', 'alright captain', stateName, state]
                    break;
                }
            }
        });
    }    
});

test('airplane fsm tests', function () {
    this.airplane.start(['JetAirways', 'Mumbai', 'Bangalore']);
    deepEqual(this.airplane._state, {seatbelt: 'off', doors: 'closed'});
    equal(this.airplane._stateName, 'onland');

    var reply = this.airplane.send('boarding', 1234);    
    equal(reply, 'good morning');
    equal(this.airplane._stateName, 'onland');
    deepEqual(this.airplane._state, {seatbelt: 'off', doors: 'open'});

    this.airplane.send('takeoff', 1234);
    equal(this.airplane._stateName, 'inair');
    deepEqual(this.airplane._state, {seatbelt: 'on', doors: 'closed'});

    this.airplane.send('cruising', 'abc');
    equal(this.airplane._stateName, 'inair');
    deepEqual(this.airplane._state, {seatbelt: 'off', doors: 'closed'});

    var reply = this.airplane.send_all('announcement', 'We have turbulence!');
    equal(reply, 'alright captain');
    equal(this.airplane._stateName, 'inair');

    var reply = this.airplane.send('turbulence', '$#$@$');
    equal(reply, 'butterflies in stomach');
    equal(this.airplane._stateName, 'inair');
    deepEqual(this.airplane._state, {seatbelt: 'on', doors: 'closed'});    

    this.airplane.send('cruising', 'height 2034');
    equal(this.airplane._stateName, 'inair');
    deepEqual(this.airplane._state, {seatbelt: 'off', doors: 'closed'});

    this.airplane.send('land', '78898798');
    equal(this.airplane._stateName, 'onland');
    deepEqual(this.airplane._state, {seatbelt: 'on', doors: 'closed'});

    this.airplane.send('arrival', 'in Bangalore');
    equal(this.airplane._stateName, 'onland');
    deepEqual(this.airplane._state, {seatbelt: 'off', doors: 'open'});

    var reply = this.airplane.send_all('announcement', 'Welcome to bangalore!');
    equal(reply, 'alright captain');
    equal(this.airplane._stateName, 'onland');
});
