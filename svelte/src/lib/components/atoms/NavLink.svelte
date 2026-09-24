<script lang="ts">
  // One link, three contexts (desktop nav, mobile menu, footer) — each with
  // its own styling, so the variant is part of this component's contract
  // rather than three near-identical components.
  type Variant = 'desktop' | 'mobile' | 'footer';

  interface Props {
    href: string;
    label: string;
    variant?: Variant;
    onclick?: () => void;
  }

  let { href, label, variant = 'desktop', onclick }: Props = $props();

  // A lookup table: pick the Tailwind classes that go with the chosen variant.
  const variantClasses = {
    desktop: 'text-sm font-medium text-slate-600 hover:text-primary-700',
    mobile: 'rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-700',
    footer: 'hover:text-white',
  };
</script>

<a {href} class={variantClasses[variant]} {onclick}>{label}</a>
