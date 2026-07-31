import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { PortraitFrame } from './PortraitFrame';
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

export function TeamSection() {
  return (
    <section className="bg-bone py-16 md:py-40">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="reveal flex flex-col gap-6 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>{home.team.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              {home.team.headline}
            </h2>
          </div>
          {/* /about does not exist yet; this link is intentionally pending a real destination. */}
          <ButtonLink href="/about" variant="ghost">
            {home.team.cta}
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-y-0">
          {team.map((member, index) => (
            <article
              key={member.name}
              className={`reveal flex flex-col items-start gap-6 border-t border-hairline pt-8 md:col-span-5 ${
                index === 1 ? 'md:col-start-8' : ''
              }`}
            >
              <PortraitFrame src={member.portrait} name={member.name} />
              <h3 className="font-display text-heading-m-m md:text-heading-m text-primary">
                {member.name}
              </h3>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
