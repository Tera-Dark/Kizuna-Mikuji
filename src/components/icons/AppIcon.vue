<script>
import { h } from 'vue';

/**
 * 线性图标集。全部 24×24、stroke=currentColor，不依赖任何图标库。
 * 用 name 选择，尺寸用 size（默认 20），描边粗细用 weight（默认 1.6）。
 */
const ICONS = {
  sun: [
    ['circle', { cx: 12, cy: 12, r: 4 }],
    ['path', { d: 'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4' }],
  ],
  heart: [
    ['path', { d: 'M12 20.2s-7.2-4.4-7.2-9.4A3.9 3.9 0 0 1 12 7.4a3.9 3.9 0 0 1 7.2 3.4c0 5-7.2 9.4-7.2 9.4z' }],
  ],
  hourglass: [
    ['path', { d: 'M7 3.5h10M7 20.5h10' }],
    ['path', { d: 'M8.2 3.5c0 4 3.8 5.2 3.8 8.5s-3.8 4.5-3.8 8.5M15.8 3.5c0 4-3.8 5.2-3.8 8.5s3.8 4.5 3.8 8.5' }],
  ],
  briefcase: [
    ['rect', { x: 3, y: 7.5, width: 18, height: 12, rx: 1.5 }],
    ['path', { d: 'M9 7.5v-2h6v2M3 12h18M10.5 12v2h3v-2' }],
  ],
  branches: [
    ['circle', { cx: 6, cy: 8, r: 2.4 }],
    ['circle', { cx: 18, cy: 8, r: 2.4 }],
    ['path', { d: 'M12 20.5v-6M12 14.5L7.2 9.8M12 14.5l4.8-4.7' }],
  ],
  leaf: [
    ['path', { d: 'M20 4C11 4 4 9 4 16c0 0 0 4 4 4 7 0 12-7 12-16z' }],
    ['path', { d: 'M4 20C7 14 12 10 18 7' }],
  ],
  brush: [
    ['path', { d: 'M4 20l3.2-.7L19 7.5a1.8 1.8 0 0 0-2.5-2.5L4.7 16.8 4 20z' }],
    ['path', { d: 'M14.5 6.5l3 3' }],
  ],
  star: [
    ['path', { d: 'M12 3.5l2.5 5.4 5.9.6-4.5 4 1.3 5.8L12 16.5l-5.2 2.8 1.3-5.8-4.5-4 5.9-.6z' }],
  ],
  rings: [
    ['circle', { cx: 9, cy: 13.5, r: 5.2 }],
    ['circle', { cx: 15, cy: 13.5, r: 5.2 }],
    ['path', { d: 'M12 5.5l-1.6-2h3.2z' }],
  ],
  omamori: [
    ['path', { d: 'M8.5 3.5h7l.8 2.2 1.7 2.6v12.2H6V8.3l1.7-2.6z' }],
    ['path', { d: 'M12 8.5v6.5M9.6 11.6h4.8' }],
  ],
  bell: [
    ['path', { d: 'M12 3.5a5 5 0 0 0-5 5v4.2l-1.8 3.3h13.6L17 12.7V8.5a5 5 0 0 0-5-5z' }],
    ['path', { d: 'M10 18.5a2 2 0 0 0 4 0M12 2v1.5' }],
  ],
  book: [
    ['path', { d: 'M4.5 5.5H10a2.5 2.5 0 0 1 2.5 2.5v11a2 2 0 0 0-2-2H4.5z' }],
    ['path', { d: 'M19.5 5.5H14A2.5 2.5 0 0 0 11.5 8v11a2 2 0 0 1 2-2h6z' }],
  ],
  user: [
    ['circle', { cx: 12, cy: 8, r: 3.6 }],
    ['path', { d: 'M5 20c.6-3.6 3.4-5.6 7-5.6s6.4 2 7 5.6' }],
  ],
  compass: [
    ['circle', { cx: 12, cy: 12, r: 8.5 }],
    ['path', { d: 'M14.8 9.2l-1.5 4.1-4.1 1.5 1.5-4.1z' }],
  ],
  mail: [
    ['rect', { x: 3, y: 5.5, width: 18, height: 13, rx: 1.5 }],
    ['path', { d: 'M4 7l8 6 8-6' }],
  ],
  link: [
    ['path', { d: 'M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5' }],
    ['path', { d: 'M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5' }],
  ],
  eye: [
    ['path', { d: 'M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z' }],
    ['circle', { cx: 12, cy: 12, r: 2.6 }],
  ],
  trash: [
    ['path', { d: 'M4.5 6.5h15M9.5 6.5v-2h5v2M7 6.5l1 13h8l1-13' }],
    ['path', { d: 'M10.5 10.5v6M13.5 10.5v6' }],
  ],
  broom: [
    ['path', { d: 'M4 20.5l1.5-4 3-3 2.5 2.5-3 3z' }],
    ['path', { d: 'M8.5 13.5l3-3 2 2-3 3M11 11l6-6 2 2-6 6' }],
  ],
  refresh: [
    ['path', { d: 'M20 12a8 8 0 1 1-2.4-5.7' }],
    ['path', { d: 'M20 4.5V9h-4.5' }],
  ],
  check: [
    ['circle', { cx: 12, cy: 12, r: 8.5 }],
    ['path', { d: 'M8 12.2l2.6 2.6L16 9.6' }],
  ],
  calendar: [
    ['rect', { x: 3.5, y: 5.5, width: 17, height: 15, rx: 1.5 }],
    ['path', { d: 'M3.5 9.5h17M8 3.5v4M16 3.5v4' }],
  ],
  sparkles: [
    ['path', { d: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z' }],
    ['path', { d: 'M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z' }],
  ],
  flame: [
    ['path', { d: 'M12 3c2.5 3 4.5 4.9 4.5 8.1a4.5 4.5 0 0 1-9 0c0-1.6.7-2.9 1.7-4.1.2 1.2.9 2.1 1.8 2.5C10.3 7.7 10.8 5.2 12 3z' }],
  ],
  water: [
    ['path', { d: 'M12 3.5s5.5 6 5.5 9.8a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5z' }],
  ],
  wind: [
    ['path', { d: 'M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h7' }],
  ],
  globe: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18' }],
  ],
  scroll: [
    ['rect', { x: 6, y: 4, width: 12, height: 16, rx: 1 }],
    ['path', { d: 'M6 4c-1.1 0-2 .8-2 1.8S4.9 7.6 6 7.6M18 4c1.1 0 2 .8 2 1.8s-.9 1.8-2 1.8' }],
    ['path', { d: 'M6 16.4c-1.1 0-2 .8-2 1.8s.9 1.8 2 1.8M18 16.4c1.1 0 2 .8 2 1.8s-.9 1.8-2 1.8' }],
    ['path', { d: 'M9.5 9h5M9.5 12h5M9.5 15h3' }],
  ],
  volume: [
    ['path', { d: 'M4 10v4h3l4 3.5v-11L7 10H4z' }],
    ['path', { d: 'M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11' }],
  ],
  close: [
    ['path', { d: 'M6 6l12 12M18 6L6 18' }],
  ],
  arrowRight: [
    ['path', { d: 'M4 12h15M13 6l6 6-6 6' }],
  ],
  torii: [
    ['path', { d: 'M3 6h18M5 6l1 14M19 6l-1 14M4.5 10h15M8 10v10M16 10v10' }],
  ],
  thread: [
    ['path', { d: 'M3 17c4.5-9 9-13 18-12' }],
    ['circle', { cx: 21, cy: 5, r: 1.6 }],
  ],
};

export default {
  name: 'AppIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 20 },
    weight: { type: [Number, String], default: 1.6 },
  },
  setup(props) {
    return () =>
      h(
        'svg',
        {
          class: 'app-icon',
          width: props.size,
          height: props.size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': props.weight,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        (ICONS[props.name] || ICONS.sparkles).map(([tag, attrs]) => h(tag, attrs))
      );
  },
};
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
  flex: 0 0 auto;
}
</style>
