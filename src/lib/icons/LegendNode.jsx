export default function LegendNode({ colorCode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 17 16"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="7" width="16" height="2" fill={colorCode} />
      <circle cx="8.5" cy="8" r="3.5" fill={colorCode} stroke="white" />
    </svg>
  );
}
