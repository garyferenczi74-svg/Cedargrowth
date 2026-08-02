import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

export const metadata = holdPageMetadata('Cart');

export default function CartPage() {
  return (
    <HoldPage
      eyebrow="CART"
      headline="The cart is not active."
      body="Direct online purchase is not offered today. Checkout will exist here once the DNA test kit, which is not a cannabis product, ships."
      onward={[
        { label: 'Reserve', href: '/reserve' },
        { label: 'Find a dispensary', href: '/find' },
      ]}
    />
  );
}
