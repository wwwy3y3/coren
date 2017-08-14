import chalk from 'chalk';

exports.color = {
  success: text => chalk.green(text),
  error: text => chalk.red(text),
  warning: text => chalk.yellow(text)
};
