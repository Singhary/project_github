"use client";

import { Info } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { createCheckoutSession } from "~/lib/stripe";
import { api } from "~/trpc/react";

const BillingPage = () => {
  const { data: user } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0];
  const priceInINR = Math.round(((creditsToBuyAmount as number) / 100)*1300).toFixed(2);

  return (
    <div>
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="h-2"></div>
      <p className="text-sm text-gray-500">
        You have{" "}
        <span className="font-medium text-gray-900">
          {user?.credits ?? 0} Codexa Credits
        </span>
      </p>

      <div className="h-2"></div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700">
        <div className="flex items-center gap-2">
          <Info className="size-4" />
          <p className="text-sm">
            Each credit allow you to index 1 file in a repository
          </p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files. You will need 100 credits to index
          it.
        </p>
      </div>

      <div className="h-4"></div>
      <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={value => setCreditsToBuy(value)} value={creditsToBuy} />
        <div className="h-4"></div>
        <Button onClick={() => {
            createCheckoutSession(creditsToBuyAmount as number);
        }}>
            Buy {creditsToBuyAmount} Credits for ₹{priceInINR}
        </Button>
    </div>
  );
};

export default BillingPage;
