
onSocket((key, value) => {
    console.log(key + " + " + value);
    if (['val1', 'val2', 'val3'].includes(key))
        Vue.set(app.data, key, value);
});
