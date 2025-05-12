// "use client";
"use server";
import { Suspense } from "react";
import Loading from "../dashboard/Loading";
import CustomerStats from "./CustomerStats";

export default function ClientWrapper({ currentMonth }) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <CustomerStats currentMonth={currentMonth} />
      </Suspense>
    </div>
  );
}
