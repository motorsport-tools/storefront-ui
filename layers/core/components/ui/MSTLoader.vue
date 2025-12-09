<script setup lang="ts">
const props = defineProps({
    size: Number
})
const aspect = 1.6667
const width = computed(() => props?.size * aspect )
</script>
<template>
    <div class="loader" :style="`--flag-height: ${size || 60}px; --flag-width: ${width || 100}px;`">
        <div class="flag anti-aliasing">
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
        </div>
    </div>
</template>
<style lang="scss">
:root {
    --flag-color: #cd1619;
    --flag-border-radius: 4px;
    --flag-skew: 160deg;
}
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.flag {
    display: flex;
    height: var(--flag-height);
    width: var(--flag-width);
    transform: skewX(var(--flag-skew));
    --col-bg-offset: calc(var(--flag-height) / 3.96);

    .col {
       width: 100%;
        background: linear-gradient(
                0deg,
                var(--flag-color) 0%,
                var(--flag-color) 25%,
                transparent 25%,
                transparent 50%,
                var(--flag-color) 50%,
                var(--flag-color) 75%,
                transparent 75%,
                transparent 100%
            );
        background-size: 101% 102%;
        overflow: hidden;
        animation: flagWave 500ms infinite alternate ease-in-out backwards;
        border-bottom: 1px solid #fff;

        &:first-child {
            border-top-left-radius: var(--flag-border-radius);
            border-bottom-left-radius: var(--flag-border-radius);
            overflow: hidden;
        }
        &:last-child {
            border-top-right-radius: var(--flag-border-radius);
            border-bottom-right-radius: var(--flag-border-radius);
            overflow: hidden;
        }

        &:nth-child(even) {
           background-position: 0 var(--col-bg-offset);
        }
    }
}



@keyframes flagWave {
    from {
        transform: translateY(3px);
    }
    to {
        transform: translateY(-3px);
    }
}

@for $i from 1 through 4 {
  .flag {
        .col:nth-child(#{$i}) {
            animation-delay: $i * 100ms;
        }
    }
}
</style>