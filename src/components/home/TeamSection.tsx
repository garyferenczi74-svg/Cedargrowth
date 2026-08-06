import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { PortraitFrame } from './PortraitFrame';
import { Rise } from '@/components/motion/Rise';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { LineReveal } from '@/components/motion/LineReveal';
import { FrameWipe } from '@/components/motion/FrameWipe';
import { home } from '@/content/home';
import { team } from '@/content/team';

// Home Section B, the team section (spec Section B). Sits between the
// transparency band and the research teaser, on bone. A museum wall
// label, not a startup team grid: no cards, no rounded avatars, no bordered
// boxes around an entry, no hover lifts, no social icons, no email
// addresses, no job title chips. Role and bio are pending for both entries
// (ruling D-TEAM) and render through the Unknown atom rather than invented
// copy. Credential is absent for both and is simply omitted, never rendered
// as unknown.

// Motion (CG Prompt 06, Task 18): the header underline moves off the row's
// static border-b onto its own RuleDraw. Per entry: its hairline (the
// former border-t) draws first, the portrait wipes in (FrameWipe owns the
// border so it is revealed by the wipe instead of doubling PortraitFrame's
// own), the name rises, then role, credential (when present), and bio rise
// together 160ms behind the name. Resolve never touches a name or a
// credential, and this component does not use Resolve at all.

export function TeamSection() {
  return (
    <section className="bg-bone py-16 md:py-40">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>{home.team.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              <LineReveal text={home.team.headline} />
            </h2>
          </div>
          {/* /about now exists as a hold page, so this link resolves. */}
          <ButtonLink href="/about" variant="ghost">
            {home.team.cta}
          </ButtonLink>
        </div>
        <RuleDraw className="h-px w-full bg-hairline" />
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-y-0">
          {team.map((member, index) => (
            <article
              key={member.name}
              className={`flex flex-col items-start gap-6 pt-8 md:col-span-5 ${
                index === 1 ? 'md:col-start-8' : ''
              }`}
            >
              <RuleDraw className="h-px w-full bg-hairline" />
              <FrameWipe className="aspect-[4/5] w-full border border-hairline">
                <PortraitFrame
                  src={member.portrait}
                  name={member.name}
                  className="h-full w-full"
                />
              </FrameWipe>
              <Rise>
                <h3 className="font-display text-heading-m-m md:text-heading-m text-primary">
                  {member.name}
                </h3>
              </Rise>
              <Rise delay={0.16} className="flex w-full flex-col items-start gap-6">
                {member.role ? (
                  <Eyebrow>{member.role}</Eyebrow>
                ) : (
                  <Unknown label="Role" caption="Role pending." />
                )}
                {member.credential ? (
                  <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    {member.credential}
                  </p>
                ) : null}
                {member.bio ? (
                  <p className="max-w-[480px] text-body-m-m md:text-body-m text-secondary">
                    {member.bio}
                  </p>
                ) : (
                  <Unknown caption="Bio pending." />
                )}
              </Rise>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
