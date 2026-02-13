import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

export interface ConfirmationModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the modal should close (cancel / backdrop / escape) */
  onClose: () => void;
  /** Lucide icon rendered in the top circle */
  icon: LucideIcon;
  /** Tailwind classes for the icon circle, e.g. "text-destructive bg-destructive/10" */
  iconColor: string;
  /** Modal title */
  title: string;
  /** Description — supports ReactNode for bold/strong fragments */
  description: ReactNode;
  /** Confirm button label */
  confirmLabel: string;
  /** Tailwind classes for the confirm button */
  confirmColor?: string;
  /** Called when confirm is clicked */
  onConfirm: () => void;
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
}

export function ConfirmationModal({
  open,
  onClose,
  icon: Icon,
  iconColor,
  title,
  description,
  confirmLabel,
  confirmColor = "bg-destructive text-white hover:bg-destructive/90",
  onConfirm,
  cancelLabel = "Cancel",
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      blur="sm"
      showCloseButton={false}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors duration-150",
              confirmColor,
            )}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
