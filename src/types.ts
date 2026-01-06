export interface PullRequestParams {
  number: number
  html_url?: string
  body?: string
  base: {
    ref: string
  }
  head: {
    ref: string
  }
  changed_files?: number
  additions?: number
  title?: string

  [key: string]: unknown
}

export namespace JIRA {
  export interface IssueStatus {
    self: string
    description: string
    iconUrl: string
    name: string
    id: string
    statusCategory: {
      self: string
      id: number
      key: string
      colorName: string
      name: string
    }
  }

  export interface IssuePriority {
    self: string
    iconUrl: string
    name: string
    id: string
  }

  export interface IssueType {
    self: string
    id: string
    description: string
    iconUrl: string
    name: string
    subtask: boolean
    avatarId: number
  }

  export interface IssueProject {
    self: string
    key: string
    name: string
  }

  export interface fields {
    summary: string
    description: string
    status: IssueStatus
    priority: IssuePriority
    issuetype: IssueType
    project: IssueProject
    labels: string[]
    [k: string]: unknown
  }
  export interface Issue {
    id: string
    key: string
    self: string
    fields: Partial<fields>
  }
}
export interface JIRADetails {
  key: string
  summary: string
  url: string
  type: {
    name: string
    icon: string
  }
  project: {
    name: string
    url: string
    key: string
  }
}

export interface IActionInputs {
  JIRA_TOKEN: string
  GITHUB_TOKEN: string
  JIRA_TICKET_ID: string
  JIRA_BASE_URL: string
  JIRA_API_VERSION: string
}

export interface IGithubData {
  eventName: string
  repo: any
  owner: string
  pullRequest: PullRequestParams
  pull_number: number
}
