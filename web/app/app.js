
/*
 * Use this file for vue related code only, everything else goes in main.js (or other files if necessary)
 */


Vue.component('dataset', {
    props: [ 'name', 'value' ],
    template: '#t-dataset'
})


let app;
app = new Vue({
    el: '#app',
    data: {
        stream: {
            available: false,
            source: ''
        }
    },
    methods: {

    }
});

