import * as core from '@actions/core'
import { IActionInputs } from './types'

export const getInputs = (): IActionInputs => {
  const GITHUB_TOKEN: string = core.getInput('github-token', { required: true })
  const JIRA_TOKEN: string = core.getInput('jira-token', { required: true })
  const JIRA_TICKET_ID = core.getInput('jira-ticket-id', { required: true })
  const JIRA_API_VERSION: string = core.getInput('jira-api-version', { required: true })
  const JIRA_BASE_URL: string = core.getInput('jira-base-url', { required: true })
  return {
    GITHUB_TOKEN,
    JIRA_TOKEN,
    JIRA_TICKET_ID,
    JIRA_BASE_URL: JIRA_BASE_URL.endsWith('/') ? JIRA_BASE_URL.replace(/\/$/, '') : JIRA_BASE_URL,
    JIRA_API_VERSION,
  }
}
