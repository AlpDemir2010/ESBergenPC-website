"use client";

import { useState } from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { replaceAt } from "@/lib/array";
import type { SiteContent } from "@/lib/types";
import { AdminSection, Field, ItemCard, ListToolbar } from "./fields";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function ContentEditor({ content: initial }: { content: SiteContent }) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dirty, setDirty] = useState(false);

  const patch = <K extends keyof SiteContent>(
    section: K,
    value: Partial<SiteContent[K]>,
  ) => {
    setDraft((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));
    setDirty(true);
    setStatus({ kind: "idle" });
  };

  const reset = () => {
    setDraft(initial);
    setDirty(false);
    setStatus({ kind: "idle" });
  };

  const save = async () => {
    setStatus({ kind: "saving" });
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `Request failed (${response.status})`);
      }

      setDirty(false);
      setStatus({ kind: "saved" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SaveBar status={status} dirty={dirty} onSave={save} onReset={reset} />

      <AdminSection
        title="Site identity"
        description="Used in the header, footer and browser tab."
        className="lg:max-w-3xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Site name"
            value={draft.site.name}
            onChange={(value) => patch("site", { name: value })}
          />
          <Field
            label="Tagline"
            value={draft.site.tagline}
            onChange={(value) => patch("site", { tagline: value })}
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Navigation labels"
        description="Rename the menu items. The page order stays the same."
        className="lg:max-w-3xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Home"
            value={draft.nav.home}
            onChange={(value) => patch("nav", { home: value })}
          />
          <Field
            label="Who We Are"
            value={draft.nav.whoWeAre}
            onChange={(value) => patch("nav", { whoWeAre: value })}
          />
          <Field
            label="What We Do"
            value={draft.nav.whatWeDo}
            onChange={(value) => patch("nav", { whatWeDo: value })}
          />
          <Field
            label="Events"
            value={draft.nav.events}
            onChange={(value) => patch("nav", { events: value })}
          />
          <Field
            label="News"
            value={draft.nav.news}
            onChange={(value) => patch("nav", { news: value })}
          />
        </div>
      </AdminSection>

      {/* ------------------------------------------------------------ Home */}
      <AdminSection title="Home page" className="lg:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.home.eyebrow}
            onChange={(value) => patch("home", { eyebrow: value })}
          />
          <Field
            label="Title"
            value={draft.home.title}
            onChange={(value) => patch("home", { title: value })}
          />
        </div>
        <Field
          label="Description"
          multiline
          value={draft.home.description}
          onChange={(value) => patch("home", { description: value })}
        />
        <Field
          label="Introduction"
          multiline
          value={draft.home.intro}
          onChange={(value) => patch("home", { intro: value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Highlight title"
            value={draft.home.highlightTitle}
            onChange={(value) => patch("home", { highlightTitle: value })}
          />
        </div>
        <Field
          label="Highlight text"
          multiline
          value={draft.home.highlightBody}
          onChange={(value) => patch("home", { highlightBody: value })}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Link cards</p>
          {draft.home.cards.map((card, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              <Field
                label={`Card ${index + 1} label`}
                value={card.label}
                onChange={(value) =>
                  patch("home", {
                    cards: draft.home.cards.map((item, i) =>
                      i === index ? { ...item, label: value } : item,
                    ),
                  })
                }
              />
              <Field
                label={`Card ${index + 1} note`}
                value={card.note}
                onChange={(value) =>
                  patch("home", {
                    cards: draft.home.cards.map((item, i) =>
                      i === index ? { ...item, note: value } : item,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
      </AdminSection>

      {/* -------------------------------------------------------- Who we are */}
      <AdminSection title="Who We Are page" className="lg:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.whoWeAre.eyebrow}
            onChange={(value) => patch("whoWeAre", { eyebrow: value })}
          />
          <Field
            label="Title"
            value={draft.whoWeAre.title}
            onChange={(value) => patch("whoWeAre", { title: value })}
          />
        </div>
        <Field
          label="Description"
          multiline
          value={draft.whoWeAre.description}
          onChange={(value) => patch("whoWeAre", { description: value })}
        />
        <Field
          label="Body"
          multiline
          value={draft.whoWeAre.body}
          onChange={(value) => patch("whoWeAre", { body: value })}
        />
        <Field
          label="Members heading"
          value={draft.whoWeAre.membersHeading}
          onChange={(value) => patch("whoWeAre", { membersHeading: value })}
        />

        <div className="space-y-3">
          {draft.whoWeAre.members.map((member, index) => (
            <ItemCard
              key={index}
              title={member.name || `Member ${index + 1}`}
              removeLabel="Remove member"
              onRemove={() =>
                patch("whoWeAre", {
                  members: draft.whoWeAre.members.filter((_, i) => i !== index),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label="Name"
                  value={member.name}
                  onChange={(value) =>
                    patch("whoWeAre", {
                      members: replaceAt(draft.whoWeAre.members, index, {
                        name: value,
                      }),
                    })
                  }
                />
                <Field
                  label="Role"
                  value={member.role}
                  onChange={(value) =>
                    patch("whoWeAre", {
                      members: replaceAt(draft.whoWeAre.members, index, {
                        role: value,
                      }),
                    })
                  }
                />
                <Field
                  label="Year group"
                  value={member.year}
                  onChange={(value) =>
                    patch("whoWeAre", {
                      members: replaceAt(draft.whoWeAre.members, index, {
                        year: value,
                      }),
                    })
                  }
                />
              </div>
              <Field
                label="Short bio"
                multiline
                rows={2}
                value={member.bio}
                onChange={(value) =>
                  patch("whoWeAre", {
                    members: replaceAt(draft.whoWeAre.members, index, {
                      bio: value,
                    }),
                  })
                }
              />
            </ItemCard>
          ))}

          <ListToolbar
            noun="member"
            addLabel="Add member"
            count={draft.whoWeAre.members.length}
            onAdd={() =>
              patch("whoWeAre", {
                members: [
                  ...draft.whoWeAre.members,
                  { name: "", role: "", year: "", bio: "" },
                ],
              })
            }
          />
        </div>
      </AdminSection>

      {/* -------------------------------------------------------- What we do */}
      <AdminSection title="What We Do page" className="lg:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.whatWeDo.eyebrow}
            onChange={(value) => patch("whatWeDo", { eyebrow: value })}
          />
          <Field
            label="Title"
            value={draft.whatWeDo.title}
            onChange={(value) => patch("whatWeDo", { title: value })}
          />
        </div>
        <Field
          label="Description"
          multiline
          value={draft.whatWeDo.description}
          onChange={(value) => patch("whatWeDo", { description: value })}
        />
        <Field
          label="Body"
          multiline
          value={draft.whatWeDo.body}
          onChange={(value) => patch("whatWeDo", { body: value })}
        />
        <Field
          label="Priorities heading"
          value={draft.whatWeDo.pillarsHeading}
          onChange={(value) => patch("whatWeDo", { pillarsHeading: value })}
        />

        <div className="space-y-3">
          {draft.whatWeDo.pillars.map((pillar, index) => (
            <ItemCard
              key={index}
              title={pillar.title || `Priority ${index + 1}`}
              removeLabel="Remove priority"
              onRemove={() =>
                patch("whatWeDo", {
                  pillars: draft.whatWeDo.pillars.filter((_, i) => i !== index),
                })
              }
            >
              <Field
                label="Title"
                value={pillar.title}
                onChange={(value) =>
                  patch("whatWeDo", {
                    pillars: replaceAt(draft.whatWeDo.pillars, index, {
                      title: value,
                    }),
                  })
                }
              />
              <Field
                label="Description"
                multiline
                rows={2}
                value={pillar.description}
                onChange={(value) =>
                  patch("whatWeDo", {
                    pillars: replaceAt(draft.whatWeDo.pillars, index, {
                      description: value,
                    }),
                  })
                }
              />
            </ItemCard>
          ))}

          <ListToolbar
            noun="priority"
            addLabel="Add priority"
            count={draft.whatWeDo.pillars.length}
            onAdd={() =>
              patch("whatWeDo", {
                pillars: [
                  ...draft.whatWeDo.pillars,
                  { title: "", description: "" },
                ],
              })
            }
          />
        </div>
      </AdminSection>

      {/* ------------------------------------------------------------- News */}
      <AdminSection title="News page" className="lg:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.news.eyebrow}
            onChange={(value) => patch("news", { eyebrow: value })}
          />
          <Field
            label="Title"
            value={draft.news.title}
            onChange={(value) => patch("news", { title: value })}
          />
        </div>
        <Field
          label="Description"
          multiline
          value={draft.news.description}
          onChange={(value) => patch("news", { description: value })}
        />
        <Field
          label="Body"
          multiline
          value={draft.news.body}
          onChange={(value) => patch("news", { body: value })}
        />
        <Field
          label="Empty state message"
          value={draft.news.emptyState}
          onChange={(value) => patch("news", { emptyState: value })}
        />

        <div className="space-y-3">
          {draft.news.articles.map((article, index) => (
            <ItemCard
              key={index}
              title={article.title || `Article ${index + 1}`}
              removeLabel="Remove article"
              onRemove={() =>
                patch("news", {
                  articles: draft.news.articles.filter((_, i) => i !== index),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <Field
                  label="Headline"
                  value={article.title}
                  onChange={(value) =>
                    patch("news", {
                      articles: replaceAt(draft.news.articles, index, {
                        title: value,
                      }),
                    })
                  }
                />
                <Field
                  label="Date"
                  type="date"
                  value={article.date}
                  onChange={(value) =>
                    patch("news", {
                      articles: replaceAt(draft.news.articles, index, {
                        date: value,
                      }),
                    })
                  }
                />
              </div>
              <Field
                label="Summary"
                multiline
                rows={2}
                value={article.excerpt}
                onChange={(value) =>
                  patch("news", {
                    articles: replaceAt(draft.news.articles, index, {
                      excerpt: value,
                    }),
                  })
                }
              />
              <Field
                label="Full text"
                multiline
                rows={3}
                value={article.body}
                onChange={(value) =>
                  patch("news", {
                    articles: replaceAt(draft.news.articles, index, {
                      body: value,
                    }),
                  })
                }
              />
            </ItemCard>
          ))}

          <ListToolbar
            noun="article"
            addLabel="Add article"
            count={draft.news.articles.length}
            onAdd={() =>
              patch("news", {
                articles: [
                  ...draft.news.articles,
                  {
                    title: "",
                    date: new Date().toISOString().slice(0, 10),
                    excerpt: "",
                    body: "",
                  },
                ],
              })
            }
          />
        </div>
      </AdminSection>

      {/* ----------------------------------------------------------- Events */}
      <AdminSection
        title="Events page text"
        description="The calendar itself is managed on the Events tab."
        className="lg:max-w-3xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.events.eyebrow}
            onChange={(value) => patch("events", { eyebrow: value })}
          />
          <Field
            label="Title"
            value={draft.events.title}
            onChange={(value) => patch("events", { title: value })}
          />
        </div>
        <Field
          label="Description"
          multiline
          value={draft.events.description}
          onChange={(value) => patch("events", { description: value })}
        />
        <Field
          label="Body"
          multiline
          value={draft.events.body}
          onChange={(value) => patch("events", { body: value })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Empty day message"
            value={draft.events.emptyDay}
            onChange={(value) => patch("events", { emptyDay: value })}
          />
          <Field
            label="Empty calendar message"
            value={draft.events.emptyAll}
            onChange={(value) => patch("events", { emptyAll: value })}
          />
        </div>
      </AdminSection>

      {/* ----------------------------------------------------------- Footer */}
      <AdminSection title="Footer" className="lg:max-w-3xl">
        <Field
          label="About text"
          multiline
          rows={2}
          value={draft.footer.about}
          onChange={(value) => patch("footer", { about: value })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Explore heading"
            value={draft.footer.exploreHeading}
            onChange={(value) => patch("footer", { exploreHeading: value })}
          />
          <Field
            label="Contact heading"
            value={draft.footer.contactHeading}
            onChange={(value) => patch("footer", { contactHeading: value })}
          />
        </div>
        <Field
          label="Copyright line"
          value={draft.footer.copyright}
          onChange={(value) => patch("footer", { copyright: value })}
        />
        <Field
          label="Closing tagline"
          value={draft.footer.tagline}
          onChange={(value) => patch("footer", { tagline: value })}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Contact lines</p>
          {draft.footer.contact.map((line, index) => (
            <Field
              key={index}
              label={`Line ${index + 1}`}
              value={line}
              onChange={(value) =>
                patch("footer", {
                  contact: draft.footer.contact.map((item, i) =>
                    i === index ? value : item,
                  ),
                })
              }
            />
          ))}
          <ListToolbar
            noun="line"
            addLabel="Add contact line"
            count={draft.footer.contact.length}
            onAdd={() => patch("footer", { contact: [...draft.footer.contact, ""] })}
          />
        </div>
      </AdminSection>

      <SaveBar status={status} dirty={dirty} onSave={save} onReset={reset} />
    </div>
  );
}

function SaveBar({
  status,
  dirty,
  onSave,
  onReset,
}: {
  status: Status;
  dirty: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky top-[73px] z-30 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-card backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {status.kind === "saving" && (
            <span className="inline-flex items-center gap-2 text-slate-600">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Saving…
            </span>
          )}
          {status.kind === "saved" && (
            <span className="inline-flex items-center gap-2 font-medium text-emerald-600">
              <Check aria-hidden="true" className="h-4 w-4" />
              Saved. The change is live on the site.
            </span>
          )}
          {status.kind === "error" && (
            <span className="font-medium text-red-600">{status.message}</span>
          )}
          {status.kind === "idle" &&
            (dirty ? (
              <span className="text-amber-600">You have unsaved changes.</span>
            ) : (
              <span className="text-slate-400">All changes saved.</span>
            ))}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={!dirty || status.kind === "saving"}
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Discard
          </button>
          <Button onClick={onSave} disabled={!dirty || status.kind === "saving"}>
            {status.kind === "saving" ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : null}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
