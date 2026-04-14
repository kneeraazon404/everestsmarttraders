"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitQuoteRequest } from "@/lib/actions/inquiry";
import type { ContactFormState } from "@/lib/actions/inquiry";

const initialState: ContactFormState = { success: false, message: "" };

const productOptions = [
  "Gate Automation",
  "Hotel Lock System",
  "Smart Door Lock",
  "Video Door Phone",
  "Access Control System",
  "Shutter / Curtain Motor",
  "Other / Multiple Products",
];

export function QuoteForm() {
  const [state, formAction, isPending] = useActionState(
    submitQuoteRequest,
    initialState,
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="font-semibold text-foreground text-lg">
          Quote Request Received!
        </h3>
        <p className="text-muted-foreground max-w-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && !state.success && (
        <div
          role="alert"
          className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg"
        >
          {state.message}
        </div>
      )}

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          tabIndex={-1}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Your full name"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.errors?.full_name)}
            aria-describedby={
              state.errors?.full_name ? "quote-full-name-error" : undefined
            }
          />
          {state.errors?.full_name && (
            <p id="quote-full-name-error" className="text-xs text-destructive">
              {state.errors.full_name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="98XXXXXXXX"
            required
            autoComplete="tel"
            aria-invalid={Boolean(state.errors?.phone)}
            aria-describedby={
              state.errors?.phone ? "quote-phone-error" : undefined
            }
          />
          {state.errors?.phone && (
            <p id="quote-phone-error" className="text-xs text-destructive">
              {state.errors.phone[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com (optional)"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product_interest">
          Product / Service Interested In
        </Label>
        <select
          id="product_interest"
          name="product_interest"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
        >
          <option value="">Select a product/service...</option>
          {productOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Location / City</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g., Kathmandu, Lalitpur, Pokhara..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Project Requirements *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Describe your requirements: number of gates, type of property, budget range, special requirements..."
          rows={5}
          required
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? "quote-message-error" : undefined
          }
        />
        {state.errors?.message && (
          <p id="quote-message-error" className="text-xs text-destructive">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        variant="amber"
        size="lg"
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </Button>
    </form>
  );
}
