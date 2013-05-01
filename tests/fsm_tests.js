module("Airplane fsm");

test('airplane fsm tests', function () {

    var airplane = AirplaneFSM.start(['JetAirways', 'Mumbai', 'Bangalore']);
    deepEqual(airplane._state, {seatbelt: 'off', doors: 'closed'});
    equal(airplane._stateName, 'onland');

    var reply = airplane.send('boarding', 1234);
    equal(reply, 'good morning');
    equal(airplane._stateName, 'onland');
    deepEqual(airplane._state, {seatbelt: 'off', doors: 'open'});

    airplane.send('takeoff', 1234);
    equal(airplane._stateName, 'inair');
    deepEqual(airplane._state, {seatbelt: 'on', doors: 'closed'});

    airplane.send('cruising', 'abc');
    equal(airplane._stateName, 'inair');
    deepEqual(airplane._state, {seatbelt: 'off', doors: 'closed'});

    var reply = airplane.send_all('announcement', 'We have turbulence!');
    equal(reply, 'alright captain');
    equal(airplane._stateName, 'inair');

    var reply = airplane.send('turbulence', '$#$@$');
    equal(reply, 'butterflies in stomach');
    equal(airplane._stateName, 'inair');
    deepEqual(airplane._state, {seatbelt: 'on', doors: 'closed'});

    airplane.send('cruising', 'height 2034');
    equal(airplane._stateName, 'inair');
    deepEqual(airplane._state, {seatbelt: 'off', doors: 'closed'});

    airplane.send('land', '78898798');
    equal(airplane._stateName, 'onland');
    deepEqual(airplane._state, {seatbelt: 'on', doors: 'closed'});

    airplane.send('arrival', 'in Bangalore');
    equal(airplane._stateName, 'onland');
    deepEqual(airplane._state, {seatbelt: 'off', doors: 'open'});

    var reply = airplane.send_all('announcement', 'Welcome to bangalore!');
    equal(reply, 'alright captain');
    equal(airplane._stateName, 'onland');
});
