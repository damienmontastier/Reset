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
    filter: grayscale(1);
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
    transform: translate(0, 0);
  }

  10% {
    transform: translate(-5%, -10%);
  }

  20% {
    transform: translate(-15%, 5%);
  }

  30% {
    transform: translate(7%, -25%);
  }

  40% {
    transform: translate(-5%, 25%);
  }

  50% {
    transform: translate(-15%, 10%);
  }

  60% {
    transform: translate(15%, 0%);
  }

  70% {
    transform: translate(0%, 15%);
  }

  80% {
    transform: translate(3%, 35%);
  }

  90% {
    transform: translate(-10%, 10%);
  }
}
</style>
