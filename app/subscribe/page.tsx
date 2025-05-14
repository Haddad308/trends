"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/auth-context";
import {
  getUserSubscription,
  updateUserSubscription,
} from "@/firebase/subscription";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SubscriptionMessageModal } from "@/components/modals/SubscriptionMessageModal";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE } from "@/lib/constants";
import {
  OnApproveData,
  OnApproveActions,
  CreateOrderActions,
} from "@paypal/paypal-js";

export default function SubscribePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  // PayPal client ID - replace with your actual client ID in production
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"; // "sb" is for sandbox testing

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const subscription = await getUserSubscription(user.uid);
        setHasLifetimeAccess(
          subscription?.planId === "lifetime" &&
            subscription?.status === "active"
        );
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, router]);

  const createOrder = (
    _: Record<string, unknown>,
    actions: CreateOrderActions
  ) => {
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "TrendsApp Lifetime Access",
          amount: {
            currency_code: "USD",
            value: SUBSCRIPTION_PRICE.toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (_: OnApproveData, actions: OnApproveActions) => {
    try {
      setIsProcessing(true);
      if (!actions.order) {
        throw new Error("Order actions are undefined.");
      }
      const details = await actions.order.capture();

      if (details.status === "COMPLETED" && user) {
        await updateUserSubscription(user.uid, {
          planId: "lifetime",
          orderId: details.id || "unknown-order-id",
          status: "active",
          startDate: new Date().toISOString(),
          endDate: null,
          isLifetime: true,
        });

        setHasLifetimeAccess(true);
        setModalType("success");
        setModalMessage(
          "Thank you for your purchase. You now have lifetime access."
        );
        setModalOpen(true);

        // Optional: auto-close after 3 seconds and redirect
        setTimeout(() => {
          setModalOpen(false);
          router.replace("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setModalType("error");
      setModalMessage(
        "There was an error processing your payment. Please try again."
      );
      setModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (hasLifetimeAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <h1 className="text-3xl font-extrabold mb-4">
          You already have lifetime access!
        </h1>
        <p className="text-gray-400 mb-6">
          Thank you for your support! You can start exploring social trends
          instantly.
        </p>
        <Button
          variant="ghost"
          className="text-purple-600 dark:text-purple-400 hover:text-white hover:cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4">
      <Button
        variant="ghost"
        className="my-6 text-purple-600 dark:text-purple-400 hover:text-white hover:cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <div className="flex items-center justify-center">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Unlock Lifetime Access
          </h1>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Get unlimited access to real-time search across YouTube, Instagram,
            TikTok, Reddit, and more. Discover trends, influencers, and insights
            with no limits — forever.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              ${SUBSCRIPTION_PRICE} – One-Time Payment
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              No subscriptions. One upgrade for infinite social search.
            </p>
          </div>
          {!modalOpen && (
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                disabled={isProcessing}
                onError={(err) => {
                  console.error("Payment error:", err);
                  setModalType("error");
                  setModalMessage(
                    "Something went wrong with the payment. Please try again."
                  );
                  setModalOpen(true);
                }}
              />
            </PayPalScriptProvider>
          )}

          <p className="text-xs text-gray-400 mt-4">
            You’ll be redirected to start exploring social trends instantly
            after successful payment.
          </p>

          {modalOpen && (
            <SubscriptionMessageModal
              open={modalOpen}
              type={modalType}
              message={modalMessage}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
