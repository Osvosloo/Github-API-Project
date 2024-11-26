import axios from 'axios';
import { GitHubUser , GitHubCommit } from '../types'; // Assuming you have a type for GitHub commits

export const fetchUser  = async (username: string): Promise<GitHubUser > => {
  const response = await axios.get<GitHubUser >(`https://api.github.com/users/${username}`);
  return response.data;
};

export const fetchCommitHistory = async (owner: string, repo: string, username: string): Promise<GitHubCommit[]> => {
  try {
    const response = await axios.get<GitHubCommit[]>(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      params: {
        author: username
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching commit history:', error);
    throw new Error('Failed to fetch commit history');
  }
};

fetchCommitHistory('octocat', 'Hello-World', 'octocat')
  .then(commits => console.log(commits))
  .catch(error => console.error('Error fetching commit history:', error));