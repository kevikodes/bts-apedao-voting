import { useContext, useEffect, useState } from 'react'
import { ApeDaoContext } from '../context/context'
import { ethers } from 'ethers'
import styles from '../styles/Home.module.css'
import Login from '../components/Login'
import Header from '../components/Header'
import ProposalCard from '../components/ProposalCard'

export default function Home() {
  const [proposals, setProposals] = useState(null)
  const [proposalInput, setProposalInput] = useState('')

  const {
    getAllProposals,
    isExecutable,
    voteFor,
    address,
    createProposal,
    executeProposal,
    mintTokens,
  } = useContext(ApeDaoContext)

  useEffect(() => {
    getAllProposals()
      .then(proposals => {
        if (proposals.length > 0) {
          setProposals(proposals.reverse())
          console.log(proposals)
          isExecutable(proposals[0].proposalId)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className={styles.wrapper}>
      {address ? (
        <>
          <Header />

          {/* {address === '0x35d94e754F4c368F1A64B998751cd4d597Ae8fE6' && (
            <>
              <h3>Need More Tokens</h3>
              <button onClick={mintTokens}>mint</button>
            </>
          )} */}
          <div className={styles.content}>
            <div className={styles.createProposalForm}>
              <div className={styles.formTitle}>Make a Proposal</div>
              <input
                className={styles.formInput}
                placeholder='Make a Proposal'
                value={proposalInput}
                onChange={e => {
                  setProposalInput(e.target.value)
                }}
              />
              <button
                className={styles.formButton}
                disabled={!proposalInput}
                onClick={() => {
                  createProposal(proposalInput)
                }}
              >
                Submit
              </button>
            </div>

            <div className={styles.proposals}>
              {proposals &&
                proposals.map(proposal => {
                  return (
                    <ProposalCard key={Math.random()} proposal={proposal} />
                  )
                })}
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  )
}
