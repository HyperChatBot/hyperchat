import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Switch
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { FC, useState } from 'react'

const Settings: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  return (
    <section className="w-full">
      <p className=" pb-4 pl-8 pr-8 pt-4 text-xl font-semibold dark:text-white">Settings</p>
      <Divider />

      <section className="mb-4 ml-8 mr-8 mt-4">
        <FormControl isRequired>
          <FormLabel className="dark:text-white">Secret Key</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter OpenAI Secret Key"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText className="mb-4">
            Your secret key will only be stored in{' '}
            <Link
              href="https://en.wikipedia.org/wiki/Indexed_Database_API"
              isExternal
              color="teal.500"
            >
              IndexedDB
            </Link>
            .
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel className="dark:text-white">Organization ID</FormLabel>
          <Input placeholder="Enter OpenAI Organization ID" />
        </FormControl>

        <Divider className="mb-8 mt-8" />

        <FormControl className="mb-4">
          <FormLabel className="dark:text-white">Assistant Avatar</FormLabel>
          <Input type="file" placeholder="Enter Organization ID" />
        </FormControl>
        <FormControl>
          <FormLabel className="dark:text-white">User Avatar</FormLabel>
          <Input type="file" placeholder="Enter Organization ID" />
        </FormControl>

        <Divider className="mb-8 mt-8" />

        <FormControl>
          <FormLabel className="dark:text-white">Chat Completion Model</FormLabel>
          <Select
            colorScheme="purple"
            defaultValue={{
              label: 'gpt-3.5-turbo',
              value: 'gpt-3.5-turbo'
            }}
            options={[
              {
                label: 'gpt-3.5-turbo',
                value: 'gpt-3.5-turbo'
              },
              {
                label: 'gpt-4',
                value: 'gpt-4'
              }
            ]}
          />
        </FormControl>

        <FormControl className="mt-8">
          <FormLabel className="dark:text-white">Stream Mode</FormLabel>
          <Switch size="lg" />
        </FormControl>
      </section>
    </section>
  )
}

export default Settings
