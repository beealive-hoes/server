
// Dev mode is enabled if you add a ?dev to the page url
// e.g. goto http://localhost:9010/?dev
window.__dev = location.search.includes('dev');

//

const API = {
    base: location.origin + '/api',
    endpoints: {
        nextVideo: location.origin + '/api/nextVideo'
    }
}


function startVideo() {
    fetch(location.origin + '/video/current.mp4')
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
    fetch(API.endpoints.nextVideo) // ein 502 hier ist einfach zu ignorieren :)
        .then(() => {
            app.stream.source = location.origin + '/video/current.mp4?' + Date.now(); // to prevent browser caching since it's the same base url
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

    setTimeout(() => {
        document.body.classList.remove('intro');
    }, window.__dev ? 0 : 10000);

}
init();
