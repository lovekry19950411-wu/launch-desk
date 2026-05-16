import type { Response } from "express";

export type ClientEvent =
  | { type: "tool_progress"; name: string; message: string; payload?: unknown }
  | { type: "text_delta"; delta: string }
  | { type: "done"; traceId: string }
  | { type: "error"; message: string };

export function writeSse(res: Response, event: ClientEvent) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

export function getRawTextDelta(event: any): string {
  if (event?.type !== "raw_model_stream_event") return "";
  const data = event.data;
  if (typeof data?.delta === "string") return data.delta;
  if (typeof data?.event?.delta === "string") return data.event.delta;
  if (typeof data?.event?.text === "string" && data.event.type?.includes("delta")) return data.event.text;
  return "";
}

export function getToolProgress(event: any): ClientEvent | null {
  if (event?.type !== "run_item_stream_event") return null;
  const name = event.name || event.item?.type || "tool_event";

  if (name === "tool_called" || event.item?.type === "tool_call_item") {
    return {
      type: "tool_progress",
      name: event.item?.rawItem?.name || event.item?.name || "tool_called",
      message: "Tool started",
      payload: event.item
    };
  }

  if (name === "tool_output" || event.item?.type === "tool_call_output_item") {
    return {
      type: "tool_progress",
      name: event.item?.rawItem?.name || event.item?.name || "tool_output",
      message: "Tool completed",
      payload: event.item?.output ?? event.item
    };
  }

  return null;
}
