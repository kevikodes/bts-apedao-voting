import { useContext, useEffect, useMemo, useState } from 'react'
import styles from '../styles/ProposalCard.module.css'
import { ethers } from 'ethers'
import { ApeDaoContext } from '../context/context'
import truncateEthAddress from 'truncate-eth-address'

const ProposalCard = ({ proposal }) => {
  const { address, voteFor, executeProposal } = useContext(ApeDaoContext)
  const [statusText, setStatusText] = useState('')
  const [statusColor, setStatusColor] = useState('#fff')

  const setStatus = () => {
    switch (proposal.state) {
      case 1:
        setStatusText('Active')
        setStatusColor('#21b66f')
        break
      case 3:
        setStatusText('Defeated')
        setStatusColor('#f44336')
        break
      case 7:
        setStatusText('Executed')
        setStatusColor('#0011ff')
        break
      case 4:
        setStatusText('Successful')
        setStatusColor('#21b66f')
        break
      default:
        setStatusText('Unknown')
        setStatusColor('#fff')
    }
  }

  useMemo(() => {
    setStatus()
    console.log('setStatus')
  }, [statusText, statusColor, proposal.state])
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.proposer}>
            Proposer: {truncateEthAddress(proposal.proposer)}
          </div>

          <div className={styles.description}>{proposal.description}</div>
        </div>
        <div className={styles.status} style={{ backgroundColor: statusColor }}>
          {statusText}
        </div>
      </div>
      {proposal.votes.map(vote => {
        return (
          <>
            <button
              className={styles.voteButton}
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
      <div className={styles.bottom}>
        <div className={styles.results}>
          {proposal.votes.map(vote => {
            const voteCount = ethers.utils.formatEther(vote.count)

            return (
              <div key={Math.random()}>
                <div>
                  {vote.label}: {Math.trunc(voteCount)} APE Coins
                </div>
              </div>
            )
          })}
        </div>
        {address === '0x35d94e754F4c368F1A64B998751cd4d597Ae8fE6' &&
          proposal.state === 4 && (
            <button
              className={styles.executeButton}
              onClick={() => {
                executeProposal(proposal.proposalId)
              }}
            >
              Execute
            </button>
          )}
      </div>
    </div>
  )
}

export default ProposalCard
