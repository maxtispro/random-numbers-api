import { stdin, stdout } from "process";
import { createInterface } from "readline/promises";

export class ManualOverrides {
  private commandInfo = `
  (e)xit/close\t\tshuts down the server
  `;
  private readline = createInterface(stdin, stdout);
  private question = (q: string) => this.readline.question(q);
  private exec(command: string) {
    switch (command) {
      case "help":
        return this.commandInfo;
      case "exit":
      case "close":
      case "e":
        return "Server Shutting Down";
      default:
        return `Unknown command '${command}'. Type 'help'for a list of commands.`;
    }
  }

  async start(): Promise<void> {
    return this.question("")
      .then(input => this.exec(input))
      .then(output => this.readline.write(output))
      .then(() => this.start());
  }

  stop() {
    this.readline.close();
  }
}
