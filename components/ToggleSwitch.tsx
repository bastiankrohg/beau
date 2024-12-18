'use client'

import { Switch } from "components/ui/switch"

interface ToggleSwitchProps {
  onToggle: (checked: boolean) => void
  label: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onToggle, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="toggle-switch" onCheckedChange={onToggle} />
      <label
        htmlFor="toggle-switch"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
}

export default ToggleSwitch

