var AirplaneFSM = fsm({
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
