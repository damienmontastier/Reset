<template>
  <div class="appNoise"></div>
</template>

<style lang="scss">
.appNoise {
  animation: 5s fadeIn;
  height: 100%;
  width: 100%;

  &::after {
    animation: grain 8s steps(10) infinite;
    background-image: url('/images/noise.jpg');
    content: '';
    // filter: grayscale(1);
    height: 300%;
    left: -50%;
    opacity: 0.12;
    position: fixed;
    top: -110%;
    width: 300%;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes grain {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  10% {
    transform: translate3d(-5%, -10%, 0);
  }

  20% {
    transform: translate3d(-15%, 5%, 0);
  }

  30% {
    transform: translate3d(7%, -25%, 0);
  }

  40% {
    transform: translate3d(-5%, 25%, 0);
  }

  50% {
    transform: translate3d(-15%, 10%, 0);
  }

  60% {
    transform: translate3d(15%, 0%, 0);
  }

  70% {
    transform: translate3d(0%, 15%, 0);
  }

  80% {
    transform: translate3d(3%, 35%);
  }

  90% {
    transform: translate3d(-10%, 10%);
  }
}
</style>
