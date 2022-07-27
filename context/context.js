import { createContext, useEffect, useState } from 'react'
import {
  useVote,
  useToken,
  useAddress,
  useMetamask,
  useDisconnect,
} from '@thirdweb-dev/react'
import { VoteType } from '@thirdweb-dev/sdk'
import { ethers } from 'ethers'

export const ApeDaoContext = createContext()
export const ApeDaoProvider = ({ children }) => {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const disconnectWallet = useDisconnect()
  const vote = useVote('0x258dec430116991dDE0990Ed119e4662F9908c57')
  const token = useToken('0xd7c2d99fdA889f46a896A69a54e6Ea9abCE6e9C1')

  const mintTokens = async () => {
    try {
      const toAddress = address
      const amount = '1000'
      const tx = await token.mintTo(toAddress, amount)
      console.log(tx)
    } catch (error) {
      console.log(error)
    }
  }

  //   useEffect(() => {
  //     ;(async () => {
  //       try {
  //         // Give our treasury the power to mint additional token if needed.
  //         await token.roles.grant('minter', vote.getAddress())

  //         console.log(
  //           'Successfully gave vote contract permissions to act on token contract',
  //         )
  //       } catch (error) {
  //         console.error(
  //           'failed to grant vote contract permissions on token contract',
  //           error,
  //         )
  //         process.exit(1)
  //       }
  //     })()
  //   }, [])

  const getAllProposals = async () => {
    const proposals = await vote.getAll()
    return proposals
  }
  const isExecutable = async id => {
    const canExecute = await vote.canExecute(id)
    return canExecute
  }
  const checkIfVoted = async id => {
    const res = await vote.hasVoted(id, address)
    console.log(res, 'hasVoted')
    return res
  }

  const createProposal = async description => {
    const amount = 100_000
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode('mintTo', [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ]
    const proposal = await vote.propose(description, executions)
    console.log(proposal)
  }
  // const createProposal = async description => {
  //   const amount = 100
  //   const executions = [
  //     {
  //       nativeTokenValue: 0,
  //       transactionData: token.encoder.encode('transfer', [
  //         '0x25729A32F5C7F825Ee06b7c58fF3d1A08AD86C6c',
  //         ethers.utils.parseUnits(amount.toString(), 18),
  //       ]),
  //       toAddress: token.getAddress(),
  //     },
  //   ]
  //   const proposal = await vote.propose(description, executions)
  //   console.log(proposal)
  // }

  const executeProposal = async id => {
    const canExecute = await isExecutable(id)
    if (canExecute) {
      const res = await vote.execute(id)
      console.log(res)
    } else {
      console.log('Can not execute')
    }
  }

  const voteFor = async (id, type, reason) => {
    try {
      const delegation = await token.getDelegationOf(address)
      if (delegation === ethers.constants.AddressZero) {
        await token.delegateTo(address)
      }
      let voteType
      if (type === 'Against') {
        voteType = VoteType.Against
      } else if (type === 'For') {
        voteType = VoteType.For
      } else {
        voteType = VoteType.Abstain
      }
      const res = await checkIfVoted(id)
      if (!res) {
        await vote.vote(id, voteType, reason)
      } else {
        console.log('You have already voted for this proposal')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ApeDaoContext.Provider
      value={{
        getAllProposals,
        isExecutable,
        voteFor,
        createProposal,
        address,
        connectWithMetamask,
        disconnectWallet,
        executeProposal,
        mintTokens,
      }}
    >
      {children}
    </ApeDaoContext.Provider>
  )
}
