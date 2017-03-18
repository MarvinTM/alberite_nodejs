var sysFsPath = '/sys/class/gpio/gpio';
var pinMapping = {
    '16': 23
};

function open(pinNumber, direction, callback) {
    const path = sysFsPath + pinMapping[pinNumber] + '/direction';

    fs.writeFile(path, direction, (callback || noOp));
}

function write(pinNumber, value, callback) {
    const path = sysFsPath + pinMapping[pinNumber] + '/value';
    value = !! value ? '1' : '0';

    fs.writeFile(path, value, 'utf8', callback);
}

function noOp() {}

gpio.open(18, 'out', function() {
    var on = 0;

    var blinker = setInterval(function() {
        gpio.write(16, on, function() {
            on = (on + 1) % 2;

            console.log('ON = ' + on);
        });
    }, 1000);

    setTimeout(function() {
        clearInterval(blinker);
    }, 12000);
});