
window.__dev = true;

const API = {
    base: 'http://localhost:9010/api',
    endpoints: {
        nextVideo: 'http://localhost:9010/api/nextVideo'
    }
}


function startVideo() {
    fetch('http://localhost:9010/video/current.mp4')
        .then(res => {
            if (res.ok) {
                let doInit = !app.stream.available;
                app.stream.available = true;
                app.$nextTick(() => {
                    let video = document.getElementById('video');
            
                    if (doInit) {
                        video.addEventListener('ended', onVideoEnded, false);
                        if (window.__dev) video.setAttribute("controls", "");
                    } else {
                        video.currentTime = 0;
                    }
            
                    video.play();
                });
            } else {
                fetch(API.endpoints.nextVideo)
                    .then(res => {
                        if (res.ok)
                            startVideo();
                    })
                    .catch(console.error);
            }
        })
        .catch(console.error);
}

function stopVideo() {
    let video = document.getElementById('video');
    video.pause();
    app.stream.available = false;
}

function onVideoEnded() {
    let video = document.getElementById('video');
    fetch(API.endpoints.nextVideo)
        .then(() => {
            app.stream.source = 'http://localhost:9010/video/current.mp4?' + Date.now(); // to prevent browser caching since it's the same base url
            video.currentTime = 0;
            app.$nextTick(() => video.play());
        })
        .catch(err => {
            console.error(err);
            startVideo(); // loop again
        });
}

function init() {
    onSocket((key, value) => {
        console.log(key + " + " + value);
        if (['val1', 'val2', 'val3'].includes(key))
            Vue.set(app.data, key, value);
    });

}
init();
