export interface GitHubUser {
  login: string;
  name: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
}

export interface favorite {
  owner: string;
  repo: string;
  sha: string;
  commitMessage: string;
  authorName: string;
  date: string;
}
