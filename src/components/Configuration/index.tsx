import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { configurationDrawerVisibleState } from 'src/stores/global'
import Divider from '../Divider'
import InputSlider from './InputSlider'

const Configuration: FC = () => {
  const [visible, setVisible] = useRecoilState(configurationDrawerVisibleState)

  return (
    <Drawer anchor="right" open={visible} onClose={() => setVisible(false)}>
      <section className="w-87.75">
        <section className="flex h-22 items-center justify-between pl-6">
          <span className="text-xl font-semibold dark:text-dark-text">
            Configuration
          </span>
        </section>

        <Divider />

        <section className="m-6">
          <TextField
            variant="standard"
            fullWidth
            id="outlined-multiline-static"
            label="System Message"
            multiline
            rows={4}
            placeholder="Eg: You are an AI assistant that helps people find information."
            defaultValue="You are an AI assistant that helps people find information."
          />

          <InputSlider
            title="Max response"
            tooltipTitle="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text."
            min={1}
            max={4000}
            step={1}
            defaultValue={800}
          />
          <InputSlider
            title="Temperature"
            tooltipTitle="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both."
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.7}
          />
          <InputSlider
            title="Top P"
            tooltipTitle="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both."
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.95}
          />
          <InputSlider
            title="Frequency penalty"
            tooltipTitle="Reduce the chance of repeating a token proportionally based on how often it has appeared in the text so far. This decreases the likelihood of repeating the exact same text in a response."
            min={0}
            max={2}
            step={0.01}
            defaultValue={0}
          />
          <InputSlider
            title="Presence penalty"
            tooltipTitle="Reduce the chance of repeating any token that has appeared in the text at all so far. This increases the likelihood of introducing new topics in a response."
            min={0}
            max={2}
            step={0.01}
            defaultValue={0}
          />
        </section>
      </section>
    </Drawer>
  )
}

export default Configuration
