import { ICfgGitLab } from '../../src/backend/types/GitLab';

const gitlab: ICfgGitLab = {
  projects: {
    // examples in test.ts
  },
  jobSchedule: {
    every: 60,
    timeout: 300,
  },
};

export default gitlab;
