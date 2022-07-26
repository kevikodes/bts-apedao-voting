import { useContext, useEffect, useState } from 'react'
import { ApeDaoContext } from '../context/context'

export default function Home() {
  const [proposals, setProposals] = useState(null)
  const [proposalInput, setProposalInput] = useState('')

  const {
    getAllProposals,
    isExecutable,
    voteFor,
    address,
    connectWithMetamask,
    disconnectWallet,
    createProposal,
    executeProposal,
    userBalance,
  } = useContext(ApeDaoContext)

  useEffect(() => {
    getAllProposals()
      .then(proposals => {
        if (proposals.length > 0) {
          setProposals(proposals)
          console.log(proposals)
          isExecutable(proposals[0].proposalId)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      {address ? (
        <>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>

          {userBalance && <p>Your balance: {userBalance} APE Coins</p>}

          <h2>Make a Proposal</h2>
          <input
            placeholder='Make a Proposal'
            value={proposalInput}
            onChange={e => {
              setProposalInput(e.target.value)
            }}
          />
          <button
            disabled={!proposalInput}
            onClick={() => {
              createProposal(proposalInput)
            }}
          >
            Submit
          </button>

          {proposals &&
            proposals.map(proposal => {
              return (
                <div key={Math.random()}>
                  <h4>Proposer: {proposal.proposer}</h4>
                  <div>{proposal.description}</div>
                  {proposal.votes.map(vote => {
                    return (
                      <>
                        <button
                          key={Math.random()}
                          onClick={() => {
                            voteFor(proposal.proposalId, vote.label, '')
                          }}
                        >
                          {vote.label}
                        </button>
                      </>
                    )
                  })}
                  {address === '0x35d94e754F4c368F1A64B998751cd4d597Ae8fE6' && (
                    <button
                      onClick={() => {
                        executeProposal(proposal.proposalId)
                      }}
                    >
                      Execute
                    </button>
                  )}
                </div>
              )
            })}
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
    </div>
  )
}
