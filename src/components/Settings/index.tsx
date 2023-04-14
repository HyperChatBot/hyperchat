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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useRecoilState } from 'recoil'
import { LinearSettingIcon } from 'src/components/Icons'
import { settingsStore } from 'src/stores'

const Settings: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useRecoilState(
    settingsStore.modalVisibleState
  )
  const [settingsInfo, setSettingsInfo] = useRecoilState(
    settingsStore.settingsInfoState
  )

  const handleOpen = () => setModalVisible(!modalVisible)
  const handleShowPassword = () => setShowPassword(!showPassword)

  return (
    <>
      <LinearSettingIcon onClick={handleOpen} />
      <Modal
        isCentered
        onClose={handleOpen}
        isOpen={modalVisible}
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />

        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Secret Key</FormLabel>
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
              <FormLabel>Organization ID</FormLabel>
              <Input placeholder="Enter OpenAI Organization ID" />
            </FormControl>

            <Divider className="-ml-4 -mr-4 mb-8 mt-8" />

            <FormControl className="mb-4">
              <FormLabel>Assistant Avatar</FormLabel>
              <Input type="file" placeholder="Enter Organization ID" />
            </FormControl>
            <FormControl>
              <FormLabel>User Avatar</FormLabel>
              <Input type="file" placeholder="Enter Organization ID" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleOpen}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Settings
