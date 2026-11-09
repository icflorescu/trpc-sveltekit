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
  <circle cx="12" cy="12" r="4" />
  <circle cx="12" cy="12" r="9" />
  <line x1="15" y1="15" x2="18.35" y2="18.35" />
  <line x1="9" y1="15" x2="5.65" y2="18.35" />
  <line x1="5.65" y1="5.65" x2="9" y2="9" />
  <line x1="18.35" y1="5.65" x2="15" y2="9" />
</svg>
