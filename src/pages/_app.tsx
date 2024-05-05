import { Logo } from '@app/components/Logo'
import { globalStyles } from '@app/styles/global'
import { AppContainer, HeaderContainer } from '@app/styles/module'
import type { AppProps } from 'next/app'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContainer>
      <HeaderContainer>
        <Logo />
      </HeaderContainer>
      <Component {...pageProps} />
    </AppContainer>
  )
}
