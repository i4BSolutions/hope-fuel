"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

if (typeof window !== "undefined") {
  Amplify.configure(awsconfig);
}
