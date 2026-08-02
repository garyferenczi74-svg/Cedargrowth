import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

export const metadata = holdPageMetadata('Account');

export default function AccountPage() {
  return (
    <HoldPage
      eyebrow="ACCOUNT"
      headline="Accounts are not open yet."
      body="Accounts open when the CedarGrowth app ships. No login exists today, so there is nothing to sign into yet."
      onward={[{ label: 'Reserve', href: '/reserve' }]}
    />
  );
}
