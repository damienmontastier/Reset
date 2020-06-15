import Vue from 'vue'

import IntersectionObserver from '@/directives/intersection-observer.js'
import Sounds from '@/directives/sounds.js'

Vue.directive('intersection-observer', IntersectionObserver)
Vue.directive('sounds', Sounds)
