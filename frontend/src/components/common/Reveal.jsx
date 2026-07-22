import useInView from "../../hooks/useInView";

export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
