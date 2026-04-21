import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";



const overlayVariants = cva("fixed inset-0 z-[100] flex items-center justify-center p-4", {
  variants: {
    blur: {
      none: "bg-black/50",
      sm: "bg-black/40 backdrop-blur-[6px]",
      md: "bg-black/35 backdrop-blur-md",
      lg: "bg-black/30 backdrop-blur-lg",
    },
  },
  defaultVariants: { blur: "sm" },
});



const panelVariants = cva(
  [
    "relative w-full bg-card/95 backdrop-blur-xl",
    "border border-white/[0.08] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)]",
    "outline-none overflow-hidden",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-[calc(100vw-2rem)]",
      },
      rounded: {
        none: "rounded-none",
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      size: "md",
      rounded: "lg",
      padding: "md",
    },
  },
);



export interface IModalProps
  extends VariantProps<typeof overlayVariants>,
    VariantProps<typeof panelVariants> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  overlayClassName?: string;
  className?: string;
  portalTarget?: HTMLElement;
}



export function Modal({
  open,
  onClose,
  children,
  header,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  blur,
  size,
  rounded,
  padding,
  overlayClassName,
  className,
  portalTarget,
}: IModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") onClose();
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  
  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  const hasHeader = !!header || showCloseButton;

  const modal = (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="modal-backdrop"
          className={cn(overlayVariants({ blur }), overlayClassName)}
          onClick={handleBackdropClick}
          aria-hidden={!open}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={cn(
              panelVariants({ size, rounded, padding: hasHeader || footer ? "none" : padding }),
              className,
            )}
            initial={{ opacity: 0, scale: 0.92, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 8, filter: "blur(2px)" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 380,
              mass: 0.6,
            }}
          >
            
            {hasHeader && (
              <ModalHeader
                header={header}
                padding={padding}
                onClose={onClose}
                showCloseButton={showCloseButton}
              />
            )}

            <div className={cn(getPaddingClass(padding))}>{children}</div>
            {footer && <ModalFooter footer={footer} padding={padding} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, portalTarget ?? document.body);
}



function getPaddingClass(padding: IModalProps["padding"]) {
  if (padding === "lg") return "px-8 py-6";
  if (padding === "sm") return "px-4 py-3";
  return "px-6 py-5";
}

function getHeaderFooterPaddingClass(padding: IModalProps["padding"]) {
  if (padding === "lg") return "px-8 py-5";
  if (padding === "sm") return "px-4 py-3";
  return "px-6 py-4";
}

function ModalHeader({
  header,
  padding,
  onClose,
  showCloseButton,
}: {
  header: ReactNode;
  padding: IModalProps["padding"];
  onClose: () => void;
  showCloseButton: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-white/6",
        getHeaderFooterPaddingClass(padding),
      )}
    >
      <div className="flex-1 min-w-0">{header}</div>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl shrink-0",
            "text-muted-foreground/60 hover:text-foreground hover:bg-white/6",
            "transition-all duration-200 cursor-pointer",
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ModalFooter({ footer, padding }: { footer: ReactNode; padding: IModalProps["padding"] }) {
  return (
    <div className={cn("border-t border-white/6", getHeaderFooterPaddingClass(padding))}>
      {footer}
    </div>
  );
}
