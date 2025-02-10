import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}

              {description && (
                <ToastDescription>
                  {/* todo: replace hardcoded with dynamic usage */}
                  {typeof description === "string" &&
                  description.includes("https") ? (
                    <a
                      href={description}
                      className="font-bold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See transaction on Solana Explorer
                    </a>
                  ) : (
                    description
                  )}
                </ToastDescription>
              )}
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}

      <ToastViewport />
    </ToastProvider>
  );
}
