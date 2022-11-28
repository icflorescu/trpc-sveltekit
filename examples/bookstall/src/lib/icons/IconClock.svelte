<script lang="ts">
  export let size: number | string = '1em';
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <circle cx="12" cy="12" r="9" />
  <path d="M12 12h3.5" />
  <path d="M12 7v5" />
</svg>
