import Vue from 'vue'

import IntersectionObserver from '@/directives/intersection-observer.js'
import Sounds from '@/directives/sounds.js'
import Kinesis from '@/directives/kinesis.js'

Vue.directive('intersection-observer', IntersectionObserver)
Vue.directive('sounds', Sounds)
Vue.directive('kinesis', Kinesis)
