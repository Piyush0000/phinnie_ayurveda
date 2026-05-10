'use client'

import { useState } from 'react'
import { Send, Star, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export default function SubmitReviewPage() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          rating,
          comment: comment.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not submit review')
        return
      }
      setSubmitted(true)
      toast.success('Thanks! Your review is awaiting approval.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container-narrow py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-forest/10 bg-cream p-10 text-center shadow-warm">
          <CheckCircle2 size={56} className="mx-auto text-forest" />
          <h1 className="mt-4 font-display text-3xl text-charcoal">Thank you!</h1>
          <p className="mt-3 font-accent text-lg text-warmgray">
            Your review has been submitted and will appear on the site once approved by our team.
          </p>
          <Button className="mt-6" onClick={() => (window.location.href = '/')}>
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Tell your story</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Share Your Experience</h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-lg text-warmgray">
          Your words help others discover the Ayurvedic ritual. Reviews are reviewed by our team
          before going live.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-2xl space-y-5 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:p-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
            required
            minLength={2}
          />
          <Input
            label="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Mumbai"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Rating</label>
          <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (hoverRating || rating) >= n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                  className="transition"
                >
                  <Star
                    size={32}
                    className={cn(
                      filled ? 'fill-turmeric text-turmeric' : 'text-warmgray/30',
                    )}
                  />
                </button>
              )
            })}
            <span className="ml-2 text-sm text-warmgray">{rating} of 5</span>
          </div>
        </div>

        <Textarea
          label="Your review"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you love? How has it helped you?"
          required
          minLength={10}
          maxLength={2000}
        />
        <p className="text-xs text-warmgray">
          By submitting, you agree to let us share your review on our site. Don't include personal
          contact details.
        </p>

        <Button type="submit" loading={loading} className="w-full md:w-auto">
          <Send size={16} /> Submit review
        </Button>
      </form>
    </div>
  )
}
