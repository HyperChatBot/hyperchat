import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import configurations from 'src/configurations'
import { useDB } from 'src/hooks'
import { companyState, configurationState } from 'src/stores/global'
import { Configuration } from 'src/types/conversation'

const useConfiguration = () => {
  const company = useRecoilValue(companyState)
  const [configuration, setConfiguration] = useRecoilState(configurationState)
  const { updateOneById, insertOne, toArray } = useDB('configurations')

  const initialConfiguration = async () => {
    const { configuration: defaultConfiguration } = configurations[company]

    await insertOne(defaultConfiguration)
    setConfiguration(defaultConfiguration)
  }

  const updateConfiguration = async (configuration: Configuration) => {
    await updateOneById(configuration.company, configuration)
  }

  const getConfiguration = async () => {
    const configurations = await toArray<Configuration>()
    const configurationByCompany = configurations.find(
      (configuration) => configuration.company === company
    )

    if (configurationByCompany) {
      setConfiguration(configurationByCompany)
    } else {
      await initialConfiguration()
    }
  }

  useEffect(() => {
    getConfiguration()
  }, [company])

  return { configuration, updateConfiguration, initialConfiguration }
}

export default useConfiguration
