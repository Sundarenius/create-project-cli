import arg from 'arg'
import inquirer from 'inquirer'
import { createProject } from './main'

// Arguments are found in 'process.argv'
const parseArgumentsIntoOptions = () => {
  const args = arg({
    '--git': Boolean,
    '--yes': Boolean,
    '--install': Boolean,
    '-g': '--git',
    '-y': '--yes',
    '-i': '--install'
  })
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  }
}

const promptForMissingOptions = async (options) => {
  const defaultTemplate = 'Javascript'
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    }
  }

  const questions = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to choose',
      choices: ['Javascript', 'Typescript'],
      default: defaultTemplate
    })
  }

  if (!options.git) {
    questions.push({
      type: 'Confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false
    })
  }

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  }
}

export const cli = async (args) => {
  const options = parseArgumentsIntoOptions(args)
  const newOptions = await promptForMissingOptions(options)
  await createProject(newOptions)
}
