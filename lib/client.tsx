import { AppType } from '@/server/route'
import { hc } from "hono/client";

export const api_client = hc < AppType > (("http://localhost:3001"))
