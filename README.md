# jira-description-to-github-pr
- Forked from [johnforeland/jira-description-to-github-pr](https://github.com/johnforeland/jira-description-to-github-pr)
- [ks-keshava-rao/Jira-description](https://github.com/ks-keshava-rao/Jira-description), converted to
  typescript
- With inspiration and code sampling from
  [cakeinpanic/jira-description-action](https://github.com/cakeinpanic/jira-description-action)

## Example Workflow

```yaml
name: Update PR Description from Jira
on:
  pull_request:
    types: [opened, reopened]

jobs:
  update_pr_description:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write # needed to allow updating pull requests
    steps:
      # Basic RegEx to find TKP-123 from 'feature/TKP-123-my-feature', 'bug/TKP-123-my-fix' or 'TKP-123-my-feature'
      - name: Find Jira Ticket ID from Branch
        run: echo "JIRA_ID=$(echo '${{ github.head_ref }}' | grep -Po '\w*-\d\w+')" >> $GITHUB_ENV #

      - name: Update PR description
        uses: johnforeland/jira-description-to-github-pr@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          jira-token: ${{ secrets.JIRA_API_TOKEN }}
          jira-ticket-id: ${{ env.JIRA_ID }}
          jira-base-url: https://testcompany.atlassian.net
```

## Inputs

| Name             | Description                                                                                                                              | Example                           | Required |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------- |
| `github-token`   | GitHub Token needed to update Pull Requests                                                                                              | ${{ secrets.GITHUB_TOKEN }}       | Yes      |
| `jira-token`     | Jira API token, see [Atlassian Docs](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) | `username:token`                  | Yes      |
| `jira-ticket-id` | Jira ticket ID                                                                                                                           | `TKP-123`                         | Yes      |
| `jira-base-url`  | Organisation's sub-domain for Jira.                                                                                                      | https://testcompany.atlassian.net | Yes      |

## Markdown Compatability

This build makes use of Jira REST API V2, which means that the Markdown formatting in Jira and GitHub pull requests may
not perfectly align. While certain advanced formatting features may not translate precisely, basic elements like plain
text, bullet points, and paragraphs remain consistent between the two platforms.
