import { toast } from "sonner";

export const crudToast = {
  created: (entity: string) => toast.success(`${entity} created.`),
  updated: (entity: string) => toast.success(`${entity} updated.`),
  deleted: (entity: string) => toast.success(`${entity} deleted.`),
  saved: (entity: string) => toast.success(`${entity} saved.`),
  action: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
};
