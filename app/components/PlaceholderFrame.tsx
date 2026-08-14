type PlaceholderFrameProps = {
  eyebrow: string;
  title: string;
  tone: "gsc" | "vos";
  size?: "wide" | "square";
};

export function PlaceholderFrame({
  eyebrow,
  title,
  tone,
  size = "wide",
}: PlaceholderFrameProps) {
  return (
    <div
      className={`placeholder-frame placeholder-frame--${tone} placeholder-frame--${size}`}
      role="img"
      aria-label={`${title} placeholder artwork`}
    >
      <div className="placeholder-frame__art" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="placeholder-frame__caption">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
