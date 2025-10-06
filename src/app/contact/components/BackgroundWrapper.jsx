// app/contact/components/BackgroundWrapper.jsx
import clsx from "clsx";

export default function BackgroundWrapper({
  image,
  overlayClass = "",
  className = "",
  children,
}) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      {overlayClass ? (
        <div className={clsx("absolute inset-0", overlayClass)} />
      ) : null}
      <div className={clsx("relative", className)}>{children}</div>
    </div>
  );
}
