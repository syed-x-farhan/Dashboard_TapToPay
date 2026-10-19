"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryError } from "@/components/shared/query-error";
import { AmountText } from "@/components/shared/amount-text";
import {
  type Ingredient,
  type MenuItem,
  type Supplier,
  useAddIngredient,
  useAddMenuItem,
  useAddRecipeIngredient,
  useAddSupplier,
  useAllMenuItemMargins,
  useDeleteIngredient,
  useDeleteMenuItem,
  useDeleteRecipeIngredient,
  useDeleteSupplier,
  useIngredientPriceHistory,
  useIngredients,
  useMenuItemMargin,
  useMenuItems,
  useRecipe,
  useSuppliers,
  useUpdateIngredient,
  useUpdateIngredientPrice,
  useUpdateMenuItem,
  useUpdateRecipeIngredient,
  useUpdateSupplier,
} from "@/hooks/use-menu-data";

type FormMessage = { type: "success" | "error"; text: string } | null;

const INGREDIENT_UNITS = ["g", "kg", "ml", "l", "piece", "dozen"] as const;

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

function MessageText({ message }: { message: FormMessage }) {
  if (!message) return null;
  return (
    <p className={message.type === "success" ? "text-sm text-primary-green" : "text-sm text-destructive"}>
      {message.text}
    </p>
  );
}

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  error,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="py-2 text-sm text-medium-text">{description}</p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SuppliersTab() {
  const { data, isLoading, isError, refetch } = useSuppliers();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Supplier | null>(null);
  const [message, setMessage] = React.useState<FormMessage>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Supplier | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [addForm, setAddForm] = React.useState({
    name: "",
    category: "",
    contactPerson: "",
    phone: "",
    email: "",
  });
  const [editForm, setEditForm] = React.useState({
    name: "",
    category: "",
    contactPerson: "",
    phone: "",
    email: "",
    isActive: true,
  });

  React.useEffect(() => {
    if (editTarget) {
      setEditForm({
        name: editTarget.name,
        category: editTarget.category,
        contactPerson: editTarget.contactPerson,
        phone: editTarget.phone,
        email: editTarget.email,
        isActive: editTarget.isActive,
      });
    }
  }, [editTarget]);

  if (isError) return <QueryError refetch={refetch} />;

  const hasRequired = Object.values(addForm).every((v) => v.trim());

  return (
    <div className="space-y-3">
      <div className="card-base overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-light-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-dark-text">Suppliers</h2>
            <p className="text-xs text-medium-text">Manage your raw material vendors.</p>
          </div>
          <Button
            className="h-10 shrink-0 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="m-4 h-72 rounded-xl" />
        ) : !data?.length ? (
          <div className="px-4 py-12 text-center text-sm text-medium-text">
            No suppliers yet. Add your first supplier to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.category}</TableCell>
                    <TableCell>{s.contactPerson}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                        <button type="button" className="text-sm font-medium text-rider-blue hover:underline" onClick={() => setEditTarget(s)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-rider-red hover:underline"
                          onClick={() => { setDeleteError(null); setConfirmDelete(s); }}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <MessageText message={message} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2"><Label>Name</Label><Input value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Category</Label><Input value={addForm.category} onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Contact Person</Label><Input value={addForm.contactPerson} onChange={(e) => setAddForm((p) => ({ ...p, contactPerson: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Phone</Label><Input value={addForm.phone} onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" value={addForm.email} onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!hasRequired || addSupplier.isPending}
              onClick={() => {
                setMessage(null);
                addSupplier.mutate(addForm, {
                  onSuccess: () => {
                    setMessage({ type: "success", text: "Supplier added successfully." });
                    setAddOpen(false);
                    setAddForm({ name: "", category: "", contactPerson: "", phone: "", email: "" });
                  },
                  onError: (err) =>
                    setMessage({
                      type: "error",
                      text: err instanceof Error ? err.message : "Failed to add supplier.",
                    }),
                });
              }}
            >
              Save Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Supplier</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2"><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Category</Label><Input value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Contact Person</Label><Input value={editForm.contactPerson} onChange={(e) => setEditForm((p) => ({ ...p, contactPerson: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Phone</Label><Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={editForm.isActive ? "active" : "inactive"} onValueChange={(v) => setEditForm((p) => ({ ...p, isActive: v === "active" }))}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue>{(value) => (value === "inactive" ? "Inactive" : "Active")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={updateSupplier.isPending}
              onClick={() => {
                if (!editTarget) return;
                setMessage(null);
                updateSupplier.mutate(
                  {
                    id: editTarget.id,
                    body: editForm,
                  },
                  {
                    onSuccess: () => {
                      setMessage({ type: "success", text: "Supplier updated." });
                      setEditTarget(null);
                    },
                    onError: (err) =>
                      setMessage({
                        type: "error",
                        text: err instanceof Error ? err.message : "Failed to update supplier.",
                      }),
                  }
                );
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(v) => { if (!v) { setConfirmDelete(null); setDeleteError(null); } }}
        title="Delete Supplier"
        description={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        isPending={deleteSupplier.isPending}
        error={deleteError}
        onConfirm={() => {
          if (!confirmDelete) return;
          deleteSupplier.mutate(confirmDelete.id, {
            onSuccess: () => {
              setConfirmDelete(null);
              setDeleteError(null);
              setMessage({ type: "success", text: "Supplier deleted." });
            },
            onError: (err) => {
              setDeleteError(err instanceof Error ? err.message : "Unable to delete supplier.");
            },
          });
        }}
      />
    </div>
  );
}

function IngredientsTab() {
  const suppliersQuery = useSuppliers();
  const [supplierFilter, setSupplierFilter] = React.useState("all");
  const ingredientsQuery = useIngredients(supplierFilter === "all" ? undefined : supplierFilter);
  const addIngredient = useAddIngredient();
  const updateIngredient = useUpdateIngredient();
  const updatePrice = useUpdateIngredientPrice();
  const deleteIngredient = useDeleteIngredient();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Ingredient | null>(null);
  const [priceTarget, setPriceTarget] = React.useState<Ingredient | null>(null);
  const [historyTarget, setHistoryTarget] = React.useState<Ingredient | null>(null);
  const historyQuery = useIngredientPriceHistory(historyTarget?.id ?? "");
  const [message, setMessage] = React.useState<FormMessage>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Ingredient | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const [addForm, setAddForm] = React.useState({
    supplierId: "",
    name: "",
    unit: "piece",
    currentCost: "",
  });
  const [editForm, setEditForm] = React.useState({
    name: "",
    unit: "piece",
    isActive: true,
  });
  const [newCost, setNewCost] = React.useState("");
  const [editMessage, setEditMessage] = React.useState<FormMessage>(null);
  const [priceMessage, setPriceMessage] = React.useState<FormMessage>(null);

  React.useEffect(() => {
    if (editTarget) {
      setEditMessage(null);
      setEditForm({
        name: editTarget.name,
        unit: (INGREDIENT_UNITS as readonly string[]).includes(editTarget.unit)
          ? editTarget.unit
          : "piece",
        isActive: editTarget.isActive,
      });
    }
  }, [editTarget]);

  React.useEffect(() => {
    if (
      supplierFilter !== "all" &&
      suppliersQuery.data &&
      suppliersQuery.data.length > 0 &&
      !suppliersQuery.data.some((s) => s.id === supplierFilter)
    ) {
      setSupplierFilter("all");
    }
  }, [supplierFilter, suppliersQuery.data]);

  const supplierNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of suppliersQuery.data ?? []) map.set(s.id, s.name);
    return map;
  }, [suppliersQuery.data]);

  if (suppliersQuery.isError) return <QueryError refetch={suppliersQuery.refetch} />;
  if (ingredientsQuery.isError) return <QueryError refetch={ingredientsQuery.refetch} />;

  const canAdd =
    !!addForm.supplierId &&
    !!addForm.name.trim() &&
    !!addForm.unit &&
    Number(addForm.currentCost) > 0;

  const suppliers = suppliersQuery.data ?? [];

  const filterLabel =
    supplierFilter === "all"
      ? "All Suppliers"
      : supplierNameById.get(supplierFilter) ?? "All Suppliers";

  const ingredients = (ingredientsQuery.data ?? []).map((i) => ({
    ...i,
    supplierName: i.supplierName || supplierNameById.get(i.supplierId) || "—",
  }));

  return (
    <div className="space-y-3">
      <div className="card-base overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-light-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-dark-text">Ingredients</h2>
            <p className="text-xs text-medium-text">
              Track costs and suppliers for every raw material.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={supplierFilter}
              onValueChange={(v) => setSupplierFilter(v ?? "all")}
            >
              <SelectTrigger className="h-10 w-full shrink-0 rounded-xl border-light-border sm:w-[200px]">
                <SelectValue>{filterLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="h-10 shrink-0 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Ingredient
            </Button>
          </div>
        </div>

        {ingredientsQuery.isLoading || suppliersQuery.isLoading ? (
          <Skeleton className="m-4 h-72 rounded-xl" />
        ) : ingredients.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-medium-text">
            No ingredients yet. Add your first ingredient to start tracking costs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Current Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-medium-text">{i.supplierName}</TableCell>
                    <TableCell>{i.unit}</TableCell>
                    <TableCell>
                      <AmountText amount={i.currentCost} className="text-sm" />
                    </TableCell>
                    <TableCell>{i.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                        <button
                          type="button"
                          className="text-sm font-medium text-rider-blue hover:underline"
                          onClick={() => {
                            setNewCost(String(i.currentCost || ""));
                            setPriceTarget(i);
                          }}
                        >
                          Update Price
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-rider-blue hover:underline"
                          onClick={() => setHistoryTarget(i)}
                        >
                          History
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-rider-blue hover:underline"
                          onClick={() => setEditTarget(i)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-rider-red hover:underline"
                          onClick={() => {
                            setDeleteError(null);
                            setConfirmDelete(i);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <MessageText message={message} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Ingredient</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Select value={addForm.supplierId} onValueChange={(v) => setAddForm((p) => ({ ...p, supplierId: v ?? "" }))}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select supplier">
                    {addForm.supplierId
                      ? supplierNameById.get(addForm.supplierId) ?? "Select supplier"
                      : "Select supplier"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Name</Label><Input value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Select value={addForm.unit} onValueChange={(v) => setAddForm((p) => ({ ...p, unit: v ?? "piece" }))}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue>{(value) => value ?? "piece"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>{INGREDIENT_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Initial Cost</Label><Input type="number" min={0} step="0.01" value={addForm.currentCost} onChange={(e) => setAddForm((p) => ({ ...p, currentCost: e.target.value }))} className="rounded-xl" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!canAdd || addIngredient.isPending}
              onClick={() => {
                setMessage(null);
                addIngredient.mutate(
                  {
                    supplierId: addForm.supplierId,
                    name: addForm.name.trim(),
                    unit: addForm.unit,
                    currentCost: Number(addForm.currentCost),
                  },
                  {
                    onSuccess: () => {
                      setMessage({ type: "success", text: "Ingredient added." });
                      setAddOpen(false);
                      setAddForm({ supplierId: "", name: "", unit: "piece", currentCost: "" });
                    },
                    onError: (err) =>
                      setMessage({
                        type: "error",
                        text: err instanceof Error ? err.message : "Failed to add ingredient.",
                      }),
                  }
                );
              }}
            >
              Save Ingredient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Ingredient</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Input
                value={editTarget?.supplierName || "—"}
                readOnly
                className="rounded-xl bg-content text-medium-text"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Select value={editForm.unit} onValueChange={(v) => setEditForm((p) => ({ ...p, unit: v ?? "piece" }))}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue>{(value) => value ?? "piece"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>{INGREDIENT_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={editForm.isActive ? "active" : "inactive"} onValueChange={(v) => setEditForm((p) => ({ ...p, isActive: v === "active" }))}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue>{(value) => (value === "inactive" ? "Inactive" : "Active")}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MessageText message={editMessage} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!editForm.name.trim() || updateIngredient.isPending}
              onClick={() => {
                if (!editTarget) return;
                setEditMessage(null);
                updateIngredient.mutate(
                  {
                    id: editTarget.id,
                    body: {
                      name: editForm.name.trim(),
                      unit: editForm.unit,
                      isActive: editForm.isActive,
                    },
                  },
                  {
                    onSuccess: () => {
                      setMessage({ type: "success", text: "Ingredient updated." });
                      setEditTarget(null);
                    },
                    onError: (err) =>
                      setEditMessage({
                        type: "error",
                        text: err instanceof Error ? err.message : "Failed to update ingredient.",
                      }),
                  }
                );
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!priceTarget}
        onOpenChange={(o) => {
          if (!o) {
            setPriceTarget(null);
            setPriceMessage(null);
            setNewCost("");
          }
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Ingredient Price</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-1">
            <p className="text-sm text-medium-text">
              {priceTarget ? (
                <>
                  New cost per unit for <strong>{priceTarget.name}</strong>
                  {priceTarget.unit ? ` (${priceTarget.unit})` : ""}.
                </>
              ) : null}
            </p>
            <Label>New Cost Per Unit</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={newCost}
              onChange={(e) => {
                setPriceMessage(null);
                setNewCost(e.target.value);
              }}
              className="rounded-xl"
            />
            <MessageText message={priceMessage} />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPriceTarget(null);
                setPriceMessage(null);
                setNewCost("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!newCost || Number(newCost) <= 0 || updatePrice.isPending}
              onClick={() => {
                if (!priceTarget) return;
                const newCostPerUnit = Number(newCost);
                if (!Number.isFinite(newCostPerUnit) || newCostPerUnit <= 0) {
                  setPriceMessage({
                    type: "error",
                    text: "Enter a valid cost greater than 0.",
                  });
                  return;
                }
                setPriceMessage(null);
                updatePrice.mutate(
                  { id: priceTarget.id, newCostPerUnit },
                  {
                    onSuccess: () => {
                      setMessage({
                        type: "success",
                        text: "Price updated and history recorded.",
                      });
                      setPriceTarget(null);
                      setPriceMessage(null);
                      setNewCost("");
                    },
                    onError: (err) =>
                      setPriceMessage({
                        type: "error",
                        text:
                          err instanceof Error
                            ? err.message
                            : "Failed to update price.",
                      }),
                  }
                );
              }}
            >
              Save New Cost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!historyTarget} onOpenChange={(o) => !o && setHistoryTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-2xl">
          <DialogHeader><DialogTitle>Price History</DialogTitle></DialogHeader>
          {historyQuery.isError ? (
            <QueryError refetch={historyQuery.refetch} />
          ) : historyQuery.isLoading ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : (
            <div className="max-h-[320px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Cost</TableHead>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Effective To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyQuery.data?.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{fmtMoney(h.cost)}</TableCell>
                      <TableCell>{h.effectiveFrom || "-"}</TableCell>
                      <TableCell>{h.effectiveTo || "Present"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(v) => { if (!v) { setConfirmDelete(null); setDeleteError(null); } }}
        title="Delete Ingredient"
        description={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        isPending={deleteIngredient.isPending}
        error={deleteError}
        onConfirm={() => {
          if (!confirmDelete) return;
          deleteIngredient.mutate(confirmDelete.id, {
            onSuccess: () => {
              setConfirmDelete(null);
              setDeleteError(null);
              setMessage({ type: "success", text: "Ingredient deleted." });
            },
            onError: (err) => {
              setDeleteError(err instanceof Error ? err.message : "Delete failed.");
            },
          });
        }}
      />
    </div>
  );
}

function MenuTab() {
  const itemsQuery = useMenuItems();
  const ingredientsQuery = useIngredients();
  const marginsQuery = useAllMenuItemMargins();

  const addItem = useAddMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<MenuItem | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<FormMessage>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<MenuItem | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [addItemForm, setAddItemForm] = React.useState({
    name: "",
    salePrice: "",
    category: "",
  });
  const [editItemForm, setEditItemForm] = React.useState({
    name: "",
    salePrice: "",
    category: "",
    isActive: true,
  });

  React.useEffect(() => {
    if (editTarget) {
      setEditItemForm({
        name: editTarget.name,
        salePrice: String(editTarget.salePrice),
        category: editTarget.category,
        isActive: editTarget.isActive,
      });
    }
  }, [editTarget]);

  if (itemsQuery.isError) return <QueryError refetch={itemsQuery.refetch} />;
  if (ingredientsQuery.isError) return <QueryError refetch={ingredientsQuery.refetch} />;
  if (marginsQuery.isError) return <QueryError refetch={marginsQuery.refetch} />;

  return (
    <div className="space-y-3">
      <div className="card-base overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-light-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-dark-text">Menu Items & Recipes</h2>
            <p className="text-xs text-medium-text">Track costs and true margins per item.</p>
          </div>
          <Button
            className="h-10 shrink-0 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
        </div>

        {itemsQuery.isLoading || marginsQuery.isLoading ? (
          <Skeleton className="m-4 h-72 rounded-xl" />
        ) : !itemsQuery.data?.length ? (
          <div className="px-4 py-12 text-center text-sm text-medium-text">
            No menu items yet. Add an item to start building recipes and margins.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Gross Margin %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsQuery.data.map((item) => {
                  const margin = marginsQuery.data?.[item.id];
                  return (
                    <React.Fragment key={item.id}>
                      <TableRow>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell><AmountText amount={item.salePrice} className="text-sm" /></TableCell>
                        <TableCell>{margin ? `${margin.grossMarginPercent.toFixed(2)}%` : "-"}</TableCell>
                        <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                            <button type="button" className="text-sm font-medium text-rider-blue hover:underline" onClick={() => setExpandedId((p) => p === item.id ? null : item.id)}>
                              {expandedId === item.id ? "Hide Recipe" : "View Recipe"}
                            </button>
                            <button type="button" className="text-sm font-medium text-rider-blue hover:underline" onClick={() => setEditTarget(item)}>Edit</button>
                            <button
                              type="button"
                              className="text-sm font-medium text-rider-red hover:underline"
                              onClick={() => { setDeleteError(null); setConfirmDelete(item); }}
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedId === item.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-content/40">
                            <RecipeDetail
                              menuItem={item}
                              ingredients={ingredientsQuery.data ?? []}
                              onMessage={setMessage}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <MessageText message={message} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Menu Item</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2"><Label>Name</Label><Input value={addItemForm.name} onChange={(e) => setAddItemForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Sale Price</Label><Input type="number" min={0} step="0.01" value={addItemForm.salePrice} onChange={(e) => setAddItemForm((p) => ({ ...p, salePrice: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid gap-2"><Label>Category</Label><Input value={addItemForm.category} onChange={(e) => setAddItemForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!addItemForm.name.trim() || !addItemForm.category.trim() || Number(addItemForm.salePrice) <= 0 || addItem.isPending}
              onClick={() => {
                addItem.mutate(
                  {
                    name: addItemForm.name.trim(),
                    salePrice: Number(addItemForm.salePrice),
                    category: addItemForm.category.trim(),
                  },
                  {
                    onSuccess: () => {
                      setMessage({ type: "success", text: "Menu item added." });
                      setAddOpen(false);
                      setAddItemForm({ name: "", salePrice: "", category: "" });
                    },
                    onError: (err) =>
                      setMessage({
                        type: "error",
                        text: err instanceof Error ? err.message : "Failed to add menu item.",
                      }),
                  }
                );
              }}
            >
              Save Menu Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Menu Item</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2"><Label>Name</Label><Input value={editItemForm.name} onChange={(e) => setEditItemForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Sale Price</Label><Input type="number" min={0} step="0.01" value={editItemForm.salePrice} onChange={(e) => setEditItemForm((p) => ({ ...p, salePrice: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid gap-2"><Label>Category</Label><Input value={editItemForm.category} onChange={(e) => setEditItemForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl" /></div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={editItemForm.isActive ? "active" : "inactive"} onValueChange={(v) => setEditItemForm((p) => ({ ...p, isActive: v === "active" }))}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue>{(value) => (value === "inactive" ? "Inactive" : "Active")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={updateItem.isPending}
              onClick={() => {
                if (!editTarget) return;
                updateItem.mutate(
                  {
                    id: editTarget.id,
                    body: {
                      name: editItemForm.name.trim(),
                      salePrice: Number(editItemForm.salePrice),
                      category: editItemForm.category.trim(),
                      isActive: editItemForm.isActive,
                    },
                  },
                  {
                    onSuccess: () => {
                      setMessage({ type: "success", text: "Menu item updated." });
                      setEditTarget(null);
                    },
                    onError: (err) =>
                      setMessage({
                        type: "error",
                        text: err instanceof Error ? err.message : "Failed to update menu item.",
                      }),
                  }
                );
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(v) => { if (!v) { setConfirmDelete(null); setDeleteError(null); } }}
        title="Delete Menu Item"
        description={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        isPending={deleteItem.isPending}
        error={deleteError}
        onConfirm={() => {
          if (!confirmDelete) return;
          deleteItem.mutate(confirmDelete.id, {
            onSuccess: () => {
              setConfirmDelete(null);
              setDeleteError(null);
              setMessage({ type: "success", text: "Menu item deleted." });
            },
            onError: (err) => {
              setDeleteError(err instanceof Error ? err.message : "Delete failed.");
            },
          });
        }}
      />
    </div>
  );
}

function RecipeDetail({
  menuItem,
  ingredients,
  onMessage,
}: {
  menuItem: MenuItem;
  ingredients: Ingredient[];
  onMessage: (message: FormMessage) => void;
}) {
  const recipeQuery = useRecipe(menuItem.id);
  const marginQuery = useMenuItemMargin(menuItem.id);
  const addRecipe = useAddRecipeIngredient(menuItem.id);
  const updateRecipe = useUpdateRecipeIngredient(menuItem.id);
  const deleteRecipe = useDeleteRecipeIngredient(menuItem.id);

  const [ingredientId, setIngredientId] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [editingRecipeId, setEditingRecipeId] = React.useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = React.useState("");

  if (recipeQuery.isError) return <QueryError refetch={recipeQuery.refetch} />;
  if (marginQuery.isError) return <QueryError refetch={marginQuery.refetch} />;

  const margin = marginQuery.data;

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-light-border bg-white p-4">
          <h4 className="mb-3 font-semibold text-dark-text">Recipe</h4>
          {recipeQuery.isLoading ? (
            <Skeleton className="h-36 rounded-xl" />
          ) : (recipeQuery.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-medium-text">Add ingredients to build this recipe.</p>
          ) : (
            <div className="space-y-2">
              {recipeQuery.data?.map((r) => (
                <div key={r.id} className="rounded-lg border border-light-border px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-dark-text">{r.ingredientName}</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-xs font-medium text-rider-blue hover:underline"
                        onClick={() => {
                          setEditingRecipeId(r.id);
                          setEditingQuantity(String(r.quantity));
                        }}
                      >
                        <Pencil className="inline h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs font-medium text-rider-red hover:underline"
                        onClick={() => {
                          deleteRecipe.mutate(r.id, {
                            onSuccess: () =>
                              onMessage({ type: "success", text: "Recipe ingredient removed." }),
                            onError: (err) =>
                              onMessage({
                                type: "error",
                                text:
                                  err instanceof Error
                                    ? err.message
                                    : "Failed to remove ingredient.",
                              }),
                          });
                        }}
                      >
                        <Trash2 className="inline h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-medium-text">
                    Qty: {r.quantity} {r.unit} · Unit cost: {fmtMoney(r.currentCostPerUnit)} ·
                    Line cost: {fmtMoney(r.lineCost)}
                  </p>
                  {editingRecipeId === r.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="number"
                        min={0.01}
                        step="0.01"
                        value={editingQuantity}
                        onChange={(e) => setEditingQuantity(e.target.value)}
                        className="h-8 w-32 rounded-lg"
                      />
                      <Button
                        size="sm"
                        className="h-8 rounded-lg bg-primary-green text-white hover:bg-primary-green/90"
                        disabled={Number(editingQuantity) <= 0 || updateRecipe.isPending}
                        onClick={() => {
                          updateRecipe.mutate(
                            { recipeId: r.id, body: { quantity: Number(editingQuantity) } },
                            {
                              onSuccess: () => {
                                onMessage({ type: "success", text: "Recipe quantity updated." });
                                setEditingRecipeId(null);
                              },
                              onError: (err) =>
                                onMessage({
                                  type: "error",
                                  text:
                                    err instanceof Error
                                      ? err.message
                                      : "Failed to update recipe quantity.",
                                }),
                            }
                          );
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-light-border p-3">
            <h5 className="mb-2 text-sm font-semibold text-dark-text">Add Ingredient to Recipe</h5>
            <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
              <Select value={ingredientId} onValueChange={(v) => setIngredientId(v ?? "")}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select ingredient">
                    {(value) =>
                      ingredients.find((i) => i.id === value)?.name ?? "Select ingredient"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} ({i.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={0.01}
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="rounded-xl"
              />
              <Button
                className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
                disabled={!ingredientId || Number(quantity) <= 0 || addRecipe.isPending}
                onClick={() => {
                  addRecipe.mutate(
                    { ingredientId, quantity: Number(quantity) },
                    {
                      onSuccess: () => {
                        onMessage({ type: "success", text: "Ingredient added to recipe." });
                        setIngredientId("");
                        setQuantity("");
                      },
                      onError: (err) =>
                        onMessage({
                          type: "error",
                          text:
                            err instanceof Error
                              ? err.message
                              : "Failed to add ingredient to recipe.",
                        }),
                    }
                  );
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-light-border bg-white p-4">
          <h4 className="mb-3 font-semibold text-dark-text">Margin Breakdown</h4>
          {marginQuery.isLoading ? (
            <Skeleton className="h-36 rounded-xl" />
          ) : !margin || !margin.hasRecipe ? (
            <div className="rounded-xl bg-content p-4 text-sm text-medium-text">
              Add ingredients to see your margin.
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>Sale Price</span><span className="font-semibold">{fmtMoney(margin.salePrice)}</span></div>
              <div className="flex items-center justify-between"><span>Total Ingredient Cost</span><span>{fmtMoney(margin.totalIngredientCost)}</span></div>
              <div className="flex items-center justify-between"><span>Gross Margin</span><span className="text-primary-green">{fmtMoney(margin.grossMargin)} ({margin.grossMarginPercent.toFixed(2)}%)</span></div>
              <div className="flex items-center justify-between"><span>Platform Fee</span><span className="text-rider-red">-{fmtMoney(margin.platformFeeAmount)}</span></div>
              <div className="mt-2 flex items-center justify-between border-t pt-2 font-semibold"><span>Net Margin After Platform Fee</span><span>{fmtMoney(margin.netMarginAfterPlatformFee)}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-dark-text">Menu & Costs</h1>
        <p className="mt-1 text-sm text-medium-text">
          Manage suppliers, ingredients, recipes, and real item margins.
        </p>
      </div>

      <Tabs defaultValue="suppliers" className="flex w-full flex-col gap-4">
        <TabsList className="inline-flex h-11 w-fit items-center justify-start gap-1 rounded-xl border border-light-border bg-white p-1 text-medium-text shadow-sm">
          <TabsTrigger
            value="suppliers"
            className="rounded-lg px-4 py-2 text-sm font-medium text-medium-text shadow-none data-active:bg-content data-active:text-dark-text data-active:shadow-none"
          >
            Suppliers
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="rounded-lg px-4 py-2 text-sm font-medium text-medium-text shadow-none data-active:bg-content data-active:text-dark-text data-active:shadow-none"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="rounded-lg px-4 py-2 text-sm font-medium text-medium-text shadow-none data-active:bg-content data-active:text-dark-text data-active:shadow-none"
          >
            Menu Items & Recipes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="mt-0 outline-none">
          <SuppliersTab />
        </TabsContent>
        <TabsContent value="ingredients" className="mt-0 outline-none">
          <IngredientsTab />
        </TabsContent>
        <TabsContent value="menu" className="mt-0 outline-none">
          <MenuTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
