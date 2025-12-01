import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ bookingId }) => {
  const { getToken } = useAuth();
  const [stripePromise, setStripePromise] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await fetch("/api/payments/config");
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      } catch (err) {
        console.error("Failed to load Stripe config:", err);
        setError("Failed to load payment system. Please try again.");
      }
    };

    fetchStripeConfig();
  }, []);

  const fetchClientSecret = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      console.error("Error creating checkout session:", err);
      setError(err.message);
      throw err;
    }
  }, [bookingId, getToken]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="text-primary underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
