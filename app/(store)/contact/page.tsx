'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Get in Touch</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Let's Talk</h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-xl text-warmgray">
          We'd love to hear from you. Send us a message and our team will respond within 24 hours.
        </p>
      </header>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        <div className="space-y-5">
          <div className="rounded-2xl border border-forest/10 bg-parchment/50 p-5">
            <div className="flex items-center gap-3 text-forest">
              <Mail size={18} /> <span className="font-display text-lg">Email</span>
            </div>
            <p className="mt-1.5 text-sm text-charcoal">hello@thinnie.in</p>
            <p className="text-xs text-warmgray">Response within 24h</p>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-parchment/50 p-5">
            <div className="flex items-center gap-3 text-forest">
              <Phone size={18} /> <span className="font-display text-lg">Phone</span>
            </div>
            <p className="mt-1.5 text-sm text-charcoal">+91 98765 43210</p>
            <p className="text-xs text-warmgray">Mon-Sat, 10am-7pm IST</p>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-parchment/50 p-5">
            <div className="flex items-center gap-3 text-forest">
              <MapPin size={18} /> <span className="font-display text-lg">Visit Us</span>
            </div>
            <p className="mt-1.5 text-sm text-charcoal">
              Thinnie ( Slim & aane),<br />
              Khewat no. 491, Khatauni No. 583,<br />
              ward no. 10 Lakhpat colony Karnal 132116
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.success('Message sent! We\'ll get back to you soon.')
              ;(e.target as HTMLFormElement).reset()
            }, 700)
          }}
          className="space-y-4 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:col-span-2 md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
          </div>
          <Input label="Subject" name="subject" required />
          <Textarea label="Message" name="message" rows={5} required />
          <Button loading={loading} className="w-full md:w-auto">
            <Send size={16} /> Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
