<script lang="ts">
  import type { Testimonial } from '../../data';

  interface Props {
    testimonial: Testimonial;
  }

  let { testimonial }: Props = $props();
</script>

<figure class="rounded-2xl border border-slate-200 p-6 shadow-sm">
  <blockquote class="text-slate-700">"{testimonial.quote}"</blockquote>
  <figcaption class="mt-4 text-sm font-semibold text-slate-900">
    {testimonial.author}
    <span class="block text-xs font-normal text-slate-500">{testimonial.detail}</span>
  </figcaption>
</figure>
