import { Info } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { Input } from 'src/components/ui/input'
import { Slider } from 'src/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from 'src/components/ui/tooltip'

interface Props {
  title: string
  tooltipTitle: string
  min: number
  max: number
  step: number
  defaultValue: number
  setFieldValue: (value: number) => void
}

const InputSlider: FC<Props> = ({
  title,
  tooltipTitle,
  min,
  max,
  step,
  defaultValue,
  setFieldValue
}) => {
  const [value, setValue] = useState<number>(defaultValue)

  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0])
    setFieldValue(newValue[0])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === '' ? defaultValue : Number(event.target.value)
    setValue(newValue)
  }

  const handleBlur = () => {
    let newValue = value

    if (value < min) {
      newValue = min
      setValue(min)
    } else if (value > max) {
      newValue = max
      setValue(max)
    }

    setFieldValue(newValue)
  }

  useEffect(() => {
    setValue((prev) => (prev > defaultValue ? defaultValue : prev))
  }, [defaultValue])

  return (
    <section className="my-8 flex flex-col">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <p className="text-sm font-bold">{title}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-accent ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipTitle}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-24"
          min={min}
          max={max}
          step={step}
        />
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleSliderChange}
      />
    </section>
  )
}

export default InputSlider
