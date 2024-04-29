import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      const commandName = command.getName();
      if(Object.hasOwn(this.commands, commandName)) {
        throw new Error(`Command ${commandName}`);
      }
      this.commands[commandName] = command;
    });
  }
}
