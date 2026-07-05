export function StepShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
}: {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-black/50">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span>{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-blue">
          <div
            className="h-full rounded-full bg-light-blue transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      <h2 className="font-display text-2xl font-medium text-black">{title}</h2>
      {subtitle && <p className="mt-2 text-black/70">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  required,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-black">
        {label} {required && <span className="text-dark-blue">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue";
