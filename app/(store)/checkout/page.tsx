import CheckoutForm from '@/components/store/CheckoutForm'

export const metadata = { title: 'Checkout — Phinnie Aurvadic' }

export default function CheckoutPage() {
  return (
    <div className="container-wide py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-charcoal md:text-5xl">Checkout</h1>
        <p className="mt-2 font-accent text-lg text-warmgray">Almost there! Complete your details to place your order.</p>
      </header>
      <CheckoutForm />
    </div>
  )
}
