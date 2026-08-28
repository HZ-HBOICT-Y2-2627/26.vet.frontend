<script lang="ts">
  // One link, three contexts (desktop nav, mobile menu, footer) — each with
  // its own styling, so the variant is part of this component's contract
  // rather than three near-identical components.
  interface Props {
    href: string;
    label: string;
    variant?: 'desktop' | 'mobile' | 'footer';
    onclick?: () => void;
  }

  let { href, label, variant = 'desktop', onclick }: Props = $props();

  const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    desktop: 'text-sm font-medium text-slate-600 hover:text-primary-700',
    mobile: 'rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-700',
    footer: 'hover:text-white',
  };
</script>

<a {href} class={variantClasses[variant]} {onclick}>{label}</a>
