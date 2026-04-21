import { motion } from "framer-motion";

export function AdminLoader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "1.5rem",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(139, 92, 246, 0.15)",
          borderTopColor: "#8b5cf6",
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "var(--color-muted-foreground, #94a3b8)",
          letterSpacing: "0.05em",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
