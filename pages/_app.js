import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import { ApeDaoProvider } from '../context/context'
import '../styles/globals.css'

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Rinkeby

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ApeDaoProvider>
        <Component {...pageProps} />
      </ApeDaoProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
