import configurations from '@/lib/ai/configurations'
import { configurationAtom, conversationAtom } from '@/stores/conversation'
import { companyAtom } from '@/stores/global'
import { useAtomValue } from 'jotai'
import { FC } from 'react'

const TokenCount: FC = () => {
  const conversation = useAtomValue(conversationAtom)
  const company = useAtomValue(companyAtom)
  const configuration = useAtomValue(configurationAtom)
  const { models } = configurations[company]
  const { maxInput } =
    models.find((m) => m.modelName === configuration.model) ?? {}
  const usedTokenCount =
    conversation?.messages.reduce((acc, val) => acc + val.tokenCount, 0) +
    configuration.systemMessageTokensCount

  return (
    <p className="text-opacity-30 absolute right-0 -bottom-5 text-[10px]">
      Token count: {usedTokenCount} / {maxInput}
    </p>
  )
}

export default TokenCount
