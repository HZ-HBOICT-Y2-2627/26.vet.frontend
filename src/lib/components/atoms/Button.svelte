<script lang="ts">
  // Covers the CTAs on the page — all navigation (<a>), not form submission.
  // The "Check availability" button is a real form action and is left as a
  // plain <button> in BookingSection rather than forced through this atom.
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    variant?: 'solid' | 'outline' | 'inverse';
    size?: 'sm' | 'md';
    class?: string;
    children: Snippet;
  }

  let { href, variant = 'solid', size = 'md', class: className = '', children }: Props = $props();

  const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    solid: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'border border-primary-600 text-primary-700 hover:bg-primary-100',
    inverse: 'bg-white text-primary-800 hover:bg-primary-100',
  };

  const sizeClasses: Record<NonNullable<Props['size']>, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
  };
</script>

<a {href} class="inline-block rounded-full font-semibold {variantClasses[variant]} {sizeClasses[size]} {className}">
  {@render children()}
</a>
