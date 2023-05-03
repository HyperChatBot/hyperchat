import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FC } from 'react'
import { EmojiPickerProps } from 'src/types/global'

interface Props {
  onEmojiSelect: (data: EmojiPickerProps) => void
}

const EmojiPicker: FC<Props> = ({ onEmojiSelect }) => (
  <section className="absolute top-20 z-10">
    <Picker data={data} onEmojiSelect={onEmojiSelect} />
  </section>
)

export default EmojiPicker
