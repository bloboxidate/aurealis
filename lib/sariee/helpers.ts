import 'server-only';

import { sarieeFetch } from './client';
import { extractArray, asRecord } from './json-helpers';

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return null; }
}

export type SarieeCity = {
  id: string | number;
  name: string;
  name_ar: string;
  state_id?: string | number;
};

export type SarieeState = {
  id: string | number;
  name: string;
  name_ar: string;
  country_id?: string | number;
};

function mapCity(raw: unknown): SarieeCity | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = r.id ?? r.city_id;
  if (id === undefined || id === null) return null;
  return {
    id: typeof id === 'number' ? id : String(id),
    name: String(r.name ?? r.name_en ?? r.city_name ?? ''),
    name_ar: String(r.name_ar ?? r.name_arabic ?? r.name ?? ''),
    state_id: r.state_id !== undefined ? (typeof r.state_id === 'number' ? r.state_id : String(r.state_id)) : r.governorate_id !== undefined ? (typeof r.governorate_id === 'number' ? r.governorate_id : String(r.governorate_id)) : undefined,
  };
}

function mapState(raw: unknown): SarieeState | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = r.id ?? r.state_id ?? r.governorate_id;
  if (id === undefined || id === null) return null;
  return {
    id: typeof id === 'number' ? id : String(id),
    name: String(r.name ?? r.name_en ?? r.state_name ?? r.governorate_name ?? ''),
    name_ar: String(r.name_ar ?? r.name_arabic ?? r.name ?? ''),
    country_id: r.country_id !== undefined ? (typeof r.country_id === 'number' ? r.country_id : String(r.country_id)) : undefined,
  };
}

export async function fetchSarieeCities(stateId?: string | number): Promise<SarieeCity[]> {
  const qs = stateId ? `?state_id=${encodeURIComponent(String(stateId))}` : '';
  const res = await sarieeFetch(`/api/frontend/helper/cities${qs}`, { method: 'GET' });
  if (!res.ok) return [];
  const json = tryParse(await res.text());
  return extractArray(json).map(mapCity).filter(Boolean) as SarieeCity[];
}

export async function fetchSarieeStates(countryId?: string | number): Promise<SarieeState[]> {
  const qs = countryId ? `?country_id=${encodeURIComponent(String(countryId))}` : '';
  const res = await sarieeFetch(`/api/frontend/helper/state${qs}`, { method: 'GET' });
  if (!res.ok) return [];
  const json = tryParse(await res.text());
  return extractArray(json).map(mapState).filter(Boolean) as SarieeState[];
}

export async function fetchSarieeCurrencyRate(): Promise<number | null> {
  const res = await sarieeFetch('/api/frontend/helper/currency-rate', { method: 'GET' });
  if (!res.ok) return null;
  const json = tryParse(await res.text());
  const r = asRecord(json);
  const rate = r?.rate ?? r?.currency_rate ?? asRecord(r?.data)?.rate;
  return typeof rate === 'number' ? rate : null;
}
