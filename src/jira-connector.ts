import * as core from '@actions/core'
import { getInputs } from './action-inputs'
import { JIRA } from './types'

export class JiraConnector {
  api_url: string
  token: String
  ticket_id: string
  ticket_url: string
  jira_issue: JIRA.Issue = {} as JIRA.Issue

  constructor() {
    const { JIRA_TOKEN, JIRA_TICKET_ID, JIRA_BASE_URL, JIRA_API_VERSION } = getInputs()
    this.api_url = `${JIRA_BASE_URL}/rest/api/${JIRA_API_VERSION}/issue/${JIRA_TICKET_ID}`
    this.token = Buffer.from(JIRA_TOKEN).toString('base64')
    this.ticket_id = JIRA_TICKET_ID
    this.ticket_url = `${JIRA_BASE_URL}/browse/${JIRA_TICKET_ID}`
  }

  async getTicketData() {
    this.jira_issue = await this.callout()
  }

  async callout() {
    const response = await fetch(this.api_url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.token}`
      }
    })

    if (response.ok) {
      const issue = (await response.json()) as JIRA.Issue
      return issue
    } else {
      core.setFailed(
        `Failed to fetch response from Jira API. HTTP Error: ${response.status}. Error Message: ${response.statusText}`
      )
      process.exit(1)
    }
  }
}
