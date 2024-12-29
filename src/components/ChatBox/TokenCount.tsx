import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import configurations from 'src/configurations'
import { conversationState } from 'src/stores/conversation'
import { companyState, configurationState } from 'src/stores/global'

const TokenCount: FC = () => {
  const conversation = useRecoilValue(conversationState)
  const company = useRecoilValue(companyState)
  const configuration = useRecoilValue(configurationState)
  const { models } = configurations[company]
  const { maxInput } =
    models.find((m) => m.modelName === configuration.model) ?? {}
  const usedTokenCount =
    conversation.messages.reduce((acc, val) => acc + val.tokenCount, 0) +
    configuration.systemMessageTokensCount

  return (
    <p className="absolute -bottom-5 right-0 text-10 text-black text-opacity-30 dark:text-dark-text-sub">
      Token count: {usedTokenCount} / {maxInput}
    </p>
  )
}

export default TokenCount
