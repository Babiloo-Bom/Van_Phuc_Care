import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCC5gb7MZlFR0Ze618unEUHO6Ia7UON54I',
        users: 'places',
        region: 'VI',
        language: 'vi',
    },
});
