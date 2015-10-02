function randint (a, b) {
    return Math.floor(Math.random() * b) + a; 
}

function uuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function datelog (s) {
    console.log((new Date()) + ' ' + s);
}