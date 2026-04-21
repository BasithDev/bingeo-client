import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

export interface IConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmColor?: string;
  onConfirm: () => void;
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
}: IConfirmationModalProps) {
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
