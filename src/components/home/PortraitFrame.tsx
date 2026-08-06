import Image from 'next/image';

// A 4:5 portrait slot in the established placeholder language (bg-bone,
// mono specimen caption), built because Placeholder cannot
// serve this job: its caption is hardcoded to "Placeholder, {family}" and it
// is always role="img", with no decorative mode. Here, src is a prop, not a
// requirement. With no src, the frame is a decorative placeholder frame and
// is aria-hidden with no alt. Once a real photo lands, pass src and name so
// it renders with alt "Portrait of {name}".
//
// No hairline border here (CG Prompt 06, Task 18): TeamSection wraps this in
// FrameWipe and puts `border border-hairline` on the wipe's own className so
// the border is revealed by the clip-path wipe instead of sitting static
// underneath it, and so the border never doubles.

export function PortraitFrame({
  src,
  name,
  className = '',
}: {
  src?: string | null;
  name?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative aspect-[4/5] bg-bone ${className}`}>
        <Image
          src={src}
          alt={name ? `Portrait of ${name}` : ''}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[4/5] items-end bg-bone ${className}`}
    >
      <span className="p-3 font-mono text-specimen uppercase tracking-specimen text-tertiary">
        Portrait
      </span>
    </div>
  );
}
