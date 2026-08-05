// Kept separate from lib/actions.ts (and any other "use server" module): a
// "use server" file may only export async functions — a plain constant like
// initialActionState living there crashes at runtime ("A 'use server' file
// can only export async functions, found object").
export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialActionState: ActionState = { status: "idle" };
