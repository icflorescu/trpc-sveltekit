<script lang="ts">
  export let color = 'currentColor';
  export let size: number | string = '1em';
  export let m: number | string | undefined = undefined;
  export let my: number | string | undefined = undefined;
  export let mt: number | string | undefined = undefined;
  export let mb: number | string | undefined = undefined;
  export let mx: number | string | undefined = undefined;
  export let ml: number | string | undefined = undefined;
  export let mr: number | string | undefined = undefined;
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
  <circle cx="12" cy="12" r="9" />
  <line x1="12" y1="8" x2="12.01" y2="8" />
  <polyline points="11 12 12 12 12 16 13 16" />
</svg>
