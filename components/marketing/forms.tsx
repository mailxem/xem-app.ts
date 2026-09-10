"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
import { useState } from "react";
import {
  Plus,
  Eye,
  Copy,
  Pencil,
  MoreVertical,
  FilePenLine,
  CircleCheck,
  Files,
  MousePointerClick,
  Repeat2,
  Code,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useMarketing, useMarketingQuery } from "@/lib/marketing/api";
import type { LeadForm, FormField, Options } from "@/lib/marketing/types";
import {
  PageHeading,
  Metric,
  Status,
  Empty,
  QueryState,
  Modal,
  Field,
  FilterTabs,
} from "./shared";
import { toast } from "sonner";
const initialFields: FormField[] = [
  {
    Label: "Email address",
    FieldType: "EMAIL",
    Required: true,
    mapToContactField: "email",
  },
  {
    Label: "First name",
    FieldType: "TEXT",
    Required: false,
    mapToContactField: "first_name",
  },
];
export function FormsPage() {
  const query = useMarketingQuery<LeadForm[]>("marketing/forms");
  const options = useMarketingQuery<Options>("marketing/options");
  const { request, refresh } = useMarketing();
  const [filter, setFilter] = useState("All Forms");
  const [editing, setEditing] = useState<LeadForm | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<LeadForm | null>(null);
  const [embed, setEmbed] = useState<LeadForm | null>(null);
  const [submissions, setSubmissions] = useState<LeadForm | null>(null);
  const forms = query.data || [];
  const active = forms.filter((f) => f.Status === "PUBLISHED").length;
  const total = forms.reduce((n, f) => n + f.SubmissionCount, 0);
  const views = forms.reduce((n, f) => n + f.ViewCount, 0);
  const edit = (form?: LeadForm) => {
    setEditing(form || null);
    setOpen(true);
  };
  const payload = (f: LeadForm) => ({
    name: f.Name,
    description: f.description,
    listId: f.AddToListID,
    status: f.Status,
    successMessage: f.successMessage,
    buttonText: f.SubmitButtonText,
    fields: f.fields.map((x) => ({
      label: x.Label,
      type: x.FieldType,
      required: x.Required,
      key: x.mapToContactField,
    })),
  });
  const duplicate = async (f: LeadForm) => {
    try {
      await request("marketing/forms", "POST", {
        ...payload(f),
        name: `${f.Name} (copy)`,
        status: "DRAFT",
      });
      await refresh();
      toast.success("Form duplicated as a draft");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const pause = async (f: LeadForm) => {
    try {
      await request(`marketing/forms/${f.id}`, "PUT", {
        ...payload(f),
        status: f.Status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED",
      });
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <>
      <PageHeading
        title="Forms & Lead Capture"
        description="Create beautiful signup forms and capture leads"
        action={
          <Button className={workspaceClassName("product-primary")} onClick={() => edit()}>
            <Plus />
            Create New Form
          </Button>
        }
      />
      <div className={workspaceClassName("metrics-grid")}>
        <Metric
          label="Total Forms"
          value={forms.length.toString().padStart(2, "0")}
          icon={<CircleCheck />}
        />
        <Metric
          label="Total Submissions"
          value={total.toLocaleString()}
          icon={<Files />}
        />
        <Metric
          label="Conversion Rate"
          value={`${views ? ((total / views) * 100).toFixed(1) : "0"}%`}
          icon={<MousePointerClick />}
        />
        <Metric
          label="Active Forms"
          value={active.toString().padStart(2, "0")}
          icon={<Repeat2 />}
          detail={`${forms.length - active} paused / draft`}
        />
      </div>
      <section className={workspaceClassName("product-panel")}>
        <div className={workspaceClassName("panel-toolbar")}>
          <h2>All Forms</h2>
          <FilterTabs
            items={["All Forms", "Active", "Paused"]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <QueryState
          loading={query.isLoading}
          error={query.error}
          retry={() => query.refetch()}
        />
        {!query.isLoading && !query.error && (
          <div className={workspaceClassName("forms-grid")}>
            {forms
              .filter(
                (f) =>
                  filter === "All Forms" ||
                  (filter === "Active"
                    ? f.Status === "PUBLISHED"
                    : f.Status !== "PUBLISHED"),
              )
              .map((f) => (
                <article className={workspaceClassName("form-card")} key={f.id}>
                  <div className={workspaceClassName("form-card-top")}>
                    <span className={workspaceClassName("form-symbol")}>
                      <FilePenLine />
                    </span>
                    <div className={workspaceClassName("card-actions")}>
                      <button
                        className={workspaceClassName("icon-button")}
                        aria-label={`Preview ${f.Name}`}
                        onClick={() => setView(f)}
                      >
                        <Eye />
                      </button>
                      <button
                        className={workspaceClassName("icon-button")}
                        aria-label={`Duplicate ${f.Name}`}
                        onClick={() => duplicate(f)}
                      >
                        <Copy />
                      </button>
                      <button
                        className={workspaceClassName("icon-button")}
                        aria-label={`Edit ${f.Name}`}
                        onClick={() => edit(f)}
                      >
                        <Pencil />
                      </button>
                      <Status value={f.Status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={workspaceClassName("icon-button !border-transparent !shadow-none")}
                            aria-label={`More actions for ${f.Name}`}
                          >
                            <MoreVertical />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSubmissions(f)}>
                            View submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmbed(f)}>
                            Get embed code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => pause(f)}>
                            {f.Status === "PUBLISHED"
                              ? "Pause form"
                              : "Publish form"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h3>{f.Name}</h3>
                  <p className={workspaceClassName("form-description")}>
                    {f.description || "A new way to connect with your audience"}
                  </p>
                  <div className={workspaceClassName("form-stats")}>
                    <div>
                      <span>Submissions</span>
                      <strong>{f.SubmissionCount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Conversion Rate</span>
                      <strong>
                        {f.ViewCount
                          ? ((f.SubmissionCount / f.ViewCount) * 100).toFixed(1)
                          : "0"}
                        %
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
        {!query.isLoading && !query.error && forms.length === 0 && (
          <Empty
            title="A warm welcome starts here"
            description="Build your first signup form. Every new lead goes straight into your audience and CRM."
            action={
              <Button className={workspaceClassName("product-primary")} onClick={() => edit()}>
                <Plus />
                Create your first form
              </Button>
            }
          />
        )}
      </section>
      <FormEditor
        key={editing?.id || `new-${open}`}
        open={open}
        onOpenChange={setOpen}
        form={editing}
        options={options.data}
      />
      <Modal
        open={!!view}
        onOpenChange={() => setView(null)}
        title="Form preview"
        description="This is how your form will appear to visitors."
      >
        {view && (
          <FormPreview
            name={view.Name}
            description={view.description}
            fields={view.fields}
            button={view.SubmitButtonText}
          />
        )}
      </Modal>
      <Modal
        open={!!embed}
        onOpenChange={() => setEmbed(null)}
        title="Share your form"
        description="Publish the form first, then share its hosted page or embed it on your site."
      >
        {embed && (
          <>
            <Field label="Hosted form">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/f/${embed.Slug}`}
              />
            </Field>
            <Field label="Embed code">
              <textarea
                rows={4}
                readOnly
                value={`<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/f/${embed.Slug}" title="Signup form" width="100%" height="640" style="border:0" loading="lazy"></iframe>`}
              />
            </Field>
            <Button
              className={workspaceClassName("product-primary")}
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/f/${embed.Slug}`,
                );
                toast.success("Link copied");
              }}
            >
              <Copy />
              Copy form link
            </Button>
          </>
        )}
      </Modal>
      {submissions && (
        <Submissions form={submissions} close={() => setSubmissions(null)} />
      )}
    </>
  );
}
function FormPreview({
  name,
  description,
  fields,
  button,
}: {
  name: string;
  description: string;
  fields: FormField[];
  button: string;
}) {
  return (
    <div className={workspaceClassName("lead-form-preview")}>
      <h2>{name || "Let’s stay in touch"}</h2>
      <p>{description || "A little inspiration, delivered to your inbox."}</p>
      <div className={workspaceClassName("product-form")}>
        {fields.map((f) => (
          <Field
            key={f.mapToContactField}
            label={`${f.Label}${f.Required ? " *" : ""}`}
          >
            <input
              disabled
              placeholder={
                f.FieldType === "EMAIL" ? "you@example.com" : f.Label
              }
            />
          </Field>
        ))}
        <label className={workspaceClassName("consent-row")}>
          <input type="checkbox" disabled />I agree to receive emails and
          understand I can unsubscribe at any time.
        </label>
        <Button className={workspaceClassName("product-primary")} disabled>
          {button || "Subscribe"}
        </Button>
      </div>
    </div>
  );
}
function FormEditor({
  open,
  onOpenChange,
  form,
  options,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: LeadForm | null;
  options?: Options;
}) {
  const { request, refresh } = useMarketing();
  const [name, setName] = useState(form?.Name || "");
  const [description, setDescription] = useState(form?.description || "");
  const [listId, setListId] = useState(form?.AddToListID || "");
  const [fields, setFields] = useState<FormField[]>(
    form?.fields || initialFields,
  );
  const [button, setButton] = useState(form?.SubmitButtonText || "Subscribe");
  const [success, setSuccess] = useState(
    form?.successMessage || "You’re on the list. Thanks for joining us!",
  );
  const [status, setStatus] = useState(form?.Status || "DRAFT");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await request(
        `marketing/forms${form ? `/${form.id}` : ""}`,
        form ? "PUT" : "POST",
        {
          name,
          description,
          listId,
          status,
          successMessage: success,
          buttonText: button,
          fields: fields.map((f) => ({
            label: f.Label,
            type: f.FieldType,
            required: f.Required,
            key: f.mapToContactField,
          })),
        },
      );
      await refresh();
      onOpenChange(false);
      toast.success(
        status === "PUBLISHED" ? "Your form is live" : "Form saved",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={form ? "Edit form" : "Create a new form"}
      description="Design a welcoming first impression. Connect every signup to your audience."
      wide
    >
      <form onSubmit={save} className={workspaceClassName("product-form")}>
        <div className={workspaceClassName("editor-columns")}>
          <div className={workspaceClassName("product-form")}>
            <Field label="Form name">
              <input
                required
                maxLength={120}
                placeholder="e.g. The weekly newsletter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={2}
                maxLength={500}
                placeholder="Tell people what they’re signing up for"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <Field label="Add subscribers to">
              <select
                required
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              >
                <option value="">Choose an audience</option>
                {options?.lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <span className="text-xs text-muted-foreground">Form fields</span>
              {fields.map((f, i) => (
                <div className={workspaceClassName("form-field-row")} key={f.mapToContactField}>
                  <input
                    aria-label={`Field label ${i + 1}`}
                    className={workspaceClassName("product-input")}
                    value={f.Label}
                    onChange={(e) =>
                      setFields(
                        fields.map((x, j) =>
                          i === j ? { ...x, Label: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <label className={workspaceClassName("consent-row")}>
                    <input
                      type="checkbox"
                      checked={f.Required}
                      disabled={f.mapToContactField === "email"}
                      onChange={(e) =>
                        setFields(
                          fields.map((x, j) =>
                            i === j ? { ...x, Required: e.target.checked } : x,
                          ),
                        )
                      }
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    className={workspaceClassName("icon-button")}
                    aria-label={`Remove ${f.Label}`}
                    disabled={f.mapToContactField === "email"}
                    onClick={() => setFields(fields.filter((_, j) => i !== j))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <select
                className={workspaceClassName("product-input mt-3")}
                aria-label="Add field"
                value=""
                onChange={(e) => {
                  const key = e.target.value;
                  setFields([
                    ...fields,
                    {
                      Label: key
                        .replaceAll("_", " ")
                        .replace(/^./, (c) => c.toUpperCase()),
                      FieldType:
                        key === "message"
                          ? "TEXTAREA"
                          : key === "phone"
                            ? "PHONE"
                            : "TEXT",
                      Required: false,
                      mapToContactField: key,
                    },
                  ]);
                }}
              >
                <option value="">+ Add a field</option>
                {["first_name", "last_name", "company", "phone", "message"]
                  .filter((k) => !fields.some((f) => f.mapToContactField === k))
                  .map((k) => (
                    <option key={k} value={k}>
                      {k.replaceAll("_", " ")}
                    </option>
                  ))}
              </select>
            </div>
            <div className={workspaceClassName("form-row")}>
              <Field label="Button text">
                <input
                  required
                  maxLength={60}
                  value={button}
                  onChange={(e) => setButton(e.target.value)}
                />
              </Field>
              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Paused</option>
                </select>
              </Field>
            </div>
            <Field label="Success message">
              <input
                required
                maxLength={500}
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
              />
            </Field>
          </div>
          <div className={workspaceClassName("editor-preview")}>
            <div className={workspaceClassName("editor-preview-label")}>Live preview</div>
            <FormPreview
              name={name}
              description={description}
              fields={fields}
              button={button}
            />
          </div>
        </div>
        {error && (
          <div role="alert" className={workspaceClassName("product-error")}>
            {error}
          </div>
        )}
        <div className={workspaceClassName("modal-actions")}>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className={workspaceClassName("product-primary")} disabled={busy}>
            {busy
              ? "Saving…"
              : status === "PUBLISHED"
                ? "Save & publish"
                : "Save form"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function Submissions({ form, close }: { form: LeadForm; close: () => void }) {
  const q = useMarketingQuery<any[]>(`marketing/forms/${form.id}/submissions`);
  return (
    <Modal
      open
      onOpenChange={close}
      title={`${form.Name} submissions`}
      description="The 200 most recent submissions, including repeat signups."
    >
      <QueryState loading={q.isLoading} error={q.error} />
      {q.data?.length === 0 && (
        <Empty
          title="No submissions yet"
          description="Share your form to start the conversation."
        />
      )}
      <div className={workspaceClassName("table-wrap")}>
        <table className={workspaceClassName("product-table")}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.map((s) => (
              <tr key={s.id}>
                <td>{s.EmailAddress}</td>
                <td>{new Date(s.SubmittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
