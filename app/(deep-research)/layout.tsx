import { Provider } from 'jotai'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Provider>{children}</Provider>
}
