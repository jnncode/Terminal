import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, FooterComponent]
})
export class AppComponent {
  title = 'Terminal';
  commands: { command: string; output: string | (() => void) }[] = [
    { command: 'help', output: 'whoami<br />projects<br />socials<br />moomoo<br />skadoosh<br />clear'},
    { command: 'whoami', output: 'Indeed. Who are you, user? The world may never know.' },
    { command: 'projects', output: 'Visit www.jnncode.com for more information.'},
    { command: 'socials', output: 'Visit www.jnncode.com for more information.'},
    { command: 'moomoo', output: 'Moomoo is the name of my tuxedo cat I bought out of impulse in college (no regrets).'},
    { command: 'skadoosh', output: 'SKADOOOSH'},
    { command: 'clear', output: () => this.clearTerminal()},
  ];
  showCommands = false;
  user = 'user@jnncode.media';
  userColorClasses: string[] = ['green', 'white', 'blue', 'white'];

  /* User enters 'help' command that lists all available commands. */
  handleInput(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = (event.target as HTMLInputElement).value;
    if (keyboardEvent.key === 'Enter') {
      this.executeCommand(input);
    }
  }

  /* Returns each commands' output. */
  private executeCommand(command: string) {
    const matchedCommand = this.commands.find(cmd => cmd.command === command);
    if (matchedCommand) {
      if (typeof matchedCommand.output === 'string') {
        const output = matchedCommand.output;
        this.createOutput(output);
      } else if (typeof matchedCommand.output === 'function') {
        matchedCommand.output();
      }
      this.clearInput();
      this.createInput();
    } else {
      const output = `<p>Command not recognized: ${command}</p>`;
      this.createOutput(output);
    }
  }

  /* Clears the 'previous' input field. */
  private clearInput() {
    const inputContainer = document.getElementById('input-container');
    if (inputContainer) {
      const input = inputContainer.querySelector('input');
      if (input) {
        input.value = '';
        input.blur();
      }
    }
  }

  /* Handles inputs of commands. */
  private createInput() {
    const userCommandContainer = document.getElementById('user-command-container');
    if (userCommandContainer) {
      const newContainer = document.createElement('div');
      newContainer.className = 'user-command-group';
      newContainer.innerHTML += this.getUserString();
      const newInput = document.createElement('input');
      this.setupInput(newInput);
      newContainer.appendChild(newInput);
      const newOutputContainer = document.createElement('div');
      newOutputContainer.className = 'command-output';
      newContainer.appendChild(newOutputContainer);
      userCommandContainer.appendChild(newContainer);
      newInput.focus();
    }
  }

  /* Handles outputs of commands. */
  private createOutput(output: string) {
    const userCommandContainer = document.getElementById('user-command-container');
    if (userCommandContainer && userCommandContainer.lastChild) {
      // Find the last user command group
      const lastGroup = userCommandContainer.lastChild as HTMLElement;
      // Append the command output to the last user command group
      const outputContainer = lastGroup.querySelector('.command-output');
      if (outputContainer) {
        const newOutputContainer = document.createElement('div');
        newOutputContainer.className = 'command-output';
        newOutputContainer.innerHTML = output;
        outputContainer.appendChild(newOutputContainer);
      }
    } else {
      // If no user command group exists, create a new one
      this.createInput();
      this.createOutput(output);
    }
  }

  /* Create user. */
  private getUserString(): string {
    const userParts = this.user.split('@');
    return `<span class="${this.userColorClasses[0]}">${userParts[0]}</span><span class="green">@</span><span class="${this.userColorClasses[0]}">${userParts[1]}</span><span class="white">:</span><span class="blue">~</span><span class="white">$</span><span>&nbsp;</span>`;
  }

  /* Input field set up. */
  private setupInput(newInput: HTMLInputElement) {
    newInput.type = 'text';
    newInput.className = 'input';
    newInput.maxLength = 15;
    newInput.minLength = 1;
    newInput.size = 40;
    newInput.addEventListener('keyup', (event: KeyboardEvent) => this.handleInput(event));
  }

  private clearTerminal() {
    const userCommandContainer = document.getElementById('user-command-container');
    if (userCommandContainer) {
      userCommandContainer.innerHTML = '';
    }
    this.clearInput();
  }
}