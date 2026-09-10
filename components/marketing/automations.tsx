"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Plus,
  Workflow as WorkflowIcon,
  Mail,
  Clock,
  GitBranch,
  Flag,
  Zap,
  ArrowLeft,
  Check,
  Play,
  Pause,
  Save,
  Trash2,
  MousePointer2,
  MoreHorizontal,
  ArrowUpRight,
  History,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarketing, useMarketingQuery } from "@/lib/marketing/api";
import type {
  Workflow,
  Options,
  WorkflowNode,
  Contact,
} from "@/lib/marketing/types";
import {
  PageHeading,
  Metric,
  QueryState,
  Empty,
  Modal,
  Field,
  Status,
  FilterTabs,
} from "./shared";
import { toast } from "sonner";
const icons: Record<string, typeof Zap> = {
  START: Zap,
  EMAIL: Mail,
  WAIT: Clock,
  CONDITION: GitBranch,
  EXIT: Flag,
};
const labels: Record<string, string> = {
  START: "Trigger",
  EMAIL: "Send an email",
  WAIT: "Wait for a while",
  CONDITION: "Split into paths",
  EXIT: "Finish workflow",
};
const triggerLabels: Record<string, string> = {
  manual: "Started manually",
  "contact.created": "New contact added",
  "email.opened": "Email opened",
  "email.clicked": "Email link clicked",
};
function StepNode({
  data,
  selected,
}: {
  data: Record<string, any>;
  selected?: boolean;
}) {
  const Icon = icons[data.kind] || Zap;
  return (
    <div className={workspaceClassName(`workflow-step ${selected ? "selected" : ""}`)}>
      <Handle type="target" position={Position.Top} />
      <div className={workspaceClassName(`step-icon step-${data.kind.toLowerCase()}`)}>
        <Icon size={19} />
      </div>
      <div>
        <small>
          {data.kind === "START"
            ? "WHEN THIS HAPPENS"
            : data.kind === "EXIT"
              ? "ALL DONE"
              : `THEN DO THIS`}
        </small>
        <strong>{data.label || labels[data.kind]}</strong>
        <p>{data.summary || "Click to configure this step"}</p>
      </div>
      <ChevronRight size={15} className={workspaceClassName("step-chevron")} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
const nodeTypes = { step: StepNode };
function starter(kind = "blank"): Workflow {
  const start = crypto.randomUUID(),
    exit = crypto.randomUUID(),
    email = crypto.randomUUID(),
    wait = crypto.randomUUID();
  const nodes: WorkflowNode[] = [
    { id: start, type: "START", data: { position: { x: 0, y: 0 } } },
  ];
  if (kind !== "blank")
    nodes.push({
      id: email,
      type: "EMAIL",
      data: { position: { x: 0, y: 165 } },
    });
  if (kind === "nurture")
    nodes.push({
      id: wait,
      type: "WAIT",
      data: { duration: "48h", position: { x: 0, y: 330 } },
    });
  nodes.push({
    id: exit,
    type: "EXIT",
    data: { position: { x: 0, y: 165 * nodes.length } },
  });
  return {
    id: "",
    name:
      kind === "welcome"
        ? "A warm welcome"
        : kind === "nurture"
          ? "Stay in the conversation"
          : "Untitled automation",
    description: "",
    triggerEvent: kind === "blank" ? "manual" : "contact.created",
    isActive: false,
    nodes,
    edges: nodes
      .slice(1)
      .map((n, i) => ({ sourceId: nodes[i].id, targetId: n.id, label: "" })),
    updatedAt: "",
  };
}
export function AutomationsPage() {
  const q = useMarketingQuery<Workflow[] | { data: Workflow[] }>("automations");
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [tab, setTab] = useState("All automations");
  const rows = Array.isArray(q.data) ? q.data : q.data?.data || [];
  if (editing)
    return (
      <AutomationBuilder
        key={editing.id || editing.name}
        initial={editing}
        close={() => setEditing(null)}
      />
    );
  return (
    <>
      <PageHeading
        title="A thoughtful journey. On autopilot."
        description="Turn the right moments into meaningful conversations."
        action={
          <Button
            className={workspaceClassName("product-primary")}
            onClick={() => setEditing(starter())}
          >
            <Plus />
            Create Automation
          </Button>
        }
      />
      <div className={workspaceClassName("automation-starters")}>
        <button onClick={() => setEditing(starter("welcome"))}>
          <span className={workspaceClassName("starter-icon")}>
            <Mail />
          </span>
          <div>
            <strong>Welcome new subscribers</strong>
            <p>A warm introduction, right on time.</p>
          </div>
          <ArrowUpRight />
        </button>
        <button onClick={() => setEditing(starter("nurture"))}>
          <span className={workspaceClassName("starter-icon peach")}>
            <Clock />
          </span>
          <div>
            <strong>Build a lasting connection</strong>
            <p>Bring a little intention to your follow-up.</p>
          </div>
          <ArrowUpRight />
        </button>
      </div>
      <section className={workspaceClassName("product-panel")}>
        <div className={workspaceClassName("panel-toolbar")}>
          <h2>
            Your automations{" "}
            <small className="text-muted-foreground text-xs ml-2">
              {rows.length}
            </small>
          </h2>
          <FilterTabs
            items={["All automations", "Active", "Drafts"]}
            value={tab}
            onChange={setTab}
          />
        </div>
        <QueryState
          loading={q.isLoading}
          error={q.error}
          retry={() => q.refetch()}
        />
        {!q.isLoading && !q.error && rows.length === 0 && (
          <Empty
            title="Make every moment count"
            description="Start with a ready-made journey or build a workflow from scratch."
            action={
              <Button
                className={workspaceClassName("product-primary")}
                onClick={() => setEditing(starter())}
              >
                <Plus />
                Build your first automation
              </Button>
            }
          />
        )}
        <div className={workspaceClassName("table-wrap")}>
          <table className={workspaceClassName("product-table")}>
            <thead>
              <tr>
                <th>Automation</th>
                <th>Status</th>
                <th>Starts when</th>
                <th>Steps</th>
                <th>Last edited</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows
                .filter(
                  (a) =>
                    tab === "All automations" ||
                    (tab === "Active" ? a.isActive : !a.isActive),
                )
                .map((a) => (
                  <tr key={a.id}>
                    <td>
                      <button
                        className={workspaceClassName("newsletter-title text-left")}
                        onClick={() => setEditing(a)}
                      >
                        <span>
                          <WorkflowIcon size={18} />
                        </span>
                        <div>
                          <strong>{a.name}</strong>
                          <small>
                            {a.description || "A connected customer journey"}
                          </small>
                        </div>
                      </button>
                    </td>
                    <td>
                      <Status value={a.isActive ? "PUBLISHED" : "DRAFT"} />
                    </td>
                    <td>
                      {triggerLabels[a.triggerEvent] || "Started manually"}
                    </td>
                    <td>{a.nodes?.length || 0} steps</td>
                    <td>
                      {a.updatedAt
                        ? new Date(a.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        aria-label={`Edit ${a.name}`}
                        className={workspaceClassName("icon-button")}
                        onClick={() => setEditing(a)}
                      >
                        <ArrowUpRight />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
export function AutomationBuilder({
  initial,
  close,
}: {
  initial: Workflow;
  close: () => void;
}) {
  const options = useMarketingQuery<Options>("marketing/options");
  const { request, refresh } = useMarketing();
  const [id, setID] = useState(initial.id);
  const [name, setName] = useState(initial.name);
  const [trigger, setTrigger] = useState(initial.triggerEvent || "manual");
  const [active, setActive] = useState(initial.isActive);
  const [selected, setSelected] = useState(
    initial.nodes?.find((n) => n.type === "START")?.id || "",
  );
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [runs, setRuns] = useState(false);
  const [test, setTest] = useState(false);
  const [leave, setLeave] = useState(false);
  const toFlow = (n: WorkflowNode, i: number): Node => ({
    id: n.id,
    type: "step",
    position: n.data?.position || { x: 0, y: i * 165 },
    data: { ...n.data, kind: n.type, label: labels[n.type] },
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(
    (initial.nodes || []).filter((n) => !(n as any).isDeleted).map(toFlow),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    (initial.edges || []).map(
      (e, i): Edge => ({
        id: e.id || `edge-${i}`,
        source: e.sourceId,
        target: e.targetId,
        label: e.label,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
        style: { stroke: "#bcb0d0", strokeWidth: 1.5 },
      }),
    ),
  );
  const current = nodes.find((n) => n.id === selected);
  const config = current?.data || {};
  const kind = String(config.kind || "");
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const update = (values: Record<string, any>) => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === selected ? { ...n, data: { ...n.data, ...values } } : n,
      ),
    );
    setDirty(true);
  };
  const serialized = () => ({
    name,
    description: initial.description || "",
    triggerEvent: trigger,
    nodes: nodes.map((n) => {
      const { kind, label, summary, ...data } = n.data;
      return { id: n.id, type: kind, data: { ...data, position: n.position } };
    }),
    edges: edges.map((e) => ({
      sourceId: e.source,
      targetId: e.target,
      label: typeof e.label === "string" ? e.label : "",
    })),
  });
  async function save() {
    const result = await request<Workflow>(
      `automations${id ? `/${id}` : ""}`,
      id ? "PUT" : "POST",
      serialized(),
    );
    setID(result.id);
    setDirty(false);
    await refresh();
    return result.id;
  }
  async function action(type: "save" | "validate" | "publish" | "pause") {
    setBusy(true);
    setError("");
    try {
      if (type === "pause") {
        await request(`automations/${id}/deactivate`, "POST", {});
        setActive(false);
        await refresh();
        toast.success("Workflow paused");
      } else if (type === "validate") {
        await request("automations/validate", "POST", serialized());
        toast.success("All steps and connections are valid");
      } else {
        const saved = await save();
        if (type === "publish") {
          await request(`automations/${saved}/activate`, "POST", {});
          setActive(true);
          await refresh();
          toast.success("Workflow is now active");
        } else toast.success("Draft saved");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const addStep = (type: string) => {
    if (active) return;
    const source =
      current?.data.kind !== "EXIT"
        ? current
        : nodes.find((n) => n.data.kind === "START");
    if (!source) return;
    const nextEdges = edges.filter((e) => e.source === source.id);
    if (nextEdges.length > 1) {
      setError("Select a step within a branch before adding another step.");
      return;
    }
    const nodeID = crypto.randomUUID();
    const next = nextEdges[0];
    const newNode: Node = {
      id: nodeID,
      type: "step",
      position: { x: source.position.x, y: source.position.y + 165 },
      data: {
        kind: type,
        label: labels[type],
        ...(type === "WAIT" ? { duration: "24h" } : {}),
        ...(type === "CONDITION"
          ? {
              operator: "AND",
              conditions: [
                { variable: "contact_email", operator: "contains", value: "" },
              ],
            }
          : {}),
      },
    };
    let newNodes = [
      ...nodes.map((n) =>
        n.position.y > source.position.y
          ? { ...n, position: { ...n.position, y: n.position.y + 165 } }
          : n,
      ),
      newNode,
    ];
    let newEdges = edges.filter((e) => e.source !== source.id);
    newEdges.push({
      id: crypto.randomUUID(),
      source: source.id,
      target: nodeID,
      type: "smoothstep",
    });
    if (type === "CONDITION") {
      const falseID = crypto.randomUUID();
      newNodes.push({
        id: falseID,
        type: "step",
        position: { x: source.position.x + 380, y: source.position.y + 340 },
        data: { kind: "EXIT", label: labels.EXIT },
      });
      newEdges.push({
        id: crypto.randomUUID(),
        source: nodeID,
        target: falseID,
        label: "false",
        type: "smoothstep",
      });
      if (next)
        newEdges.push({
          ...next,
          id: crypto.randomUUID(),
          source: nodeID,
          label: "true",
        });
    } else if (next)
      newEdges.push({ ...next, id: crypto.randomUUID(), source: nodeID });
    setNodes(newNodes);
    setEdges(newEdges);
    setSelected(nodeID);
    setDirty(true);
  };
  const remove = () => {
    if (!current || kind === "START" || kind === "EXIT") return;
    const ins = edges.filter((e) => e.target === selected);
    const outs = edges.filter((e) => e.source === selected);
    if (ins.length !== 1 || outs.length !== 1) {
      setError(
        "Reconnect or remove this branch’s connections before deleting the step.",
      );
      return;
    }
    setEdges([
      ...edges.filter((e) => e.source !== selected && e.target !== selected),
      { ...ins[0], id: crypto.randomUUID(), target: outs[0].target },
    ]);
    setNodes(nodes.filter((n) => n.id !== selected));
    setSelected(ins[0].source);
    setDirty(true);
  };
  const displayNodes = nodes.map((n) => ({
    ...n,
    selected: n.id === selected,
    data: {
      ...n.data,
      summary:
        n.data.kind === "START"
          ? triggerLabels[trigger]
          : n.data.kind === "EMAIL"
            ? options.data?.templates.find((t) => t.id === n.data.templateId)
                ?.name || "Choose a template and sender"
            : n.data.kind === "WAIT"
              ? `Pause for ${n.data.duration || "…"}`
              : n.data.kind === "CONDITION"
                ? "Continue based on a condition"
                : "End this journey",
    },
  }));
  return (
    <div className={workspaceClassName("automation-editor")}>
      <div className={workspaceClassName("builder-toolbar")}>
        <button
          className={workspaceClassName("icon-button")}
          aria-label="Back to automations"
          onClick={() => (dirty ? setLeave(true) : close())}
        >
          <ArrowLeft />
        </button>
        <input
          aria-label="Automation name"
          value={name}
          maxLength={120}
          disabled={active}
          onChange={(e) => {
            setName(e.target.value);
            setDirty(true);
          }}
        />
        <Status value={active ? "PUBLISHED" : "DRAFT"} />
        <span className={workspaceClassName("save-state")}>
          {dirty
            ? "Unsaved changes"
            : id
              ? "All changes saved"
              : "New workflow"}
        </span>
        <div className={workspaceClassName("builder-toolbar-actions")}>
          <Button
            variant="outline"
            size="sm"
            disabled={!id}
            onClick={() => setRuns(true)}
          >
            <History />
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => action("validate")}
          >
            <ShieldCheck />
            Validate
          </Button>
          {active ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setTest(true)}>
                <Play />
                Run
              </Button>
              <Button
                className={workspaceClassName("product-primary")}
                disabled={busy}
                onClick={() => action("pause")}
              >
                <Pause />
                Pause
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => action("save")}
              >
                <Save />
                Save draft
              </Button>
              <Button
                className={workspaceClassName("product-primary")}
                disabled={busy}
                onClick={() => action("publish")}
              >
                <Play />
                Publish
              </Button>
            </>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className={workspaceClassName("product-error builder-error")}>
          {error}
        </div>
      )}
      {active && (
        <div className={workspaceClassName("builder-notice")}>
          This workflow is active. Pause it before editing steps or connections.
        </div>
      )}
      <div className={workspaceClassName("builder-workspace")}>
        <aside className={workspaceClassName("step-palette")}>
          <div className={workspaceClassName("eyebrow")}>Build your journey</div>
          <h3>One step at a time.</h3>
          <p>Add an action after the selected step.</p>
          {["EMAIL", "WAIT", "CONDITION"].map((type) => {
            const Icon = icons[type];
            return (
              <button
                key={type}
                disabled={active}
                onClick={() => addStep(type)}
              >
                <span className={workspaceClassName(`step-icon step-${type.toLowerCase()}`)}>
                  <Icon size={17} />
                </span>
                <span>
                  <strong>{labels[type]}</strong>
                  <small>
                    {type === "EMAIL"
                      ? "A message that matters"
                      : type === "WAIT"
                        ? "Give it a little time"
                        : "Let the journey branch"}
                  </small>
                </span>
                <Plus size={14} />
              </button>
            );
          })}
          <div className={workspaceClassName("palette-hint")}>
            <MousePointer2 size={17} />
            <p>
              Drag steps to arrange them. Connect the dots to change the
              journey.
            </p>
          </div>
        </aside>
        <div className={workspaceClassName("workflow-canvas")}>
          <div className={workspaceClassName("canvas-label")}>
            <WorkflowIcon size={14} />
            WORKFLOW EDITOR
          </div>
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={(changes) => {
              if (active) return;
              onNodesChange(changes);
              if (changes.some((c) => c.type === "position" && c.dragging))
                setDirty(true);
            }}
            onEdgesChange={(changes) => {
              if (active) return;
              onEdgesChange(changes);
              if (changes.some((c) => c.type === "remove")) setDirty(true);
            }}
            onConnect={(connection: Connection) => {
              if (active || connection.source === connection.target) return;
              setEdges((es) =>
                addEdge(
                  {
                    ...connection,
                    id: crypto.randomUUID(),
                    type: "smoothstep",
                    label: "",
                  },
                  es,
                ),
              );
              setDirty(true);
            }}
            onNodeClick={(_, n) => setSelected(n.id)}
            fitView
            fitViewOptions={{ padding: 0.4, maxZoom: 0.9 }}
            minZoom={0.25}
            maxZoom={1.5}
            nodesDraggable={!active}
            nodesConnectable={!active}
            deleteKeyCode={null}
          >
            <Background gap={20} size={1.2} color="#e5deed" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
        <aside className={workspaceClassName("step-inspector")}>
          <div className={workspaceClassName("inspector-title")}>
            <span className={workspaceClassName(`step-icon step-${kind.toLowerCase()}`)}>
              {kind &&
                (() => {
                  const Icon = icons[kind] || Zap;
                  return <Icon size={20} />;
                })()}
            </span>
            <div>
              <small>STEP SETTINGS</small>
              <h3>{labels[kind] || "Select a step"}</h3>
            </div>
          </div>
          <fieldset disabled={active} className={workspaceClassName("product-form")}>
            {kind === "START" && (
              <>
                <Field label="Start this workflow when">
                  <select
                    value={trigger}
                    onChange={(e) => {
                      setTrigger(e.target.value);
                      setDirty(true);
                    }}
                  >
                    {Object.entries(triggerLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <p className={workspaceClassName("inspector-help")}>
                  Only matching events in your workspace will start this
                  workflow.
                </p>
              </>
            )}
            {kind === "EMAIL" && (
              <>
                <Field label="Email template">
                  <select
                    value={String(config.templateId || "")}
                    onChange={(e) => update({ templateId: e.target.value })}
                  >
                    <option value="">Choose a template</option>
                    {options.data?.templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Send from">
                  <select
                    value={String(config.smtpConfigId || "")}
                    onChange={(e) => update({ smtpConfigId: e.target.value })}
                  >
                    <option value="">Choose a sender</option>
                    {options.data?.senders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fromEmail}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Subject override"
                  hint="Leave blank to use the template subject."
                >
                  <input
                    maxLength={200}
                    value={String(config.subject || "")}
                    onChange={(e) => update({ subject: e.target.value })}
                  />
                </Field>
              </>
            )}
            {kind === "EMAIL" && <Field label="Sender postal address" hint="Required for marketing templates; included with an unsubscribe link."><textarea maxLength={500} value={String(config.postalAddress || "")} onChange={e => update({postalAddress:e.target.value})}/></Field>}
            {kind === "WAIT" && (
              <Field
                label="How long should we wait?"
                hint="Use s for seconds, m for minutes, or h for hours. For two days, enter 48h."
              >
                <input
                  required
                  value={String(config.duration || "")}
                  onChange={(e) => update({ duration: e.target.value })}
                />
              </Field>
            )}
            {kind === "CONDITION" && (
              <>
                <Field label="Contact variable">
                  <select
                    value={
                      (config.conditions as any[])?.[0]?.variable ||
                      "contact_email"
                    }
                    onChange={(e) =>
                      update({
                        conditions: [
                          {
                            ...(config.conditions as any[])?.[0],
                            variable: e.target.value,
                          },
                        ],
                      })
                    }
                  >
                    <option value="contact_email">Email address</option>
                    <option value="contact_first_name">First name</option>
                    <option value="contact_last_name">Last name</option>
                  </select>
                </Field>
                <Field label="Condition">
                  <select
                    value={
                      (config.conditions as any[])?.[0]?.operator || "contains"
                    }
                    onChange={(e) =>
                      update({
                        conditions: [
                          {
                            ...(config.conditions as any[])?.[0],
                            operator: e.target.value,
                          },
                        ],
                      })
                    }
                  >
                    <option value="contains">Contains</option>
                    <option value="==">Equals</option>
                    <option value="!=">Does not equal</option>
                    <option value="exists">Exists</option>
                  </select>
                </Field>
                <Field label="Value">
                  <input
                    value={(config.conditions as any[])?.[0]?.value || ""}
                    onChange={(e) =>
                      update({
                        conditions: [
                          {
                            ...(config.conditions as any[])?.[0],
                            value: e.target.value,
                          },
                        ],
                      })
                    }
                  />
                </Field>
                {edges
                  .filter((e) => e.source === selected)
                  .map((e) => (
                    <Field
                      key={e.id}
                      label={`Path to ${labels[String(nodes.find((n) => n.id === e.target)?.data.kind)] || "step"}`}
                    >
                      <select
                        value={String(e.label || "")}
                        onChange={(event) => {
                          setEdges((es) =>
                            es.map((edge) =>
                              edge.id === e.id
                                ? { ...edge, label: event.target.value }
                                : edge,
                            ),
                          );
                          setDirty(true);
                        }}
                      >
                        <option value="">Choose path</option>
                        <option value="true">Condition is true</option>
                        <option value="false">Condition is false</option>
                      </select>
                    </Field>
                  ))}
              </>
            )}
            {kind === "EXIT" && (
              <p className={workspaceClassName("inspector-help")}>
                Contacts reaching this step finish their journey. Every path
                should have a clear ending.
              </p>
            )}
            {!["START", "EXIT"].includes(kind) && (
              <Button variant="outline" onClick={remove} className="mt-5">
                <Trash2 />
                Remove step
              </Button>
            )}
          </fieldset>
          <div className={workspaceClassName("inspector-footer")}>
            <ShieldCheck size={15} />
            <span>Only active, subscribed contacts can receive emails.</span>
          </div>
        </aside>
      </div>
      {runs && <RunHistory id={id} close={() => setRuns(false)} />}{" "}
      {test && <RunWorkflow id={id} close={() => setTest(false)} />}
      <Modal
        open={leave}
        onOpenChange={setLeave}
        title="Leave this draft?"
        description="Your unsaved changes will be lost."
      >
        <div className={workspaceClassName("modal-actions")}>
          <Button variant="outline" onClick={() => setLeave(false)}>
            Keep editing
          </Button>
          <Button onClick={close}>Discard changes</Button>
        </div>
      </Modal>
    </div>
  );
}
function RunHistory({ id, close }: { id: string; close: () => void }) {
  const q = useMarketingQuery<any[]>(`automations/${id}/executions`);
  return (
    <Modal
      open
      onOpenChange={close}
      title="Workflow history"
      description="Recent runs, progress, and errors for this workflow."
    >
      <QueryState loading={q.isLoading} error={q.error} />
      {q.data?.length === 0 && (
        <Empty
          title="No runs yet"
          description="Matching events will appear here after the workflow is published."
        />
      )}
      <table className={workspaceClassName("product-table")}>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Status</th>
            <th>Started</th>
          </tr>
        </thead>
        <tbody>
          {q.data?.map((run) => (
            <tr key={run.id}>
              <td>
                {run.contact?.email || run.contactId}
                <small>{run.error}</small>
              </td>
              <td>
                <Status value={run.status} />
              </td>
              <td>{new Date(run.startedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
function RunWorkflow({ id, close }: { id: string; close: () => void }) {
  const q = useMarketingQuery<Contact[]>("marketing/contacts");
  const { request } = useMarketing();
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      open
      onOpenChange={close}
      title="Run this workflow"
      description="This executes the active workflow and can send real emails to the selected contact."
    >
      <Field label="Contact">
        <select value={contact} onChange={(e) => setContact(e.target.value)}>
          <option value="">Choose an active subscriber</option>
          {q.data
            ?.filter((c) => c.status === "ACTIVE")
            .map((c) => (
              <option value={c.id} key={c.id}>
                {c.email}
              </option>
            ))}
        </select>
      </Field>
      <Button
        className={workspaceClassName("product-primary")}
        disabled={!contact || busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await request<any>(
              `automations/${id}/trigger`,
              "POST",
              { contactIds: [contact] },
            );
            if (!result.tasksEnqueued)
              throw new Error("The run could not be queued");
            toast.success("Workflow queued");
            close();
          } catch (e) {
            toast.error((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Queuing…" : "Run for this contact"}
      </Button>
    </Modal>
  );
}
