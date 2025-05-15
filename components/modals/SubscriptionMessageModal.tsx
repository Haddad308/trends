import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export function SubscriptionMessageModal({
  open,
  type,
  message,
  onClose,
}: Props) {
  const router = useRouter();

  const handleAction = () => {
    if (type === "success") {
      router.push("/");
    } else {
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          {type === "success" ? (
            <>
              <CheckCircle className="text-green-600 mx-auto mb-2" size={48} />
              <DialogTitle className="text-green-700 text-center">
                Payment Successful
              </DialogTitle>
              <DialogDescription className=" text-center">
                {message}
              </DialogDescription>
            </>
          ) : (
            <>
              <AlertTriangle className="text-red-600 mx-auto mb-2" size={48} />
              <DialogTitle className="text-red-700">Payment Failed</DialogTitle>
              <DialogDescription>{message}</DialogDescription>
            </>
          )}
        </DialogHeader>

        <div className="mt-4">
          <Button
            className={
              type === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
            onClick={handleAction}
          >
            {type === "success" ? "Go to Home" : "Try Again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
