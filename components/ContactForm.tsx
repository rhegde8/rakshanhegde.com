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
      className="grid gap-3 border border-[#1e1e1e] bg-[#111111] p-5"
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
        <label className="font-mono text-sm text-[#6b7280]">
          name
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-sm text-[#e2e8f0] transition-colors outline-none focus:border-[#00ff88]"
          />
        </label>
        <label className="font-mono text-sm text-[#6b7280]">
          email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-sm text-[#e2e8f0] transition-colors outline-none focus:border-[#00ff88]"
          />
        </label>
      </div>

      <label className="hidden" aria-hidden="true">
        Company
        <input name="company" type="text" autoComplete="off" tabIndex={-1} />
      </label>

      <label className="font-mono text-sm text-[#6b7280]">
        message
        <textarea
          required
          name="message"
          rows={5}
          className="mt-1 w-full border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-sm text-[#e2e8f0] transition-colors outline-none focus:border-[#00ff88]"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit bg-[#00ff88] px-4 py-2 font-mono text-sm font-semibold text-[#0c0c0c] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "sending..." : "send message"}
      </button>

      {formState.kind !== "idle" ? (
        <p
          className={
            formState.kind === "success"
              ? "font-mono text-sm text-[#28c840]"
              : "font-mono text-sm text-[#ff5f57]"
          }
        >
          {formState.message}
        </p>
      ) : null}
    </form>
  );
}
