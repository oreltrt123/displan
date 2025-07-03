import "@/styles/GlassIcons.css";

const gradientMapping = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

const GlassIcons = ({ items_glass, className }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ""}`}>
      {items_glass.map((items_glass, index) => (
        <button
          key={index}
          className={`icon-btn ${items_glass.customClass || ""}`}
          aria-label={items_glass.label}
          type="button"
        >
          <span
            className="icon-btn__back"
            style={getBackgroundStyle(items_glass.color)}
          ></span>
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">{items_glass.icon}</span>
          </span>
          <span className="icon-btn__label">{items_glass.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
