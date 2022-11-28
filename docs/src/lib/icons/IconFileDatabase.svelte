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
  <ellipse cx="12" cy="12.75" rx="4" ry="1.75" />
  <path d="M8 12.5v3.75c0 .966 1.79 1.75 4 1.75s4 -.784 4 -1.75v-3.75" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
</svg>
