import { JiraConnector } from '../src/jira-connector'
import { describe } from 'jest-circus'
import { getInputs } from '../src/action-inputs'
import { MOCK_GITHUB_ACTION_INPUT, MOCK_JIRA_ISSUE } from './mocks'
import nock from 'nock'

jest.mock('@actions/github', () => {
  const MOCK_CONTEXT = {
    eventName: 'eventName',
    payload: {
      repository: 'repository',
      organization: { login: { owner: 'owner' } },
      pull_request: { title: 'prTitle', number: 1, head: { ref: 'branchName' } }
    }
  }
  return {
    getOctokit: jest.fn(),
    context: MOCK_CONTEXT
  }
})

jest.mock('../src/action-inputs')

describe('JiraConnector()', () => {
  let connector: JiraConnector

  it('initializes JiraConnector() class', () => {
    ;(getInputs as any).mockImplementation(() => MOCK_GITHUB_ACTION_INPUT)
    connector = new JiraConnector()
    expect(connector.api_url).not.toBeUndefined()
    expect(connector.token).not.toBeUndefined()
    expect(connector.ticket_id).not.toBeUndefined()
    expect(connector.ticket_id).toEqual(MOCK_GITHUB_ACTION_INPUT.JIRA_TICKET_ID)
    expect(connector.ticket_url).not.toBeUndefined()
  })

  it('runs updateDescription()', async () => {
    ;(getInputs as any).mockImplementation(() => MOCK_GITHUB_ACTION_INPUT)

    const scope = nock(MOCK_GITHUB_ACTION_INPUT.JIRA_BASE_URL)
      .get('/rest/api/' + MOCK_GITHUB_ACTION_INPUT.JIRA_API_VERSION + '/issue/' + MOCK_GITHUB_ACTION_INPUT.JIRA_TICKET_ID)
      .reply(200, MOCK_JIRA_ISSUE)

    await connector.getTicketData()

    expect(connector.api_url).toEqual('https://testcompany.atlassian.net/rest/api/3/issue/TKP-123')
    expect(connector.ticket_id).toEqual(MOCK_GITHUB_ACTION_INPUT.JIRA_TICKET_ID)
    expect(scope.isDone()).toBe(true)
    expect(connector.jira_issue.fields.summary).toEqual(MOCK_JIRA_ISSUE.fields?.summary)
  })
})
