import { BaseContract, ContractInterface } from "ethers"

export interface Candidate {
  id: string
  name: string
  voteCount: string
}

export interface VotingSystem extends BaseContract {
  getCandidates(): Promise<Array<{
    id: bigint;
    name: string;
    voteCount: bigint;
  }>>;
  vote(candidateId: string): Promise<any>;
  hasVoted(address: string): Promise<boolean>;
  getVotedCandidate(address: string): Promise<bigint>;
  electionActive(): Promise<boolean>;
  toggleElectionStatus(): Promise<any>;
} 