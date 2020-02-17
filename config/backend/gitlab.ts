import { ICfgGitLab } from '../../src/backend/types/GitLab';

const gitlab: ICfgGitLab = {
  projects: {
    proj1: {
      name: 'Project 1', fullPath: 'test/project1',
    },
    proj2: {
      name: 'Project 2', fullPath: 'project2',
    },
    proj3: {
      name: 'Project 3',
      fullPath: 'test/project3',
      environments: [20, 22],
    },
  },
  jobSchedule: {
    every: 60,
    timeout: 300,
  },
};

export default gitlab;
