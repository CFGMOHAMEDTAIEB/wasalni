import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DollarSign } from 'lucide-react';

type PriceModeType = 'free' | 'negotiable' | 'fixed';

interface PriceModeProps {
  mode: PriceModeType;
  amount?: number;
  onModeChange: (mode: PriceModeType) => void;
  onAmountChange: (amount: number) => void;
}

const PriceBadges = {
  free: { label: 'Gratuit', color: 'bg-green-100 text-green-800' },
  negotiable: { label: 'Négociable', color: 'bg-amber-100 text-amber-800' },
  fixed: { label: 'Prix fixe', color: 'bg-blue-100 text-blue-800' },
};

export function PriceMode({ mode, amount, onModeChange, onAmountChange }: PriceModeProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Label className="text-base font-semibold mb-4 block">Mode de prix</Label>
        
        <RadioGroup value={mode} onValueChange={(val) => onModeChange(val as PriceModeType)}>
          <div className="space-y-3">
            {/* Free Option */}
            <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition">
              <RadioGroupItem value="free" id="price-free" />
              <Label htmlFor="price-free" className="flex-1 cursor-pointer">
                <div className="font-medium">Gratuit</div>
                <div className="text-sm text-gray-600">Partage sans compensation financière</div>
              </Label>
              <span className={`px-2 py-1 rounded text-xs font-medium ${PriceBadges.free.color}`}>
                Gratuit
              </span>
            </div>

            {/* Negotiable Option */}
            <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-200 hover:bg-amber-50 transition">
              <RadioGroupItem value="negotiable" id="price-negotiable" />
              <Label htmlFor="price-negotiable" className="flex-1 cursor-pointer">
                <div className="font-medium">Prix négociable</div>
                <div className="text-sm text-gray-600">Discutez du prix avec les passagers</div>
              </Label>
              <span className={`px-2 py-1 rounded text-xs font-medium ${PriceBadges.negotiable.color}`}>
                À débattre
              </span>
            </div>

            {/* Fixed Price Option */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 transition">
              <RadioGroupItem value="fixed" id="price-fixed" className="mt-3" />
              <div className="flex-1">
                <Label htmlFor="price-fixed" className="cursor-pointer">
                  <div className="font-medium">Prix fixe</div>
                  <div className="text-sm text-gray-600">Montant défini par place</div>
                </Label>
                {mode === 'fixed' && (
                  <div className="mt-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      min="1"
                      step="0.5"
                      placeholder="Montant en DT"
                      value={amount || ''}
                      onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                    <span className="text-sm font-medium text-gray-600">DT/place</span>
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${PriceBadges.fixed.color} whitespace-nowrap`}>
                {mode === 'fixed' && amount ? `${amount} DT` : 'Prix fixe'}
              </span>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Commission Info */}
      {mode === 'fixed' && amount && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Commission estimée:</span> {(amount * 0.1).toFixed(2)} DT (10%) ou {(amount * 0.05).toFixed(2)} DT (5% si vérifié)
          </p>
        </div>
      )}
    </div>
  );
}

export { PriceBadges };
export type { PriceModeType };
