const j2m = require('jira2md')
const Parser = require('extended-markdown-adf-parser'); 

export function isRunningTest() {
  return process.env.JEST_WORKER_ID !== undefined
}

export function convertToMarkdown(description: any, apiVersion: string): string {
  if (apiVersion === '2') {
    return jiraToMarkdown(description)
  } else if (apiVersion === '3') {
    return adfToMarkdown(description)
  } else {
    return ''
  }
}

export function jiraToMarkdown(jiraText: string | undefined) {
  return typeof jiraText == 'string' ? j2m.to_markdown(jiraText) : ''
}

export function adfToMarkdown(adf: any): string {
  const parser = new Parser()
  return parser.adfToMarkdown(adf)
}