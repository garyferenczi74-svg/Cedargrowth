'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Small newsletter row (Block 9). Fully labeled. There is no endpoint yet, so
// submitting states that plainly rather than faking a success.

export function NewsletterForm() {
  const [notice, setNotice] = useState('');

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotice('Newsletter sign up is not yet connected.');
        }}
        className="flex items-center gap-3 border-b border-hairline-inverse pb-2"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address for the newsletter
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email address"
          className="flex-1 bg-transparent text-body-m-m md:text-body-m text-inverse placeholder:text-inverse/60 focus-visible:outline-none"
        />
        <button
          type="submit"
          aria-label="Sign up for the newsletter"
          className="text-inverse"
        >
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </form>
      <p
        aria-live="polite"
        className="mt-2 text-caption-m md:text-caption text-inverse/70"
      >
        {notice}
      </p>
    </div>
  );
}
