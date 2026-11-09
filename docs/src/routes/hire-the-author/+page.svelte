<script lang="ts">
  import swappDashboard from '#lib/assets/swapp-dashboard.webp';
  import { AUTHOR_URL, BADGE_COLOR_CODE } from '#lib/constants.ts';
</script>

<h2>Hire the author</h2>

<h3>Hi there!</h3>

<a href={AUTHOR_URL} target="_blank" rel="noreferrer"
  ><img class="author" src="https://avatars.githubusercontent.com/u/581999" alt="@icflorescu" /></a
>

<p>
  I'm Ionut-Cristian Florescu, a hands-on fractional CTO, product builder and open-source author
  from Bucharest, Romania, EU, building for the web since 1998.
  <br />
  I take software products from a blank repo to production, and stay to run them for years. I still write
  production code.
</p>

<p>
  tRPC-SvelteKit is one of my dearest open-source projects. I'm also the author of
  <a href="https://icflorescu.github.io/mantine-datatable/" target="_blank" rel="noreferrer"
    >Mantine DataTable</a
  >
  (600k+ npm downloads a month, used by companies such as Microsoft and Namecheap) and
  <a href="https://icflorescu.github.io/mantine-contextmenu/" target="_blank" rel="noreferrer"
    >Mantine ContextMenu</a
  >, and a contributor to tRPC and Mantine.
</p>

<div class="swapp">
  <div>
    <p>
      These days I'm managing
      <strong><a href="https://swapp.ro" target="_blank" rel="noreferrer">swapp.ro</a></strong>, an
      invoicing and single-entry accounting product for Romanian freelancers (PFA, ÎI and PFI) who
      aren't VAT-registered, which I've built with TanStack Start, tRPC, Drizzle and PostgreSQL.
    </p>
    <p>
      It's fully compliant with ANAF's <span class="nowrap">e-Factura</span> system, and it's built and
      maintained in accordance with the current legislation:
    </p>
    <ul>
      <li>
        invoices in RON or foreign currencies, sent through <span class="nowrap">e-Factura</span>,
        with supplier invoices collected automatically;
      </li>
      <li>the mandatory accounting registers, generated and always up to date;</li>
      <li>the figures for the D212, D390 and D301 tax returns, and when each one is due.</li>
    </ul>
    <p>
      Are you a Romanian freelancer?
      <strong
        ><a href="https://swapp.ro/inregistrare" target="_blank" rel="noreferrer">Give it a try</a
        ></strong
      >!
    </p>
  </div>
  <a class="swapp-screenshot" href="https://swapp.ro" target="_blank" rel="noreferrer">
    <img
      src={swappDashboard}
      width="960"
      height="540"
      alt="The swapp.ro dashboard: deadlines, overdue invoices and money owed, at a glance"
    />
  </a>
</div>

<h3>How I can help</h3>

<ul>
  <li>as a fractional CTO or technical partner for early-stage products;</li>
  <li>in sweat-equity partnerships where I own the technical side;</li>
  <li>
    on selected hands-on projects, ideally built with TypeScript, React and TanStack, tRPC and
    PostgreSQL (and I'm always happy to work with Svelte and SvelteKit).
  </li>
</ul>

<p>
  You can learn more about what I do on my
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">GitHub profile</a>
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer"
    ><img
      class="badge"
      src="https://img.shields.io/github/stars/icflorescu?style=flat&color={BADGE_COLOR_CODE}"
      alt="GitHub stars"
    /></a
  >
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer"
    ><img
      class="badge"
      src="https://img.shields.io/github/followers/icflorescu?style=flat&color={BADGE_COLOR_CODE}"
      alt="GitHub followers"
    /></a
  >, on
  <a href="https://www.linkedin.com/in/icflorescu" target="_blank" rel="noreferrer">LinkedIn</a>, or
  in my
  <a
    href="https://github.com/icflorescu/icflorescu/blob/main/ionut-cristian-florescu--resume.pdf"
    target="_blank"
    rel="noreferrer">résumé</a
  >.
</p>

<h3>Get in touch</h3>

<p>
  Drop me a line at the email address listed in my
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">GitHub profile</a>, and we'll schedule a
  meeting on
  <a href="https://cal.com/icflorescu" target="_blank" rel="noreferrer">cal.com/icflorescu</a>. I'm
  getting a constant flow of approaches, some of them relevant, others not so relevant, so
  mentioning "tRPC-SvelteKit" in your message would help me prioritize it.
</p>

<p>
  Thank you for your interest,
  <br />
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">Ionut-Cristian Florescu</a>
</p>

<style lang="scss">
  h3 {
    margin-bottom: 0.75em;
  }

  .author {
    border-radius: var(--pico-border-radius);
    margin-bottom: 1.5em;
    @media (min-width: 400px) {
      float: left;
      width: 30%;
      max-width: 200px;
      margin: 0.4em 1.5em 0 0;
    }
  }

  .badge {
    margin-top: -0.25em;
  }

  .swapp {
    clear: both;
    display: grid;
    gap: var(--pico-spacing);
    align-items: center;
    margin: calc(var(--pico-spacing) * 2) 0;
    padding: var(--pico-spacing);
    border-left: 0.25em solid var(--pico-primary);
    border-radius: var(--pico-border-radius);
    background: var(--pico-card-sectioning-background-color);
    @media (min-width: 1280px) {
      grid-template-columns: 1fr 45%;
    }
    p,
    ul {
      margin-bottom: calc(var(--pico-spacing) * 0.5);
    }
    p:last-child {
      margin-bottom: 0;
    }
  }

  .nowrap {
    white-space: nowrap;
  }

  .swapp-screenshot img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--pico-border-radius);
    box-shadow: var(--pico-card-box-shadow);
  }
</style>
