"use client";

import { useId, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, Label, Input, Textarea } from "@/components/ui";

/** A titled block within the editor. */
export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function ListToolbar({
  addLabel,
  onAdd,
  count,
  noun,
}: {
  addLabel: string;
  onAdd: () => void;
  count: number;
  noun: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-400">
        {count} {noun}
        {count === 1 ? "" : "s"}
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-brand-blue-600 transition-colors hover:bg-brand-blue-50"
      >
        <span aria-hidden="true" className="text-base leading-none">+</span>
        {addLabel}
      </button>
    </div>
  );
}

export function RemoveButton({
  onClick,
  label,
  disabled,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
    >
      {label}
    </button>
  );
}

export function ItemCard({
  children,
  onRemove,
  removeLabel,
  title,
}: {
  children: ReactNode;
  onRemove: () => void;
  removeLabel: string;
  title?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <RemoveButton onClick={onRemove} label={removeLabel} />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
