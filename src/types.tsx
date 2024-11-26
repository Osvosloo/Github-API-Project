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
  sha: string; // The SHA of the commit
  commit: {
    author: {
      name: string; // The name of the author
      email: string; // The email of the author
      date: string; // The date of the commit
    };
    committer: {
      name: string; // The name of the committer
      email: string; // The email of the committer
      date: string; // The date of the commit
    };
    message: string; // The commit message
    tree: {
      sha: string; // The SHA of the tree object
      url: string; // The URL of the tree object
    };
    url: string; // The URL of the commit
    comment_count: number; // The number of comments on the commit
    verification: {
      verified: boolean; // Whether the commit was verified
      reason: string; // The reason for verification
      signature: string | null; // The signature, if available
      payload: string | null; // The payload, if available
    };
  };
  url: string; // The URL of the commit
  html_url: string; // The HTML URL of the commit
  comments_url: string; // The URL for the comments on the commit
}
