const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);