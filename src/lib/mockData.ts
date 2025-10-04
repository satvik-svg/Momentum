export interface Contest {
  id: string
  address: string
  question: string
  optionA: string
  optionB: string
  endTime: number
  isResolved: boolean
  winnerIsA?: boolean
  totalStakedOnA?: number
  totalStakedOnB?: number
  userStakeA?: number
  userStakeB?: number
  status: 'live' | 'ended' | 'revealed'
}

export const mockContests: Contest[] = [
  {
    id: '1',
    address: '0x1234567890123456789012345678901234567890',
    question: 'Will Bitcoin reach $100k before end of 2024?',
    optionA: 'Yes, Bitcoin to $100k',
    optionB: 'No, stays below $100k',
    endTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    isResolved: false,
    status: 'live',
    totalStakedOnA: 15420,
    totalStakedOnB: 8730,
  },
  {
    id: '2',
    address: '0x2345678901234567890123456789012345678901',
    question: 'Will the next iPhone feature a foldable display?',
    optionA: 'Yes, foldable iPhone',
    optionB: 'No, traditional design',
    endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
    isResolved: false,
    status: 'live',
    totalStakedOnA: 8900,
    totalStakedOnB: 12300,
  },
  {
    id: '3',
    address: '0x3456789012345678901234567890123456789012',
    question: 'Will Base become the #2 Ethereum L2 by TVL in 2024?',
    optionA: 'Yes, Base takes #2',
    optionB: 'No, stays #3 or lower',
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    isResolved: false,
    status: 'live',
    totalStakedOnA: 24500,
    totalStakedOnB: 18200,
  },
  {
    id: '4',
    address: '0x4567890123456789012345678901234567890123',
    question: 'Will AI agents create the first $1B on-chain company?',
    optionA: 'Yes, AI-first company',
    optionB: 'No, human-led still',
    endTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago (ended)
    isResolved: true,
    winnerIsA: true,
    status: 'revealed',
    totalStakedOnA: 34200,
    totalStakedOnB: 21800,
    userStakeA: 500,
  },
  {
    id: '5',
    address: '0x5678901234567890123456789012345678901234',
    question: 'Will the next big meme coin be AI-generated?',
    optionA: 'Yes, AI-generated meme',
    optionB: 'No, human-created',
    endTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago (ended)
    isResolved: true,
    winnerIsA: false,
    status: 'revealed',
    totalStakedOnA: 12400,
    totalStakedOnB: 18600,
    userStakeB: 200,
  },
]

export const getContestById = (id: string): Contest | undefined => {
  return mockContests.find(contest => contest.id === id)
}

export const getContestByAddress = (address: string): Contest | undefined => {
  return mockContests.find(contest => contest.address === address)
}

export const getLiveContests = (): Contest[] => {
  return mockContests.filter(contest => contest.status === 'live')
}

export const getEndedContests = (): Contest[] => {
  return mockContests.filter(contest => contest.status === 'revealed')
}