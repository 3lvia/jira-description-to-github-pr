import { describe } from 'jest-circus'
import { getInputs } from '../src/action-inputs'
import { MOCK_GITHUB_ACTION_INPUT, MOCK_JIRA_ISSUE } from './mocks'
import nock from 'nock'
import { run } from '../src/main'

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

describe('Main()', () => {
  it('runs run()', async () => {
    ;(getInputs as any).mockImplementation(() => MOCK_GITHUB_ACTION_INPUT)

    const scope = nock(MOCK_GITHUB_ACTION_INPUT.JIRA_BASE_URL)
      .get('/rest/api/' + MOCK_GITHUB_ACTION_INPUT.JIRA_API_VERSION + '/issue/' + MOCK_GITHUB_ACTION_INPUT.JIRA_TICKET_ID)
      .reply(200, MOCK_JIRA_ISSUE)

    await run()

    expect(scope.isDone()).toBe(true)
  })
})
