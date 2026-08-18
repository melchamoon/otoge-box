'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useGameDataQuery, useCurrentData } from '@/hooks/useGameDataQuery';
import { countSheetsByDifficultyAndLevel } from '@/lib/utils/chart';
import type { Sheet } from '@/types';

const EChart = dynamic(() => import('echarts-for-react'), { ssr: false });

export function SheetDataChart({ sheets }: { sheets: Sheet[] }) { const data = useCurrentData(); useGameDataQuery(); const counts = useMemo(() => countSheetsByDifficultyAndLevel(sheets, data.difficulties.map((entry) => entry.difficulty), false), [data.difficulties, sheets]); const levels = useMemo(() => [...new Set(sheets.map((sheet) => sheet.levelValue).filter((value): value is number => value != null))].sort((a, b) => a - b), [sheets]); const series = [...counts.entries()].map(([difficulty, values]) => ({ name: difficulty ?? 'Other', type: 'bar', stack: 'default', data: levels.map((level) => values.get(level) ?? 0) })); const option = useMemo(() => ({ animation: false, tooltip: {}, legend: { type: 'scroll' }, xAxis: { type: 'category', data: levels.map(String) }, yAxis: { type: 'value' }, series }), [levels, series]); return <div className="min-w-[1000px] overflow-x-auto"><EChart option={option} style={{ height: 'calc(100vh - 200px)', minHeight: 420 }} opts={{ renderer: 'svg' }} /></div>; }
