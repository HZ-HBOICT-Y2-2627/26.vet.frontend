<script lang="ts">
  // Covers the CTAs on the page — all navigation (<a>), not form submission.
  // The "Check availability" button is a real form action and is left as a
  // plain <button> in BookingSection rather than forced through this atom.
  type Variant = 'solid' | 'outline' | 'inverse';
  type Size = 'sm' | 'md';

  interface Props {
    href: string;
    label: string;
    variant?: Variant;
    size?: Size;
    class?: string;
  }

  let { href, label, variant = 'solid', size = 'md', class: className = '' }: Props = $props();

  // A lookup table: pick the Tailwind classes that go with the chosen variant/size.
  const variantClasses = {
    solid: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'border border-primary-600 text-primary-700 hover:bg-primary-100',
    inverse: 'bg-white text-primary-800 hover:bg-primary-100',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
  };
</script>

<a {href} class="inline-block rounded-full font-semibold {variantClasses[variant]} {sizeClasses[size]} {className}">
  {label}
</a>
