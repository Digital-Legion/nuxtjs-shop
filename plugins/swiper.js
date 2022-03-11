import Vue from 'vue';
import { Swiper, Mousewheel, Navigation, EffectFade, Controller, Keyboard, Pagination } from 'swiper/js/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

import 'swiper/css/swiper.css';

Swiper.use([Mousewheel, EffectFade, Navigation, Controller, Pagination, Keyboard])

Vue.use(getAwesomeSwiper(Swiper))
