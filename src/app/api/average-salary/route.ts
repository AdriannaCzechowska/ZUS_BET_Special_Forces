import { NextResponse } from 'next/server';
import { salaryData, regions } from '@/lib/data/salary-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const position = searchParams.get('position');
  const regionValue = searchParams.get('region');

  if (!position || !regionValue) {
    return NextResponse.json({ error: 'Missing position or region parameter' }, { status: 400 });
  }

  const positionData = salaryData[position];
  if (!positionData) {
    return NextResponse.json({ error: 'Position not found' }, { status: 404 });
  }
  
  const regionLabel = regions.find(r => r.value === regionValue)?.label || 'nieznany';

  const salary = positionData.regions[regionValue] || positionData.national_average;

  return NextResponse.json({
    region: regionLabel,
    position: position,
    salary: salary,
  });
}
