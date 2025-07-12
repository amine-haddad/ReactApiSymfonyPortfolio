// src/components/ui/Button.jsx
import { Link } from "react-router-dom";

function Button({ to, children, className = "", ...props }) {
  return (
    <Link
      to={to}
      {...props}
      className={`btn btn-outline-primary text-uppercase fw-semibold text-center ${className}`}
      style={{
        backgroundColor: "var(--buton-bg)",
        color: "var(--text-color)",
        borderColor: "var(--accent-color)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--button-bg-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--buton-bg)")
      }
    >
      {children}
    </Link>
  );
}

export default Button;
