import { serve } from "https://deno.land/std@0.162.0/http/server.ts";
import * as supjav from "./supjav.ts";

serve(supjav.default.fetch);
