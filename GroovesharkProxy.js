var script = document.createElement('script');
var GroovesharkProxyDiv = document.createElement('div');
GroovesharkProxyDiv.id = 'GroovesharkProxyDiv';
GroovesharkProxyDiv.style.display = 'none';
document.body.appendChild(GroovesharkProxyDiv);
function runOnPage() {
    var GroovesharkProxyDiv = document.getElementById('GroovesharkProxyDiv');
    function songStatusCallback(data) {
        GroovesharkProxyDiv.innerText = JSON.stringify(data);
        var evt = document.createEvent("Event");
        evt.initEvent("GroovesharkSongEvent", true, true );
        GroovesharkProxyDiv.dispatchEvent(evt);
    }
    
    GroovesharkProxyDiv.addEventListener('GroovesharkSendAction', function() {
        var f = window.Grooveshark[GroovesharkProxyDiv.getAttribute('data-send-action')]
        var args = JSON.parse(GroovesharkProxyDiv.getAttribute('data-send-action-arguments'));
        f.apply(window.Grooveshark, args);
    });
    window.Grooveshark.setSongStatusCallback(songStatusCallback);
}
script.innerHTML = runOnPage + "\nrunOnPage();";
document.body.appendChild(script);

var GroovesharkProxy = {};
GroovesharkProxy.sendAction = function(action, args) {
    GroovesharkProxyDiv.setAttribute('data-send-action', action);
    GroovesharkProxyDiv.setAttribute('data-send-action-arguments', JSON.stringify(args));
    var evt = document.createEvent('Event');
    evt.initEvent('GroovesharkSendAction', true, true);
    GroovesharkProxyDiv.dispatchEvent(evt);
}
GroovesharkProxy.apiCalls = [
    'addAlbumById',
    'addCurrentSongToLibrary',
    'addPlaylistByID',
    'addSongByToken',
    'addSongsByID',
    'executeProtocol',
    'favoriteCurrentSong',
    'getAPIVersion',
    'getApplicationVersion',
    'getCurrentSongStatus',
    'getNextSong',
    'getPreviousSong',
    'getVolume',
    'getVoteForCurrentSong',
    'next',
    'pause',
    'play',
    'previous',
    'removeCurrentSongFromQueue',
    'seekToPosition',
    'setSongStatusCallback',
    'setVolume',
    'togglePlayPause',
    'voteCurrentSong'
];

function createActionFunc(funcName) {
    return function() {
        // Convert arguments to an actual array.
        var args = Array.prototype.slice.call(arguments);
        GroovesharkProxy.sendAction(funcName, args);
    }
}

for (var i = 0; i < GroovesharkProxy.apiCalls.length; ++i) {
    var funcName = GroovesharkProxy.apiCalls[i];
    GroovesharkProxy[funcName] = createActionFunc(funcName);
};

GroovesharkProxy.setSongStatusCallback = function(cb) {
    GroovesharkProxy.songStatusCallback = cb;
}

GroovesharkProxyDiv.addEventListener('GroovesharkSongEvent', function() {
    if (!GroovesharkProxy.songStatusCallback) return;
    var data = JSON.parse(GroovesharkProxyDiv.innerText);
    GroovesharkProxy.songStatusCallback(data);
});

