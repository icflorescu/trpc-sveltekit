<script lang="ts">
  import type { IconProps } from './types.ts';

  let { color = 'currentColor', size = '1em', m, my, mt, mb, mx, ml, mr }: IconProps = $props();
</script>

<svg
  style:margin={m}
  style:margin-top={my || mt}
  style:margin-bottom={my || mb}
  style:margin-left={mx || ml}
  style:margin-right={mx || mr}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke={color}
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M12 2v2" />
  <path d="M9 12v9" />
  <path d="M15 12v9" />
  <path d="M5 16l4 -2" />
  <path d="M15 14l4 2" />
  <path d="M9 18h6" />
  <path d="M10 8v.01" />
  <path d="M14 8v.01" />
</svg>
