import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Smoke, Luggage, Users } from 'lucide-react';

interface ComfortOptionsProps {
  smoking: 'no' | 'yes' | 'outside';
  maxLuggageItems: number;
  maxLuggageDimension: 'small' | 'medium' | 'large' | 'oversized';
  onSmokingChange: (value: 'no' | 'yes' | 'outside') => void;
  onLuggageItemsChange: (value: number) => void;
  onLuggageDimensionChange: (value: 'small' | 'medium' | 'large' | 'oversized') => void;
  isDriver?: boolean;
}

const SmokingOptions = [
  { value: 'no' as const, label: 'Interdit', icon: '🚭' },
  { value: 'outside' as const, label: 'Seulement dehors', icon: '🚪' },
  { value: 'yes' as const, label: 'Autorisé', icon: '🚬' },
];

const LuggageDimensions = [
  { value: 'small' as const, label: 'Petit (sac à dos, petit sac)' },
  { value: 'medium' as const, label: 'Moyen (valise cabine)' },
  { value: 'large' as const, label: 'Grand (valise standard)' },
  { value: 'oversized' as const, label: 'Très grand (colis volumineux)' },
];

export function ComfortOptions({
  smoking,
  maxLuggageItems,
  maxLuggageDimension,
  onSmokingChange,
  onLuggageItemsChange,
  onLuggageDimensionChange,
  isDriver = false,
}: ComfortOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Smoking Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smoke className="w-5 h-5" />
            {isDriver ? 'Politique de tabac' : 'Préférence fumeur/non-fumeur'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={smoking} onValueChange={onSmokingChange}>
            <div className="space-y-3">
              {SmokingOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={`smoking-${option.value}`} />
                  <Label
                    htmlFor={`smoking-${option.value}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="text-lg mr-2">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Luggage Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Luggage className="w-5 h-5" />
            {isDriver ? 'Capacité de bagages' : 'Bagages'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Number of items */}
          <div className="space-y-2">
            <Label htmlFor="luggage-items" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Nombre de bagages
            </Label>
            <div className="flex items-center gap-3">
              <input
                id="luggage-items"
                type="range"
                min="0"
                max="5"
                value={maxLuggageItems}
                onChange={(e) => onLuggageItemsChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                {maxLuggageItems}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {maxLuggageItems === 0
                ? 'Pas de bagages'
                : maxLuggageItems === 1
                  ? '1 bagage'
                  : `${maxLuggageItems} bagages`}
            </p>
          </div>

          {/* Max dimension */}
          <div className="space-y-2">
            <Label htmlFor="luggage-dimension">Dimension maximum acceptée</Label>
            <Select
              value={maxLuggageDimension}
              onValueChange={(val) =>
                onLuggageDimensionChange(val as 'small' | 'medium' | 'large' | 'oversized')
              }
            >
              <SelectTrigger id="luggage-dimension">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LuggageDimensions.map((dim) => (
                  <SelectItem key={dim.value} value={dim.value}>
                    {dim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Conseil:</span>{' '}
          {isDriver
            ? 'Indiquez clairement vos préférences pour attirer les bons passagers.'
            : 'Vérifiez les préférences du conducteur avant de réserver.'}
        </p>
      </div>
    </div>
  );
}
