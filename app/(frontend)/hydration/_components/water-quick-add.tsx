'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, GlassWater } from 'lucide-react';
import { Bottle } from '@/components/icons';

interface WaterQuickAddProps {
  onAddWaterAction: (amount: number) => void;
}

export function WaterQuickAdd({ onAddWaterAction }: WaterQuickAddProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Add</CardTitle>
        <p>How much water did you drink today ?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => onAddWaterAction(1)}
          >
            <GlassWater className="h-6 w-6 mb-2 text-blue-500" />
            <span className="text-sm font-medium">Glass</span>
            <span className="text-xs text-muted-foreground">250ml</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => onAddWaterAction(2)}
          >
            <Bottle />
            {/*<Bottle className="h-6 w-6 mb-2 text-blue-500" />*/}
            <span className="text-sm font-medium">Bottle</span>
            <span className="text-xs text-muted-foreground">500ml</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => onAddWaterAction(4)}
          >
            <Droplet className="h-6 w-6 mb-2 text-blue-500" />
            <span className="text-sm font-medium">Large</span>
            <span className="text-xs text-muted-foreground">1L</span>
          </Button>
        </div>
        {/*custom slider here*/}
      </CardContent>
    </Card>
  );
}
