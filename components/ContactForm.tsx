"use client";

import { useState } from "react";

type FormState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const initialState: FormState = {
  kind: "idle",
  message: "",
};

export function ContactForm(): React.JSX.Element {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="surface-panel grid gap-3 p-4"
      onSubmit={async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const payload = {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
          company: String(formData.get("company") ?? ""),
        };

        setIsSubmitting(true);
        setFormState(initialState);

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const data = (await response.json()) as { error?: string };
            throw new Error(data.error ?? "Unable to submit message.");
          }

          event.currentTarget.reset();
          setFormState({
            kind: "success",
            message: "Message received. I will get back to you soon.",
          });
        } catch (error) {
          setFormState({
            kind: "error",
            message:
              error instanceof Error ? error.message : "Unexpected error while sending message.",
          });
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-muted text-sm">
          Name
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="border-border bg-bg ring-accent-1/40 mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </label>
        <label className="text-muted text-sm">
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="border-border bg-bg ring-accent-1/40 mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </label>
      </div>

      <label className="hidden" aria-hidden="true">
        Company
        <input name="company" type="text" autoComplete="off" tabIndex={-1} />
      </label>

      <label className="text-muted text-sm">
        Message
        <textarea
          required
          name="message"
          rows={5}
          className="border-border bg-bg ring-accent-1/40 mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent-1 text-bg w-fit rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {formState.kind !== "idle" ? (
        <p
          className={formState.kind === "success" ? "text-success text-sm" : "text-danger text-sm"}
        >
          {formState.message}
        </p>
      ) : null}
    </form>
  );
}
