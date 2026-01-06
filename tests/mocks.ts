import { JIRA, IActionInputs } from '../src/types'

export const MOCK_GITHUB_ACTION_INPUT: IActionInputs = {
  GITHUB_TOKEN: 'GITHUB_TOKEN',
  JIRA_TOKEN: 'JIRA_TOKEN',
  JIRA_TICKET_ID: 'TKP-123',
  JIRA_API_VERSION: '3',
  JIRA_BASE_URL: 'https://testcompany.atlassian.net'
}
const MOCK_JIRA_ISSUE_FIELDS: JIRA.Issue['fields'] = {
  summary: 'summary',
  description: 'a description of the issue'
}
export const MOCK_JIRA_ISSUE: JIRA.Issue = {
  fields: MOCK_JIRA_ISSUE_FIELDS,
  id: '1',
  key: '1',
  self: '1'
}
