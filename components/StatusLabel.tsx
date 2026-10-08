type StatusLabelProps = {
  label: string;
  tone: "success" | "warning" | "danger";
};

const toneClasses: Record<StatusLabelProps["tone"], string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-700",
  danger: "bg-danger/10 text-danger",
};

export function StatusLabel({ label, tone }: StatusLabelProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
