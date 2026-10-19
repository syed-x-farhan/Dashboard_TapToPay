"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { merchantAPI, unwrapData, unwrapList } from "@/lib/api";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Ingredient {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  unit: string;
  currentCost: number;
  isActive: boolean;
}

export interface IngredientPriceHistory {
  id: string;
  ingredientId: string;
  cost: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface MenuItem {
  id: string;
  name: string;
  salePrice: number;
  category: string;
  isActive: boolean;
}

export interface RecipeLineItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  currentCostPerUnit: number;
  lineCost: number;
}

export interface MenuItemMargin {
  salePrice: number;
  totalIngredientCost: number;
  grossMargin: number;
  grossMarginPercent: number;
  platformFeeAmount: number;
  netMarginAfterPlatformFee: number;
  hasRecipe: boolean;
}

const menuKeys = {
  suppliers: ["merchant", "menu", "suppliers"] as const,
  supplier: (id: string) => ["merchant", "menu", "suppliers", id] as const,
  ingredients: (supplierId?: string) =>
    ["merchant", "menu", "ingredients", supplierId ?? "all"] as const,
  ingredient: (id: string) => ["merchant", "menu", "ingredients", id] as const,
  ingredientPriceHistory: (id: string) =>
    ["merchant", "menu", "ingredients", id, "price-history"] as const,
  menuItems: ["merchant", "menu", "items"] as const,
  menuItem: (id: string) => ["merchant", "menu", "items", id] as const,
  recipe: (menuItemId: string) =>
    ["merchant", "menu", "items", menuItemId, "recipe"] as const,
  margin: (id: string) => ["merchant", "menu", "items", id, "margin"] as const,
  margins: ["merchant", "menu", "items", "margins"] as const,
};

const num = (v: unknown, fallback = 0) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) ? n : fallback;
};

const bool = (v: unknown, fallback = true) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v.toLowerCase() !== "false";
  return fallback;
};

function normalizeSupplier(row: Record<string, unknown>): Supplier {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    contactPerson: String(row.contactPerson ?? row.contact_person ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    isActive: bool(row.isActive ?? row.is_active, true),
  };
}

function normalizeIngredient(row: Record<string, unknown>): Ingredient {
  const supplier = (row.supplier ?? row.Supplier) as Record<string, unknown> | undefined;
  const latestPrice = (row.latestPrice ?? row.latest_price ?? row.currentPrice) as
    | Record<string, unknown>
    | undefined;

  return {
    id: String(row.id ?? ""),
    supplierId: String(
      row.supplierId ?? row.supplier_id ?? supplier?.id ?? ""
    ),
    supplierName: String(
      row.supplierName ??
        row.supplier_name ??
        supplier?.name ??
        ""
    ),
    name: String(row.name ?? ""),
    unit: String(row.unit ?? "piece"),
    currentCost: num(
      row.currentCost ??
        row.current_cost ??
        row.cost ??
        row.unitCost ??
        row.unit_cost ??
        row.price ??
        latestPrice?.cost ??
        latestPrice?.currentCost ??
        latestPrice?.current_cost
    ),
    isActive: bool(row.isActive ?? row.is_active, true),
  };
}

function normalizeRecipe(row: Record<string, unknown>): RecipeLineItem {
  const quantity = num(row.quantity);
  const currentCostPerUnit = num(
    row.currentCostPerUnit ?? row.current_cost_per_unit ?? row.currentCost
  );
  return {
    id: String(row.id ?? ""),
    ingredientId: String(row.ingredientId ?? row.ingredient_id ?? ""),
    ingredientName: String(row.ingredientName ?? row.ingredient_name ?? ""),
    unit: String(row.unit ?? "piece"),
    quantity,
    currentCostPerUnit,
    lineCost:
      num(row.lineCost ?? row.line_cost) || Number((quantity * currentCostPerUnit).toFixed(2)),
  };
}

function normalizeMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    salePrice: num(row.salePrice ?? row.sale_price),
    category: String(row.category ?? "General"),
    isActive: bool(row.isActive ?? row.is_active, true),
  };
}

function normalizeMargin(row: Record<string, unknown>): MenuItemMargin {
  return {
    salePrice: num(row.salePrice ?? row.sale_price),
    totalIngredientCost: num(row.totalIngredientCost ?? row.total_ingredient_cost),
    grossMargin: num(row.grossMargin ?? row.gross_margin),
    grossMarginPercent: num(row.grossMarginPercent ?? row.gross_margin_percent),
    platformFeeAmount: num(row.platformFeeAmount ?? row.platform_fee_amount),
    netMarginAfterPlatformFee: num(
      row.netMarginAfterPlatformFee ?? row.net_margin_after_platform_fee
    ),
    hasRecipe: bool(row.hasRecipe ?? row.has_recipe, false),
  };
}

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: menuKeys.suppliers,
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/suppliers");
      return unwrapList(res).map((row) =>
        normalizeSupplier(row as Record<string, unknown>)
      );
    },
  });
}

export function useSupplier(id: string) {
  return useQuery<Supplier>({
    queryKey: menuKeys.supplier(id),
    queryFn: async () => {
      const res = await merchantAPI.get(`/api/v1/merchant/suppliers/${id}`);
      return normalizeSupplier(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
    enabled: !!id,
  });
}

export function useAddSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      category: string;
      contactPerson: string;
      phone: string;
      email: string;
    }) => merchantAPI.post("/api/v1/merchant/suppliers", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: menuKeys.suppliers }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        name: string;
        category: string;
        contactPerson: string;
        phone: string;
        email: string;
        isActive?: boolean;
      };
    }) => merchantAPI.patch(`/api/v1/merchant/suppliers/${id}`, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: menuKeys.suppliers });
      qc.invalidateQueries({ queryKey: menuKeys.supplier(id) });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      merchantAPI.delete(`/api/v1/merchant/suppliers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: menuKeys.suppliers }),
  });
}

export function useIngredients(supplierId?: string) {
  return useQuery<Ingredient[]>({
    queryKey: menuKeys.ingredients(supplierId),
    queryFn: async () => {
      const query = supplierId ? `?supplierId=${encodeURIComponent(supplierId)}` : "";
      const res = await merchantAPI.get(`/api/v1/merchant/ingredients${query}`);
      return unwrapList(res).map((row) =>
        normalizeIngredient(row as Record<string, unknown>)
      );
    },
  });
}

export function useIngredient(id: string) {
  return useQuery<Ingredient>({
    queryKey: menuKeys.ingredient(id),
    queryFn: async () => {
      const res = await merchantAPI.get(`/api/v1/merchant/ingredients/${id}`);
      return normalizeIngredient(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
    enabled: !!id,
  });
}

export function useAddIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      supplierId: string;
      name: string;
      unit: string;
      currentCost: number;
    }) => merchantAPI.post("/api/v1/merchant/ingredients", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchant", "menu", "ingredients"] });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        supplierId?: string;
        name?: string;
        unit?: string;
        isActive?: boolean;
      };
    }) => merchantAPI.patch(`/api/v1/merchant/ingredients/${id}`, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["merchant", "menu", "ingredients"] });
      qc.invalidateQueries({ queryKey: menuKeys.ingredient(id) });
      qc.invalidateQueries({ queryKey: menuKeys.recipe(id) });
    },
  });
}

export function useUpdateIngredientPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      newCostPerUnit,
    }: {
      id: string;
      newCostPerUnit: number;
    }) =>
      merchantAPI.patch(`/api/v1/merchant/ingredients/${id}/price`, {
        newCostPerUnit,
      }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["merchant", "menu", "ingredients"] });
      qc.invalidateQueries({ queryKey: menuKeys.ingredient(id) });
      qc.invalidateQueries({ queryKey: menuKeys.ingredientPriceHistory(id) });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useIngredientPriceHistory(id: string) {
  return useQuery<IngredientPriceHistory[]>({
    queryKey: menuKeys.ingredientPriceHistory(id),
    queryFn: async () => {
      const res = await merchantAPI.get(
        `/api/v1/merchant/ingredients/${id}/price-history`
      );
      return unwrapList(res).map((row) => {
        const r = row as Record<string, unknown>;
        return {
          id: String(r.id ?? ""),
          ingredientId: String(r.ingredientId ?? r.ingredient_id ?? id),
          cost: num(r.cost ?? r.currentCost ?? r.current_cost),
          effectiveFrom: String(r.effectiveFrom ?? r.effective_from ?? ""),
          effectiveTo:
            r.effectiveTo !== undefined || r.effective_to !== undefined
              ? String(r.effectiveTo ?? r.effective_to ?? "")
              : null,
        } as IngredientPriceHistory;
      });
    },
    enabled: !!id,
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      merchantAPI.delete(`/api/v1/merchant/ingredients/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchant", "menu", "ingredients"] });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useMenuItems() {
  return useQuery<MenuItem[]>({
    queryKey: menuKeys.menuItems,
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/menu-items");
      return unwrapList(res).map((row) =>
        normalizeMenuItem(row as Record<string, unknown>)
      );
    },
  });
}

export function useMenuItem(id: string) {
  return useQuery<MenuItem>({
    queryKey: menuKeys.menuItem(id),
    queryFn: async () => {
      const res = await merchantAPI.get(`/api/v1/merchant/menu-items/${id}`);
      return normalizeMenuItem(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
    enabled: !!id,
  });
}

export function useAddMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; salePrice: number; category: string }) =>
      merchantAPI.post("/api/v1/merchant/menu-items", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: menuKeys.menuItems });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { name?: string; salePrice?: number; category?: string; isActive?: boolean };
    }) => merchantAPI.patch(`/api/v1/merchant/menu-items/${id}`, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: menuKeys.menuItems });
      qc.invalidateQueries({ queryKey: menuKeys.menuItem(id) });
      qc.invalidateQueries({ queryKey: menuKeys.margin(id) });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      merchantAPI.delete(`/api/v1/merchant/menu-items/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: menuKeys.menuItems });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useRecipe(menuItemId: string) {
  return useQuery<RecipeLineItem[]>({
    queryKey: menuKeys.recipe(menuItemId),
    queryFn: async () => {
      const res = await merchantAPI.get(
        `/api/v1/merchant/menu-items/${menuItemId}/recipe`
      );
      return unwrapList(res).map((row) =>
        normalizeRecipe(row as Record<string, unknown>)
      );
    },
    enabled: !!menuItemId,
  });
}

export function useAddRecipeIngredient(menuItemId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { ingredientId: string; quantity: number }) =>
      merchantAPI.post(`/api/v1/merchant/menu-items/${menuItemId}/recipe`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: menuKeys.recipe(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margin(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useUpdateRecipeIngredient(menuItemId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      recipeId,
      body,
    }: {
      recipeId: string;
      body: { ingredientId?: string; quantity?: number };
    }) =>
      merchantAPI.patch(
        `/api/v1/merchant/menu-items/${menuItemId}/recipe/${recipeId}`,
        body
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: menuKeys.recipe(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margin(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useDeleteRecipeIngredient(menuItemId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) =>
      merchantAPI.delete(
        `/api/v1/merchant/menu-items/${menuItemId}/recipe/${recipeId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: menuKeys.recipe(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margin(menuItemId) });
      qc.invalidateQueries({ queryKey: menuKeys.margins });
    },
  });
}

export function useMenuItemMargin(id: string) {
  return useQuery<MenuItemMargin>({
    queryKey: menuKeys.margin(id),
    queryFn: async () => {
      const res = await merchantAPI.get(`/api/v1/merchant/menu-items/${id}/margin`);
      return normalizeMargin(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
    enabled: !!id,
  });
}

export function useAllMenuItemMargins() {
  return useQuery<Record<string, MenuItemMargin>>({
    queryKey: menuKeys.margins,
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/menu-items/margins");
      const data = unwrapData<unknown>(res);
      const out: Record<string, MenuItemMargin> = {};
      if (Array.isArray(data)) {
        for (const row of data) {
          const r = row as Record<string, unknown>;
          const menuItemId = String(r.menuItemId ?? r.menu_item_id ?? r.id ?? "");
          if (!menuItemId) continue;
          out[menuItemId] = normalizeMargin(r);
        }
        return out;
      }
      if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        for (const [key, value] of Object.entries(obj)) {
          if (!value || typeof value !== "object") continue;
          out[key] = normalizeMargin(value as Record<string, unknown>);
        }
      }
      return out;
    },
  });
}
