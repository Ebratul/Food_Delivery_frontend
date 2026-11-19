// Data hooks shared across pages (React Query + API client).
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get } from "../lib/api.js";

export const useCategories = () => useQuery({ queryKey: ["categories"], queryFn: () => get("/categories"), staleTime: 10 * 60_000 });
export const usePublicStats = () => useQuery({ queryKey: ["stats"], queryFn: () => get("/stats"), staleTime: 5 * 60_000 });

export const useRestaurants = (params) =>
  useQuery({ queryKey: ["restaurants", params], queryFn: () => get("/restaurants", params), placeholderData: keepPreviousData });

export const useRestaurant = (slug) => useQuery({ queryKey: ["restaurant", slug], queryFn: () => get(`/restaurants/${slug}`), enabled: Boolean(slug) });

export const usePaged = (key, url, params, options = {}) =>
  useQuery({ queryKey: [...key, params], queryFn: () => get(url, params), placeholderData: keepPreviousData, ...options });
