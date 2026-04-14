"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactInquiry } from "@/lib/actions/inquiry";
import type { ContactFormState } from "@/lib/actions/inquiry";

const initialState: ContactFormState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactInquiry,
    initialState,
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="font-semibold text-foreground text-lg">Message Sent!</h3>
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
            placeholder="Ram Bahadur Sharma"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.errors?.full_name)}
            aria-describedby={
              state.errors?.full_name ? "full_name-error" : undefined
            }
          />
          {state.errors?.full_name && (
            <p id="full_name-error" className="text-xs text-destructive">
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
            aria-describedby={state.errors?.phone ? "phone-error" : undefined}
          />
          {state.errors?.phone && (
            <p id="phone-error" className="text-xs text-destructive">
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
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
        />
        {state.errors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry_type">Inquiry Type</Label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
        >
          <option value="general">General Inquiry</option>
          <option value="quote">Request a Quote</option>
          <option value="support">Technical Support</option>
          <option value="partnership">Business Partnership</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="e.g., Gate automation for my house"
          required
          aria-invalid={Boolean(state.errors?.subject)}
          aria-describedby={state.errors?.subject ? "subject-error" : undefined}
        />
        {state.errors?.subject && (
          <p id="subject-error" className="text-xs text-destructive">
            {state.errors.subject[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your requirements, location, budget, timeline..."
          rows={5}
          required
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        {state.errors?.message && (
          <p id="message-error" className="text-xs text-destructive">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
