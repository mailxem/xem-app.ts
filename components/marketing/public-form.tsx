"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
import { useEffect, useState } from "react";
import { Check, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./shared";
import type { FormField } from "@/lib/marketing/types";
const origin = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/api\/v1\/?$/,
  "",
);
export function PublicForm({ slug }: { slug: string }) {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    fields: FormField[];
    buttonText: string;
    successMessage: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [requestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${origin}/public/forms/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("This form is not available right now.");
        setForm(await r.json());
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [slug]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const fields = Object.fromEntries(
      (form?.fields || []).map((f) => [
        f.mapToContactField,
        String(data.get(f.mapToContactField) || ""),
      ]),
    );
    try {
      const res = await fetch(
        `${origin}/public/forms/${encodeURIComponent(slug)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields,
            consent: data.get("consent") === "on",
            website: data.get("website"),
            requestId,
          }),
        },
      );
      const body = await res.json();
      if (!res.ok)
        throw new Error(
          body.error || "We couldn’t submit your form. Please try again.",
        );
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={workspaceClassName("public-form-page")}>
      <div className={workspaceClassName("public-form-card")}>
        {done ? (
          <div className={workspaceClassName("product-empty !p-4")}>
            <Check size={32} />
            <h1>You’re on the list.</h1>
            <p>{form?.successMessage || "Thanks for joining us!"}</p>
          </div>
        ) : form ? (
          <>
            <h1>{form.name}</h1>
            <p>{form.description}</p>
            <form className={workspaceClassName("product-form")} onSubmit={submit}>
              {form.fields.map((f) => (
                <Field
                  key={f.mapToContactField}
                  label={`${f.Label}${f.Required ? " *" : ""}`}
                >
                  {f.FieldType === "TEXTAREA" ? (
                    <textarea
                      name={f.mapToContactField}
                      required={f.Required}
                      maxLength={2000}
                    />
                  ) : (
                    <input
                      name={f.mapToContactField}
                      required={f.Required}
                      maxLength={2000}
                      type={
                        f.FieldType === "EMAIL"
                          ? "email"
                          : f.FieldType === "PHONE"
                            ? "tel"
                            : "text"
                      }
                    />
                  )}
                </Field>
              ))}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px" }}
              >
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className={workspaceClassName("consent-row")}>
                <input type="checkbox" name="consent" required />I agree to
                receive emails and understand that I can unsubscribe at any
                time.
              </label>
              {error && (
                <div className={workspaceClassName("product-error")} role="alert">
                  {error}
                </div>
              )}
              <Button className={workspaceClassName("product-primary")} disabled={busy}>
                {busy ? "Submitting…" : form.buttonText || "Subscribe"}
              </Button>
            </form>
          </>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <div role="status" className={workspaceClassName("product-empty")}>
            <Loader2 className="animate-spin" />
            Loading form…
          </div>
        )}
        <p className="!mb-0 !mt-7 !text-center !text-[10px]">
          Powered by Xem
        </p>
      </div>
    </div>
  );
}
