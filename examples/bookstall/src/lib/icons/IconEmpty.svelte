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
  <line x1="9" y1="10" x2="9.01" y2="10" />
  <line x1="15" y1="10" x2="15.01" y2="10" />
  <line x1="9" y1="15" x2="15" y2="15" />
</svg>
