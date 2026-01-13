import { context, getOctokit } from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'
import { getInputs } from './action-inputs'
import { JIRA } from './types'
import { IGithubData, PullRequestParams } from './types'
import { isRunningTest, convertToMarkdown } from './utils'

export class GithubConnector {
  githubData: IGithubData = {} as IGithubData
  octokit: InstanceType<typeof GitHub>
  jira_api_version: string
  jira_issue!: JIRA.Issue
  jira_ticket_url!: string
  jira_ticket_id!: string

  constructor() {
    const { GITHUB_TOKEN, JIRA_API_VERSION } = getInputs()
    this.jira_api_version = JIRA_API_VERSION
    this.octokit = getOctokit(GITHUB_TOKEN)
    this.githubData = this.getGithubData()
  }

  async updateDescription() {
    await this.callout()
  }

  async callout() {
    const { owner, repo, pull_number } = this.githubData // TODO: use as input
    const body = this.body

    const prData: RestEndpointMethodTypes['pulls']['update']['parameters'] = {
      owner,
      repo,
      pull_number,
      body
    }

    if (!isRunningTest()) {
      await this.octokit.rest.pulls.update(prData)
    }
  }

  get body() {
    let description = convertToMarkdown(this.jira_issue.fields.description, this.jira_api_version)
    return `## Jira\n\n${this.jira_issue.fields.summary} ([${this.jira_ticket_id}](${this.jira_ticket_url}))\n\n## Description\n\n${description}`
  }

  private getGithubData(): IGithubData {
    const {
      eventName,
      payload: { repository, pull_request: pullRequest }
    } = context

    let owner: IGithubData['owner'] | undefined

    if (context?.payload?.organization) {
      owner = context?.payload?.organization?.login
    } else {
      owner = context.payload.repository?.owner.login
    }

    if (!owner) {
      throw new Error('Could not find owner.')
    }

    return {
      eventName,
      repo: repository?.name,
      owner,
      pullRequest: pullRequest as PullRequestParams,
      pull_number: pullRequest?.number || 0
    }
  }
}
